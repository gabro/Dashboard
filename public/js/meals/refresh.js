(function() {
  var INTERVAL = 10000,
  socket = io.connect('http://localhost:3000'),
  $table = undefined;

  function refresh() {
    socket.emit('meals-refresh');
    setTimeout(refresh, INTERVAL);
  }

  function update(people) {
    $table.html('');
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
      $table.append(tr);
    });
  }

  $(document).ready(function() {
    $table = $('#meals-people');
    socket.on('meals-update', update);
    refresh();
  });
})();