import QRCode from 'qrcode';
import { makeUrlSafe } from '../helpers/string';

export async function GET({ request }: {
  request: Request;
}) {
  const url = new URL(request.url);
  const partyId = url.searchParams.get('partyid');

  if (!partyId) {
    return new Response(null, { status: 404 });
  }

  const svgUrl = `${url.protocol}//${url.hostname}${url.hostname === 'localhost' ? `:${url.port}` : ''}/join?party-id=${makeUrlSafe(partyId)}`
  try {
    const QRdata = await QRCode.toString(svgUrl, {
      errorCorrectionLevel: 'H',
      type: 'svg',
    });

    return new Response(QRdata, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(null, {
      status: 400,
      statusText: 'Error generating QR Code',
    });
  }
}
