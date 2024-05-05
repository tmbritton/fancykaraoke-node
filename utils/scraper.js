import { load } from "cheerio";
import { createClient } from "@libsql/client";
import axios from 'axios';

const client = createClient({
  url: process.env.FK_DB_URL,
  authToken: process.env.FK_DB_TOKEN
});

const args = process.argv.slice(2);
const timeStamp = Date.now();
const direction = 'desc';

const getCount = async () => {
  const result = await client.execute({
    sql: 'SELECT count(*) from songs',
    args: []
  });
  return result?.rows?.[0]?.['count (*)'];
}

const getKaraokeData = async (start, count) => {
  const url = `https://www.karaokenerds.com/Community/BrowseJson/?length=${count}&start=${start}&order[0][column]=3&order[0][dir]=${direction}&_=${timeStamp}`;
  const songData = await axios.get(url).then(({ data }) => {
    const songs = data?.data
    const songList = []

    const isYoutubeIdInList = (id) => songList.findIndex(song => song.youtubeId === id) > -1

    songs.forEach(item => {
      const artist = load(item[1])('a').text();
      const title = load(item[2])('a').text();
      const date = item[3];
      const uploader = load(item[4])('a').text();
      const youtubeLink = item[5].split('|')[0];
      const videoIdMatch = youtubeLink.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
      const youtubeId = videoIdMatch ? videoIdMatch[1] : null;
  
      if (youtubeId && artist && title && !isYoutubeIdInList(youtubeId)) {
        songList.push({
          artist,
          title,
          date,
          uploader,
          youtubeId
        })
      }
    });
    return songList;
  });
  return songData;
};

const main = async () => {
  const count = args[0];
  const start = await getCount() + 1;
  const songList = await getKaraokeData(start, count);
  let songsTableCount = 0;
  let ftsTableCount = 0;
  
  console.log(`Songs loaded: ${songList.length}`);

  let success = 0;
  let error = 0;

  for (const song of songList) {
    try {
      const result = await client.execute({
        sql: "insert into songs (artist, title, uploader, youtube_id) values (:artist, :title, :uploader, :youtube_id)",
        args: {
          artist: song.artist,
          title: song.title,
          uploader: song.uploader,
          youtube_id: song.youtubeId
        }
      });

      if (result) {
        console.log(`Imported artist: ${song.artist}, title: ${song.title}`);
        success++;
      }
    } catch (e) {
      error++;
    }
  }

  try {
    const resultz = await client.execute({
      sql: "SELECT COUNT(*) AS count FROM songs",
      args: []
    });
    songsTableCount = resultz?.rows?.[0]?.count;
    console.log(`Songs count: ${songsTableCount}`);
  } catch (e) {
    console.error(e);
  }

  try {
    const result3 = await client.execute({
      sql: "SELECT COUNT(*) AS count FROM song_fts",
      args: []
    });
    ftsTableCount = result3?.rows?.[0]?.count;
    console.log(`Virtual Table songs count: ${ftsTableCount}`);
  } catch (e) {
    console.error(e);
  }

  if (songsTableCount > ftsTableCount) {
    // Insert imported songs into fts virtual table.
    try {
      await client.execute({
        sql: `
          INSERT INTO song_fts (id, title, artist, uploader, youtube_id, created_at)
          SELECT s.id, s.title, s.artist, s.uploader, s.youtube_id, s.created_at
          FROM songs s
          LEFT JOIN song_fts f ON s.id = f.id
          WHERE f.id IS NULL;`,
        args: []
        })
      console.log(`${songsTableCount - ftsTableCount} loaded into fts virtual table`)
    } catch (e) {
      console.error(`Error inserting imported songs into song_fts table: ${e}`)
    }
  }

  console.log(`Success: ${success}`);
  console.log(`Error: ${error}`);
  return;
};

main()

export { getKaraokeData }