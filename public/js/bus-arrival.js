$(document).ready(function() {
  var refreshInterval = 30;
  var busNo = 157;
  var stopId = 6696;
  var socket = io.connect('http://localhost:3000');
  var $oldTile, $newTile;

  function appendRow(prd) {
    var arrivalTime = moment(prd.prdtm, "YYYYMMDD HH:mm");
    var now = moment(prd.tmstmp, "YYYYMMDD HH:mm");
    var humanizedTime = arrivalTime.diff(now, 'minutes') <= 1 ? "Due" : arrivalTime.from(now);
    $("<tr><td class=\"arrivalTime\">"+humanizedTime.replace("in ", "")+"</td></tr>").appendTo($newTile.find('table'));
  }

  // Get the current arrival time
  socket.emit("cta-refresh", {busNo: busNo, stopId: stopId});
  // Poll it periodically
  setInterval(function(){
    socket.emit("cta-refresh", {busNo: busNo, stopId: stopId});
  }, refreshInterval*1000);

  socket.on('cta-update', function (data) {
    var json = JSON.parse(data)["bustime-response"];

    if (!$oldTile)
      $oldTile = $('#bus-arrivals').parents('.tile');
    $newTile = $oldTile.clone();
    $newTile.find('table').html('');

    if (json.error || json.prd === undefined) {
      $("<tr><td class=\"arrivalTime error\">No arrival times</td></tr>").appendTo($newTile.find('table'));
    } else {
      if (!(json.prd instanceof Array)) {
        appendRow(json.prd);
      } else {
        json.prd.forEach(appendRow);
      }
    }

    animateTile($oldTile, $newTile, function() {
      $oldTile = $newTile;
    });
  });
});