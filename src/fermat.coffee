$ ->
  dragInterval = null
  ps = []
  drawAnswer = (p, ps, angle)->
    $("line").remove()
    $("circle.fermat-point").remove()
    wrapper = $('.svg-wrapper')
    svg = wrapper.find('svg').svg 'get'
    c = svg.circle p[0], p[1], 5,
      fill: "red"
    $(c).addClass('fermat-point')
    for op in ps
      svg.line op[0], op[1], p[0], p[1],
        "stroke-width": 1
        "stroke-dasharray": "10"
        stroke: "red"
        fill: "none"

  findFermatPoint = (ps)->

    # Calculate squared legs and Euclidean legs
    squaredLegs = []
    legs = []
    for i in [0...ps.length]
      p1 = ps[i]
      p2 = ps[(i + 1) % ps.length]
      sql = Math.pow(p1[0]-p2[0],2) + Math.pow(p1[1]-p2[1],2)
      squaredLegs.push sql
      legs.push Math.sqrt(sql)

    # Calculate semiperimeter
    s = (legs[0] + legs[1] + legs[2]) / 2

    # Calculate area (Heronic method)
    a = Math.sqrt(s * (s - legs[0]) * (s - legs[1]) * (s - legs[2]))

    # If any point forms an angle with the other two greater than
    # 2*Pi/3, the fermat point is that point.
    for i in [0...3]
      sql12 = squaredLegs[i]
      sql23 = squaredLegs[(i + 1) % 3]
      sql31 = squaredLegs[(i + 2) % 3]
      l12 = legs[i]
      l23 = legs[(i + 1) % 3]
      l31 = legs[(i + 2) % 3]
      theta = Math.acos((sql12 + sql31 - sql23) / (2 * l12 * l31))
      if theta > 2*Math.PI/3
        return [ps[i], ps, theta * 180 / Math.PI]

    # Calculate barycentrics
    bcs = []
    for i in [0...ps.length]
      sql12 = squaredLegs[i]
      sql23 = squaredLegs[(i + 1) % 3]
      sql31 = squaredLegs[(i + 2) % 3]
      l12 = legs[i]
      l23 = legs[(i + 1) % 3]
      l31 = legs[(i + 2) % 3]
      bc = Math.pow(sql12, 2) - 2*Math.pow(sql23 - sql31, 2) + sql12*(sql23 + sql31 + 4*Math.sqrt(3)*a)
      bcs.push bc

    # Convert barycentrics to cartesian coordinates
    point = [
      (bcs[1]*ps[0][0] + bcs[2]*ps[1][0] + bcs[0]*ps[2][0]) / (bcs[0] + bcs[1] + bcs[2]),
      (bcs[1]*ps[0][1] + bcs[2]*ps[1][1] + bcs[0]*ps[2][1]) / (bcs[0] + bcs[1] + bcs[2])
    ]

    [point, ps, null]

  dragCorner = (e, c)->
    index = parseInt(c.attributes['data-index'].value)
    offset = $("svg").offset()
    adjustedX = e.pageX - offset.left
    adjustedY = e.pageY - offset.top
    $(c).attr('cx', adjustedX)
    $(c).attr('cy', adjustedY)
    ps[index][0] = adjustedX
    ps[index][1] = adjustedY
    answer = findFermatPoint ps
    drawAnswer.apply(null, answer)

  $(".svg-wrapper svg").svg
    onLoad: ->

      wrapper = $('.svg-wrapper')
      svg = wrapper.find('svg').svg 'get'

      # Build and draw points
      for i in [0...3]
        p = [Math.floor(Math.random()*1000), Math.floor(Math.random()*800)]
        c = svg.circle p[0], p[1], 10
        $(c).addClass('corner').attr('data-index', i)
        ps.push p

      # Find and draw the answer
      answer = findFermatPoint ps
      drawAnswer.apply(null, answer)
      $("circle.corner").on('mousedown', ->
        c = @
        $("body").on('mousemove', (e)->
          dragCorner(e, c)
        )
      )
      $("body").on('mouseup', ->
        $("body").off('mousemove')
      )
