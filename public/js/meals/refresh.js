(function() {
  var INTERVAL = 5000,
  socket = io.connect('http://localhost:3000'),
  $tile = undefined,
  previous = [];

  function equals(p1, p2) {
    if (p1.length != p2.length)
      return false;
    for (var i = 0; i < p1.length; i++) {
      for (var a in p1[i]) {
        if (p1[i].hasOwnProperty(a)) {
          if (p1[i][a] != p2[i][a])
            return false
        }
      }
    }
    return true;
  }

  function refresh() {
    socket.emit('meals-refresh');
  }

  function update(people) {
    var $newTile = $tile.clone();
    $newTile.find('table').html('');
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
    if (!equals(people, previous)) {
      animateTile($tile, $newTile, function() {
        $tile = $newTile;
      });
    }
    previous = people;
    setTimeout(refresh, INTERVAL);
  }

  $(document).ready(function() {
    $tile = $('#meals').parents('.tile');
    socket.on('meals-update', update);
    refresh();
  });
})();