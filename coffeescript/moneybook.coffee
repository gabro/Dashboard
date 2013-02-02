window.MoneyBook = class MoneyBook
  constructor: (@evn, @abbrevs) ->
  
  parse: (txt) ->
    @abbrevs = null
    @evn = new Event("event")
    @date = null
    @group = null
    @currency = 1
    txtLines = txt.split("\n")
    i = 1
    for txtLine in txtLines
      do =>
        @parseTxtLine txtLine, i
        i += 1
    
  computeSummaryByDate: ->
    brain = new Brain(@evn)
    brain.clear()
    brain.compute()
    out = "<pre>"
    for date, value of @evn.days
      do =>
        out += "#{date}\n"
        for name, balance of value.today
          out += "#{name}: #{roundNumber balance, 2}, spent: #{roundNumber value.todaySpent[name], 2}, given: #{roundNumber value.todayGiven[name], 2}\n"
        out += "balance:\n"
        for name, balance of value.balance
          out += "#{name}: #{roundNumber balance, 2}, spent: #{roundNumber value.spent[name], 2}, given: #{roundNumber value.given[name], 2}\n"
        out += "\n"
    out += "</pre>"
    out
    
  computeSummary: ->
    brain = new Brain(@evn)
    brain.clear()
    brain.compute()
    out = "<pre>"
    for p in @evn.people
      do =>
        out += "#{p.name}: #{roundNumber p.balance, 2} (spent: #{roundNumber p.spent, 2}, given: #{roundNumber p.given, 2})\n"
    out += "</pre>"
    out

  parseTxtLine: (txtLine, line_number) ->
    
    ## COMMENTS FIRST..
    
    pattern = /^\s*\#\s*.+\s*$/;
    if pattern.test txtLine
      line = new Line(txtLine)
      line.string = txtLine
      line.isComment = true
      @evn.lines.push line
      return true
      
    ## PREPROCESSING..
    
    # javascript evaluation (for math..)
    # TODO -- syntax like $...$ 

    # debts: xxx @ yyy
    pattern = /^\s*(\d+(\.\d+)?)\s+([^\#]+)\s*\@\s*([^\#]+)\s*(\#.+)?$/
    if pattern.test txtLine
      match = pattern.exec txtLine
      txtLine = "debt (#{match[4]} #{match[1]}) #{match[3]}"
    
    # paybacks: xxx -> yyy
    pattern = /^\s*(\d+(\.\d+)?)\s+([^\#]+)\s*\-+\>\s*([^\#]+)\s*(\#.+)?$/
    if pattern.test txtLine
      match = pattern.exec txtLine
      txtLine = "payback (#{match[3]} #{match[1]}) #{match[4]}"
    
    ## PROCESSING..
    
    # people..
    pattern = /^\s*@\s*people\s*\:\s*([\w\s]+)\s*/
    if pattern.test txtLine
      match = pattern.exec txtLine
      names = match[1].split(/\s+/)
      @abbrevs = abbrev(name.toLowerCase() for name in names)
      @evn.people.push new Person(name) for name in names
      line = new Line(txtLine)
      line.isCommand = true
      @evn.lines.push line
      # set default group to all people
      if @group == null
        @group = []
        @group.push person for person in @evn.people
      return true

    # group..
    pattern = /^\s*@\s*group\s*\:\s*([\w\s]+)\s*/
    if pattern.test txtLine
      match = pattern.exec txtLine
      names = match[1].split(/\s+/)
      @group = []
      for name in names
        do (name) => 
          person = @getPersonByName name
          if not person?
            alert "ERROR: person '#{payrMatch[1]}' doesn't exist!"
            return false
          @group.push person
      line = new Line(txtLine)
      line.isCommand = true
      @evn.lines.push line
      return true

    # nogroup
    pattern = /^\s*@\s*no([\s\-]*)*group\s*/
    if pattern.test txtLine
      @group = []
      @group.push person for person in @evn.people
      line = new Line(txtLine)
      line.isCommand = true
      @evn.lines.push line
      return true

    # date..
    pattern = /^\s*\@\s*date\s*:\s*(.+)\s*$/;
    if pattern.test txtLine
      match = pattern.exec(txtLine);
      #@date = Date.parse(match[1]); removed to allow generic string dates
      @date = match[1].replace(/^\s+|\s+$/g, '');
      line = new Line(txtLine)
      line.string = txtLine      
      line.isCommand = true
      @evn.lines.push line
      return true
      
    # currency
    pattern = /^\s*\@\s*currency\s*:\s*(.+)\s*$/;
    if pattern.test txtLine
      match = pattern.exec(txtLine);
      @currency = parseFloat match[1];
      line = new Line(txtLine)
      line.string = txtLine      
      line.isCommand = true
      @evn.lines.push line
      return true

    # value lines  
    pattern = /^\s*([\w\ \'\*\%\~]+?)\s*\(\s*(.+)\s*\)\s*([^\#\&]+)?\s*(\&?)\s*(\#.+)?/
    if pattern.test txtLine
      match = pattern.exec txtLine
      line = new Line(match[1])
      payrTxts = match[2].split(/\s+(?=[a-zA-Z])/)
      payrPattern = /([A-Za-z]+)\s*([\d\.]+)/
      benTxts = if match[3] then match[3].split(/\s+(?=[a-zA-Z])/) else []
      benPattern = /([A-Za-z]+)(\s+([\d\.\+\-\*\s]+))?/
      # for lines like beer (luca 20) marco *2 luca +2
      # where usually you would divide among others
      # put & at the end to prevent this
      line.preventDivideAmongOthers = true if match[4] == "&"
      if @currency != null
          line.currency = @currency
      line.group = []
      line.group.push person for person in @group
      for payrTxt in payrTxts
        do (payrTxt) =>
          payrMatch = payrPattern.exec payrTxt
          if not payrMatch?
            alert "ERROR in line #{line_number}: #{txtLine}"
            return false
          person = @getPersonByName payrMatch[1]
          if not person?
            alert "ERROR: person '#{payrMatch[1]}' doesn't exist!"
            return false
          payr = new Payr(person)
          payr.amount = parseFloat (payrMatch[2] * line.currency)
          line.payrs.push payr
      for benTxt in benTxts
        do (benTxt) =>
          benTxt = benTxt.replace(/^\s+|\s+$/g, '') # trim white spaces
          benMatch = benPattern.exec benTxt
          if not benMatch?
            alert "ERROR in line #{line_number}: #{txtLine}"
            return false
          person = @getPersonByName benMatch[1]
          if not person?
            alert "ERROR: person '#{benMatch[1]}' doesn't exist!"
            return false
          ben = new Ben(person)
          if benMatch[3] != null
            if /^\d+(\.\d+)?$/.test benMatch[3]
              ben.amount = parseFloat (benMatch[3] * line.currency)
            else
              if (x = /[\+\-]\d+(\.\d+)?/.exec benMatch[3])
                ben.offset = parseFloat (x[0] * line.currency)
              if (x = /\*(\d+(\.\d+)?)/.exec benMatch[3])
                ben.multiply = parseFloat x[1]
          line.bens.push ben
      if @date != null
        line.date = @date
      line.string = txtLine
      if line.desc == 'debt' or ~line.desc.indexOf "~"
        line.type = 'debt'
      else if line.desc == 'payback'
        line.type = 'payback'
      else if line.desc == 'personal'
        line.type = 'personal'
      else
        line.type = 'split'
      if line.desc.indexOf("*") != -1
        line.shareMissing = true
      if line.desc.indexOf("%") != -1
        line.reverse = true
      @evn.lines.push line
      return true
    
    # notify error except for empty lines
    pattern = /^\s*$/
    if not pattern.test txtLine
      alert "SYNTAX ERROR IN LINE: #{txtLine}"
    return false
      
  getPersonByName: (name) ->
    out = null
    name = @abbrevs[name.toLowerCase()]
    return null if name == undefined
    for person in @evn.people
      do (person) =>
        return false if out != null
        if person.name.toLowerCase() == name.toLowerCase()
          out = person
    out