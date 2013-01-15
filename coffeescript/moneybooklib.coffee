window.Brain = class Brain
  constructor: (@event) ->
    
  clear: ->
    ((person) -> person.balance = 0) person for person in @event.people
    ((person) -> person.given = 0) person for person in @event.people
    ((person) -> person.spent = 0) person for person in @event.people    
    ((ben) -> ben.owes = 0) ben for ben in line.bens for line in @event.lines
    ((ben) -> ben.balance = 0) ben for ben in line.bens for line in @event.lines
    ((payr) -> payr.balance = 0) payr for payr in line.payrs for line in @event.lines
    @event.days = {}
  
  computeBen: (ben) ->
    # check for consistency
    if (ben.amount? and ben.offset != 0) or (ben.amount? and ben.multiply != 1)
      alert "beneficiary '#{ben.person.name} with amount #{ben.amount} is inconsistent"
  
  computeLine: (line) ->
    totalAmount = line.computeTotalAmount()
    totalFixedAmount = line.computeTotalFixedAmount()
    ## * processing (manages taxes/tips if all have fixed amounts)
    if line.shareMissing
      percentage = totalAmount / totalFixedAmount
      for ben in line.bens
        do =>
          ben.amount *= percentage
    ##
    totalFixedAmount = line.computeTotalFixedAmount()
    totalOffset = line.computeTotalOffset()
    amountToDivide = totalAmount - totalFixedAmount - totalOffset
    divideAmongOthers = true
    # check total fixed amount..
    if totalFixedAmount > totalAmount + 0.1
      alert "error on line #{line.desc}: total fixed amount (#{totalFixedAmount}) is greater that total amount (#{totalAmount})"
    else if Math.abs(totalFixedAmount - totalAmount) < 0.1 or line.preventDivideAmongOthers
      divideAmongOthers = false
    # check if bens are all right..
    for ben in line.bens
      do => @computeBen ben
    # should we divide amont others?
    if divideAmongOthers
      for ben in line.bens
        do => divideAmongOthers = false if ben.isEmpty()
    # insert missing implicit bens
    if divideAmongOthers
      for person in line.group
        do =>
          if not line.personIsBen person
            line.bens.push(new Ben(person))
    # compute owes
    totalMultiply = line.computeTotalMultiply()
    amountForEachOne = amountToDivide / totalMultiply
    for ben in line.bens
      do (ben) =>
        if ben.amount?
          ben.owes = ben.amount
        else
          ben.owes = amountForEachOne * ben.multiply + ben.offset
        
  savePayrToDate: (date, person, amount) ->
    @event.days[date] ?= {today: {}, todayGiven: {}, todaySpent: {}, balance: {}, spent: {}, given: {}}
    if not @event.days[date].today[person.name]?
       @event.days[date].today[person.name] = 0
       @event.days[date].todayGiven[person.name] = 0
       @event.days[date].todaySpent[person.name] = 0
    @event.days[date].today[person.name] += roundNumber amount, 2
    @event.days[date].todayGiven[person.name] += roundNumber amount, 2        
    @event.days[date].balance[person.name] = person.balance
    @event.days[date].spent[person.name] = person.spent
    @event.days[date].given[person.name] = person.given        
    
  saveBenToDate: (date, person, owes) ->
    @event.days[date] ?= {today: {}, todayGiven: {}, todaySpent: {}, balance: {}, spent: {}, given: {}}
    if not @event.days[date].today[person.name]?
       @event.days[date].today[person.name] = 0
       @event.days[date].todayGiven[person.name] = 0
       @event.days[date].todaySpent[person.name] = 0
    @event.days[date].today[person.name] -= roundNumber owes, 2
    @event.days[date].todaySpent[person.name] += roundNumber owes, 2
    @event.days[date].balance[person.name] = person.balance   
    @event.days[date].spent[person.name] = person.spent
    @event.days[date].given[person.name] = person.given        
  
  compute: ->
    for line in @event.lines
      do (line) =>
        return if line.isComment or line.isCommand
        @computeLine line
        for payr in line.payrs
          do (payr) =>
            if line.reverse == false
              payr.person.balance += roundNumber payr.amount, 2
              payr.person.given   += roundNumber payr.amount, 2
            else
              payr.person.balance -= roundNumber payr.amount, 2
            payr.balance = payr.person.balance
            @savePayrToDate(line.date, payr.person, payr.amount) if line.date != null            
        for ben in line.bens
          do (ben) =>
            if line.reverse == false
              ben.person.balance -= roundNumber ben.owes, 2
              if line.type != 'debt' and line.type != 'payback'
                ben.person.spent   += roundNumber ben.owes, 2
            else
              ben.person.balance += roundNumber ben.owes, 2
            ben.balance = ben.person.balance
            @saveBenToDate(line.date, ben.person, ben.owes) if line.date != null

window.Event = class Event
  constructor: (@title) ->
    @people = []
    @lines  = []
    @days   = {}

window.Person = class Person
  constructor: (@name) ->  
    @balance = 0
    @spent = 0
    @given = 0

window.Line = class Line
  constructor: (@desc) ->
    @currency = 1  
    @bens  = []
    @payrs = []
    @date = null
    @group = null
    @string = ""
    @isComment = false
    @isCommand = false
    @shareMissing = false
    @reverse = false
    @preventDivideAmongOthers = false
    @type = 'split' # can be split, debt, payback, personal
    
  computeTotalAmount: ->  
    tot = 0
    for payr in @payrs
      do (payr) ->
        tot += payr.amount
    tot
    
  computeTotalFixedAmount: ->
    tot = 0
    for ben in @bens
      do (ben) ->
        tot += ben.amount
    tot
  
  computeTotalOffset: ->
    tot = 0
    for ben in @bens
      do (ben) ->
        tot += ben.offset
    tot
    
  computeTotalMultiply: ->
    tot = 0
    for ben in @bens
      do (ben) ->
        tot += ben.multiply if ben.amount == null
    tot
    
  personIsBen: (person) ->
    out = false
    for ben in @bens
      do ->
        out = true if ben.person == person
    out
    
  getPayrByPerson: (person) ->
    out = null
    for payr in @payrs
      do ->
        out = payr if payr.person == person
    out
    
  getBenByPerson: (person) ->
    out = null
    for ben in @bens
      do ->
        out = ben if ben.person == person
    out
    
window.Ben = class Ben
  constructor: (@person) ->
    @amount = null
    @owes = 0
    @offset = 0
    @multiply = 1
    @balance = null
  
  isEmpty: () ->
    @amount == null and @offset == 0 and @multiply == 1
  
window.Payr = class Payr
  constructor: (@person) ->
    @amount = 0
    @balance = null