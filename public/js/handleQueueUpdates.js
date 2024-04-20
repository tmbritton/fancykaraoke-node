(() => {
  window.addEventListener("load", () => {
    const url = new URL(window.location.href);
    let slug = '';
    let context = '';
    let data = '';
    const pathSegments = url.pathname.split('/');
    context = pathSegments[1];
    slug = pathSegments[2];

    const eventSource = new EventSource('/sse');

    eventSource.onopen = (e) => {
      console.log('SSE listener opened');
    }
    
    eventSource.addEventListener('queueUpdated', (event) => {
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.error('Error parsing SSE message data:', error);
      }

      // If event pertains to this party.
      if (data && slug === data.slug) {
        const queueElement = document.getElementById('songQueue');
        const event = new Event('queueUpdated');
        if (queueElement) {
          queueElement.dispatchEvent(event);
        } else {
          console.warn('No queue found on page :(');
        }
      }

    });
    
    eventSource.addEventListener('error', (error) => {
      console.error('SSE connection error:', error);
    });
  });
})();