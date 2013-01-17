(function() {
  var INTERVAL = 5000,
  socket = io.connect('http://localhost:3000'),
  $tile = undefined;

  function refresh() {
    socket.emit('meals-refresh');
  }

  function update(people) {
    var $newTile = $tile.clone();
    people.forEach(function(person) {
      var tr = '<tr';
      if (person.set)
        tr += ' class="updated"';
      tr += '><td>' + person.name +
      '</td><td><div';
      if (person.lunch)
        tr += ' class="mycheckbox mychecked"';
      else
        tr += ' class="mycheckbox"';
      tr += '/></td><td><div';
      if (person.dinner)
        tr += ' class="mycheckbox mychecked"';
      else
        tr += ' class="mycheckbox"';
      tr += '/></td>'
      $newTile.find('table').append(tr);
    });
    animateTile($tile, $newTile, function() {
      $tile = $newTile;
    });
    setTimeout(refresh, INTERVAL);
  }

  $(document).ready(function() {
    $tile = $('#meals').parents('.tile');
    socket.on('meals-update', update);
    refresh();
  });
})();