(($)->
  extractTransform = (strVal=null)->
    return [] if !strVal?
    commands = strVal.split /\)[, ]/
    commandNames = $.map(commands, (str)->
      str.split(/\(/)[0]
    )
    commandParams = []
    $.each(commands, (i, str)->
      pstr = str.split(/\(/)[1].split(/[, ]/)
      ps = []
      $.each pstr, (i, p)->
        if p.length > 0
          ps.push(Number($.trim(p).match /-?\d*\.?\d*/))
      if commandNames[i] == "translate" && ps.length == 1
        ps.push 0
      if commandNames[i] == "scale" && ps.length == 1
        ps.push ps[0]
      commandParams.push ps
    )
    commandList = []
    $.each(commandNames, (i, cmd)->
      el =
        name: cmd
        params: commandParams[i]
      commandList.push el
    )
    commandList
  compileTransform = (commands)->
    commandStrs = []
    $.each(commands, (i, cmd)->
      strVal = cmd.name + "("
      params = $.map(cmd.params, (el)->
        el.toString()
      )
      strVal += params.join(',')
      strVal += ')'
      commandStrs.push strVal
    )
    commandStrs.join ' '
  swapCommand = (commands, command)->
    extantIndex = null
    $.each commands, (i, cmd)->
      extantIndex = i if cmd.name == command.name
    if extantIndex?
      commands[extantIndex] = command
    else
      commands.push command
    commands

  $.fn.transform = (value=null)->
    if (value == null)
      extractTransform(@attr('transform'))
    else if (typeof value == 'string')
      @attr 'transform', value
    else if (typeof value == 'object')
      @attr 'transform', compileTransform(value)
  $.fn.rotate = (deg=null)->
    transf = @transform()
    if (!deg?)
      rot = 0
      $.each(transf, (i, cmd)->
        rot = cmd.params[0] if cmd.name == "rotate"
      )
      rot
    else
      @data 'rot', Number(deg)
      rot = {name: 'rotate', params: [Number(deg)]}
      @transform swapCommand(transf, rot)
  $.fn.scale = (x=null,y=null)->
    transf = @transform()
    if (!x? && !y?)
      transl = [1,1]
      $.each(transf, (i, cmd)->
        transl = cmd.params if cmd.name == "scale"
      )
      transl
    else
      y ?= x
      @data 'scale-x', Number(x)
      @data 'scale-y', Number(y)
      transl = {name: 'scale', params: [Number(x),Number(y)]}
      @transform swapCommand(transf, transl)
  $.fn.scaleX = (x=null)->
    transf = @transform()
    if (!x?)
      @scale()[0]
    else
      transl = {name: 'scale', params: [Number(x),@scaleY()]}
      @transform swapCommand(@transform(), transl)
  $.fn.scaleY = (y=null)->
    if (!y?)
      @scale()[1]
    else
      transl = {name: 'scale', params: [@scaleX(),Number(y)]}
      @transform swapCommand(@transform(), transl)
  $.fn.translate = (x=null,y=null)->
    transf = @transform()
    if (!x? && !y?)
      transl = [0,0]
      $.each(transf, (i, cmd)->
        transl = cmd.params if cmd.name == "translate"
      )
      transl
    else
      y ?= 0
      @data 'translate-x', Number(x)
      @data 'translate-y', Number(y)
      transl = {name: 'translate', params: [Number(x),Number(y)]}
      @transform swapCommand(transf, transl)
  $.fn.translateX = (x=null)->
    if (!x?)
      @translate()[0]
    else
      transl = {name: 'translate', params: [Number(x),@translateY()]}
      @transform swapCommand(@transform(), transl)
  $.fn.translateY = (y=null)->
    if (!y?)
      @translate()[1]
    else
      transl = {name: 'translate', params: [@translateX(),Number(y)]}
      @transform swapCommand(@transform(), transl)
  $.fn.translateXRel = (x=0)->
    transl = {name: 'translate', params: [@translateX() + Number(x),@translateY()]}
    @transform swapCommand(@transform(), transl)
  $.fn.translateYRel = (y=0)->
    transl = {name: 'translate', params: [@translateX(),@translateY() + Number(y)]}
    @transform swapCommand(@transform(), transl)
  $.fn.size = (x=null, y=null)->
    if !x? && !y?
      if @[0].tagName == "rect"
        [Number(@attr('width')/2), Number(@attr('height')/2)]
      else if @[0].tagName == "ellipse"
        [Number(@attr('rx')), Number(@attr('ry'))]
      else if @[0].tagName == "circle"
        [Number(@attr('r')), Number(@attr('r'))]
      else
        [Number(@data('rx')), Number(@data('ry'))]
    else
      y ?= x
      @data('rx',x)
      @data('ry',y)
      if @[0].tagName == "rect"
        @attr('x',-x)
        @attr('width',x*2)
        @attr('y',-y)
        @attr('height',y*2)
      else if @[0].tagName == "ellipse"
        @attr('rx',x)
        @attr('ry',y)
      else if @[0].tagName == "circle"
        @attr('r',x)
      else
        @data('rx',x)
        @data('ry',y)
  $.fn.sizeX = (x=null)->
    if !x?
      @size()[0]
    else
      @size(x,@sizeY())
  $.fn.sizeY = (y=null)->
    if !y?
      @size()[1]
    else
      @size(@sizeX(),y)
)(jQuery)
