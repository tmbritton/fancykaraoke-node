import type { APIRoute } from 'astro';
import pubSub from '../helpers/pubSub';

export const GET: APIRoute = async ({ request }) => {
  const body = new ReadableStream({
    start(controller) {
      // Encoder for converting strings to Uint8Array
      const encoder = new TextEncoder();
   
      const sendEvent = (data: any, eventType: string) => {
        const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      pubSub.subscribe('queueUpdated', (payload) => {
        sendEvent(payload, 'queueUpdated');
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