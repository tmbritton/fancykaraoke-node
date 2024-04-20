import type { APIRoute } from 'astro';
import pubSub from '../../../helpers/pubSub';

export const GET: APIRoute = async ({ request }) => {
  const body = new ReadableStream({
    start(controller) {
      // Encoder for converting strings to Uint8Array
      const encoder = new TextEncoder();
   
      const sendEvent = (data: any) => {
        const message = `${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      pubSub.subscribe('queueUpdated', (payload) => {
        const url = new URL(request.url);
        const urlSlug = url?.pathname?.split('/')?.[2];
        if (urlSlug === payload?.slug) {
          sendEvent(payload);
        }
      })

      request.signal.addEventListener('abort', () => {
        controller.close();
      });
    } 
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
