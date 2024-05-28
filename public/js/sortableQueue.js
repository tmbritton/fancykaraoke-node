htmx.onLoad(function(content) {
  const sortable = document.getElementById('songQueue');
  const instance = new Sortable(sortable, {
    animation: 150,
    ghostClass: 'ghost',
    draggable: '.sort',

    // Make the `.htmx-indicator` unsortable
    filter: ".htmx-indicator",
    onMove: function (evt) {
      return evt.related.className.indexOf('htmx-indicator') === -1;
    },

    // Disable sorting on the `end` event
    onEnd: function (evt) {
      this.option("disabled", true);
    }
  })
});