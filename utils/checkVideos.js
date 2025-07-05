const puppeteer = require('puppeteer');

async function checkVideoAvailability(videoId) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body>
        <iframe id="yt-embed" width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <script src="https://www.youtube.com/iframe_api"></script>
        <script>
          let videoStatus = null;
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

          window.onYouTubeIframeAPIReady = async function () {
            let player = await document.getElementById('yt-embed')?.getYTPlayer();
            player.addEventListener('onReady', function() {
              const videoData = player.getVideoData();
              if (videoData && videoData.isPlayable) {
                videoStatus = 'available';
              } else {
                videoStatus = 'unavailable';
              }
              document.body.setAttribute('data-status', videoStatus);
            });

            player.addEventListener('onError', function(event) {
              videoStatus = 'unavailable';
              document.body.setAttribute('data-status', videoStatus);
            });
          }
        </script>
      </body>
    </html>
  `);

	try {
		await page.waitForFunction('document.body.getAttribute("data-status") !== null', {
			timeout: 10000
		});
		const status = await page.evaluate(() => document.body.getAttribute('data-status'));
		return status === 'available';
	} catch (error) {
		console.error(`Error checking video ${videoId}:`, error.message);
		return false;
	} finally {
		await browser.close();
	}
}

async function updateDatabase(videoId, isAvailable) {
	// Implement your database update logic here
	console.log(
		`Video ${videoId} is ${isAvailable ? 'available' : 'unavailable'}. Updating database.`
	);
	// Update your database here
}

async function processVideos(videoIds) {
	for (const videoId of videoIds) {
		const isAvailable = await checkVideoAvailability(videoId);
		await updateDatabase(videoId, isAvailable);
	}
}

// Example usage
const videoIds = ['dQw4w9WgXcQ', 'invalidVideoId' /* ... other video IDs ... */];
processVideos(videoIds)
	.then(() => {
		console.log('Video processing completed');
	})
	.catch((error) => {
		console.error('Error processing videos:', error);
	});
