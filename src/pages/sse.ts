import type { APIRoute } from 'astro';
import pubSub from '../helpers/pubSub';

export const GET: APIRoute = async ({ request }) => {
  const body = new ReadableStream({
    start(controller) {
      // Encoder for converting strings to Uint8Array
      const encoder = new TextEncoder();
   
      const sendEvent = (data: any, eventType: string) => {
        const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        try {
          controller.enqueue(encoder.encode(message));
        } catch(e) {
          cleanup()
        }
      };

      pubSub.subscribe('queueUpdated', (payload) => {
        sendEvent(payload, 'queueUpdated');
      })

      // Send keepalive events every second
      const keepaliveInterval = setInterval(() => {
        sendEvent({}, 'keepalive');
      }, 10000); 
      
      sendEvent({}, 'Hello!');

      const cleanup = () => {
        clearInterval(keepaliveInterval);
      }
      
      request.signal.addEventListener('abort', () => {
        console.log('close controller');
        cleanup()
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