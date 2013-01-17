window.roundNumber = (num, dec) ->
  Math.round(num * Math.pow(10,dec)) / Math.pow(10,dec)

window.rn = (num) ->
  roundNumber num, 2

window.drawChart = (mb, divId) =>
  data = new google.visualization.DataTable()
  data.addColumn('string', 'Person')
  data.addColumn('number', 'receives')
  for index, value of mb.evn.people
    do =>
      data.addRows([[value.name, value.balance]])
  options =
    titlePosition: 'none'
    title: "asdf"
    backgroundColor: 'b91d47'
    colors: ['d7748e']
    vAxis: {textStyle: {color: 'white', fontName: "Open Sans"}, textPosition: "out"}
    hAxis: {textPosition: 'none', gridlines: {count: 0, color: 'd7748e'}, viewWindowMode: 'pretty', baselineColor: 'd7748e'}
    width: 210
    height: 260
    legend: 'none'
  chart = new google.visualization.BarChart(document.getElementById(divId))
  chart.draw(data, options)
  
window.drawChartsByDay = (mb, divId) ->
  for day, vv of mb.evn.days
    $("#"+divId).append("<div id='chart_div_" + day + "'></div>")
    data = new google.visualization.DataTable()
    data.addColumn('string', 'Person')
    date = new Date(parseInt(day))
    data.addColumn('number', date.format("dd mmm yyyy"))
    data.addColumn('number', 'Balance')
    for name, balance of mb.evn.days[day].today
      do =>
        tot = mb.evn.days[day].balance[name]
        data.addRows([[name, rn(balance), rn(tot)]])
    options = {'title':'day: ' + day.toString(), 'width': 280, 'height':300}
    table = new google.visualization.Table(document.getElementById('chart_div_' + day))
    formatter = new google.visualization.BarFormat({width: 80})
    formatter.format(data, 1)
    table.draw(data, {allowHtml: true, showRowNumber: true})
    
window.drawChartsByLine = (mb, divId) ->
  line_n = 0
  for line in mb.evn.lines
    if line.isComment
      $("#"+divId).append("<span style='color:red'>#{line.string}</span><br/>")
    else if line.isCommand
      $("#"+divId).append("<span style='color:blue'>#{line.string}</span><br/>")
    else
      $("#"+divId).append("#{line.string}<br/><div id='chart_div_line_" + line_n + "'></div>")
      data = new google.visualization.DataTable()
      data.addColumn('string', 'Person')
      data.addColumn('number', "Owes")
      data.addColumn('number', "Paid")
      data.addColumn('number', "Diff")
      data.addColumn('number', 'Balance')
      for ben in line.bens
        do =>
          amountPaid = if line.getPayrByPerson(ben.person)? then roundNumber(line.getPayrByPerson(ben.person).amount, 2) else 0
          data.addRows([[ben.person.name, roundNumber(ben.owes,2), amountPaid, roundNumber(amountPaid-ben.owes,2),rn ben.balance]])
      for payr in line.payrs
        do =>
          if not line.personIsBen payr.person
            data.addRows([[payr.person.name, 0, roundNumber(payr.amount,2), roundNumber(payr.amount,2),rn payr.balance]])
      options = {'title': line.string, 'width': 280, 'height':300}
      table = new google.visualization.Table(document.getElementById('chart_div_line_' + line_n))
      formatter = new google.visualization.BarFormat({width: 80})
      formatter.format(data, 1)
      formatter.format(data, 2)
      formatter.format(data, 3)
      formatter.format(data, 4)
      table.draw(data, {allowHtml: true, showRowNumber: true})
      line_n += 1