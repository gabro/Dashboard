$(document).ready(function() {
  var refreshInterval = 30;
  var socket = io.connect('/');

  function appendRow(prd,busNo) {
    var arrivalTime = moment(prd.prdtm, "YYYYMMDD HH:mm");
    var now = moment(prd.tmstmp, "YYYYMMDD HH:mm");
    var humanizedTime = arrivalTime.diff(now, 'minutes') <= 1 ? "Due" : arrivalTime.from(now);
    $("<tr><td class=\"arrivalTime\">"+humanizedTime.replace("in ", "")+"</td></tr>").appendTo($("#bus-arrivals-"+busNo));
  }

  function emtpy(table) {
    table.find("tr").remove();
  }

  // Get the current arrival time
  socket.emit("cta-refresh", {busNo: 157, stopId: 6696});
  socket.emit("cta-refresh", {busNo: 12, stopId: 302});
  // Poll it periodically
  setInterval(function(){
    socket.emit("cta-refresh", {busNo: 157, stopId: 6696});
    socket.emit("cta-refresh", {busNo: 12, stopId: 302});
  }, refreshInterval*1000);

  socket.on('cta-update', function (data) {
    var json = JSON.parse(data)["bustime-response"];
    var busNo;
    var $timetable;

    if (json.error || json.prd === undefined) {
      busNo = json.error.rt;
      $timetable = $("#bus-arrivals-"+busNo);
      emtpy($timetable);
      $("<tr><td class=\"arrivalTime error\">No arrival times</td></tr>").appendTo($timetable);
    } else {
      if (!(json.prd instanceof Array)) {
        busNo = json.prd.rt;
        $timetable = $("#bus-arrivals-"+busNo);
        emtpy($timetable);
        appendRow(json.prd, busNo);
      } else {
        busNo = json.prd[0].rt;
        $timetable = $("#bus-arrivals-"+busNo);
        emtpy($timetable);
        json.prd.forEach(function(prd) {appendRow(prd, busNo);});
      }
    }
  });
});
