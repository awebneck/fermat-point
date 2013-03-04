// Generated by CoffeeScript 1.6.0
(function() {

  (function($) {
    var compileTransform, extractTransform, swapCommand;
    extractTransform = function(strVal) {
      var commandList, commandNames, commandParams, commands;
      if (strVal == null) {
        strVal = null;
      }
      if (strVal == null) {
        return [];
      }
      commands = strVal.split(/\)[, ]/);
      commandNames = $.map(commands, function(str) {
        return str.split(/\(/)[0];
      });
      commandParams = [];
      $.each(commands, function(i, str) {
        var ps, pstr;
        pstr = str.split(/\(/)[1].split(/[, ]/);
        ps = [];
        $.each(pstr, function(i, p) {
          if (p.length > 0) {
            return ps.push(Number($.trim(p).match(/-?\d*\.?\d*/)));
          }
        });
        if (commandNames[i] === "translate" && ps.length === 1) {
          ps.push(0);
        }
        if (commandNames[i] === "scale" && ps.length === 1) {
          ps.push(ps[0]);
        }
        return commandParams.push(ps);
      });
      commandList = [];
      $.each(commandNames, function(i, cmd) {
        var el;
        el = {
          name: cmd,
          params: commandParams[i]
        };
        return commandList.push(el);
      });
      return commandList;
    };
    compileTransform = function(commands) {
      var commandStrs;
      commandStrs = [];
      $.each(commands, function(i, cmd) {
        var params, strVal;
        strVal = cmd.name + "(";
        params = $.map(cmd.params, function(el) {
          return el.toString();
        });
        strVal += params.join(',');
        strVal += ')';
        return commandStrs.push(strVal);
      });
      return commandStrs.join(' ');
    };
    swapCommand = function(commands, command) {
      var extantIndex;
      extantIndex = null;
      $.each(commands, function(i, cmd) {
        if (cmd.name === command.name) {
          return extantIndex = i;
        }
      });
      if (extantIndex != null) {
        commands[extantIndex] = command;
      } else {
        commands.push(command);
      }
      return commands;
    };
    $.fn.transform = function(value) {
      if (value == null) {
        value = null;
      }
      if (value === null) {
        return extractTransform(this.attr('transform'));
      } else if (typeof value === 'string') {
        return this.attr('transform', value);
      } else if (typeof value === 'object') {
        return this.attr('transform', compileTransform(value));
      }
    };
    $.fn.rotate = function(deg) {
      var rot, transf;
      if (deg == null) {
        deg = null;
      }
      transf = this.transform();
      if (deg == null) {
        rot = 0;
        $.each(transf, function(i, cmd) {
          if (cmd.name === "rotate") {
            return rot = cmd.params[0];
          }
        });
        return rot;
      } else {
        this.data('rot', Number(deg));
        rot = {
          name: 'rotate',
          params: [Number(deg)]
        };
        return this.transform(swapCommand(transf, rot));
      }
    };
    $.fn.scale = function(x, y) {
      var transf, transl;
      if (x == null) {
        x = null;
      }
      if (y == null) {
        y = null;
      }
      transf = this.transform();
      if ((x == null) && (y == null)) {
        transl = [1, 1];
        $.each(transf, function(i, cmd) {
          if (cmd.name === "scale") {
            return transl = cmd.params;
          }
        });
        return transl;
      } else {
        if (y == null) {
          y = x;
        }
        this.data('scale-x', Number(x));
        this.data('scale-y', Number(y));
        transl = {
          name: 'scale',
          params: [Number(x), Number(y)]
        };
        return this.transform(swapCommand(transf, transl));
      }
    };
    $.fn.scaleX = function(x) {
      var transf, transl;
      if (x == null) {
        x = null;
      }
      transf = this.transform();
      if (x == null) {
        return this.scale()[0];
      } else {
        transl = {
          name: 'scale',
          params: [Number(x), this.scaleY()]
        };
        return this.transform(swapCommand(this.transform(), transl));
      }
    };
    $.fn.scaleY = function(y) {
      var transl;
      if (y == null) {
        y = null;
      }
      if (y == null) {
        return this.scale()[1];
      } else {
        transl = {
          name: 'scale',
          params: [this.scaleX(), Number(y)]
        };
        return this.transform(swapCommand(this.transform(), transl));
      }
    };
    $.fn.translate = function(x, y) {
      var transf, transl;
      if (x == null) {
        x = null;
      }
      if (y == null) {
        y = null;
      }
      transf = this.transform();
      if ((x == null) && (y == null)) {
        transl = [0, 0];
        $.each(transf, function(i, cmd) {
          if (cmd.name === "translate") {
            return transl = cmd.params;
          }
        });
        return transl;
      } else {
        if (y == null) {
          y = 0;
        }
        this.data('translate-x', Number(x));
        this.data('translate-y', Number(y));
        transl = {
          name: 'translate',
          params: [Number(x), Number(y)]
        };
        return this.transform(swapCommand(transf, transl));
      }
    };
    $.fn.translateX = function(x) {
      var transl;
      if (x == null) {
        x = null;
      }
      if (x == null) {
        return this.translate()[0];
      } else {
        transl = {
          name: 'translate',
          params: [Number(x), this.translateY()]
        };
        return this.transform(swapCommand(this.transform(), transl));
      }
    };
    $.fn.translateY = function(y) {
      var transl;
      if (y == null) {
        y = null;
      }
      if (y == null) {
        return this.translate()[1];
      } else {
        transl = {
          name: 'translate',
          params: [this.translateX(), Number(y)]
        };
        return this.transform(swapCommand(this.transform(), transl));
      }
    };
    $.fn.translateXRel = function(x) {
      var transl;
      if (x == null) {
        x = 0;
      }
      transl = {
        name: 'translate',
        params: [this.translateX() + Number(x), this.translateY()]
      };
      return this.transform(swapCommand(this.transform(), transl));
    };
    $.fn.translateYRel = function(y) {
      var transl;
      if (y == null) {
        y = 0;
      }
      transl = {
        name: 'translate',
        params: [this.translateX(), this.translateY() + Number(y)]
      };
      return this.transform(swapCommand(this.transform(), transl));
    };
    $.fn.size = function(x, y) {
      if (x == null) {
        x = null;
      }
      if (y == null) {
        y = null;
      }
      if ((x == null) && (y == null)) {
        if (this[0].tagName === "rect") {
          return [Number(this.attr('width') / 2), Number(this.attr('height') / 2)];
        } else if (this[0].tagName === "ellipse") {
          return [Number(this.attr('rx')), Number(this.attr('ry'))];
        } else if (this[0].tagName === "circle") {
          return [Number(this.attr('r')), Number(this.attr('r'))];
        } else {
          return [Number(this.data('rx')), Number(this.data('ry'))];
        }
      } else {
        if (y == null) {
          y = x;
        }
        this.data('rx', x);
        this.data('ry', y);
        if (this[0].tagName === "rect") {
          this.attr('x', -x);
          this.attr('width', x * 2);
          this.attr('y', -y);
          return this.attr('height', y * 2);
        } else if (this[0].tagName === "ellipse") {
          this.attr('rx', x);
          return this.attr('ry', y);
        } else if (this[0].tagName === "circle") {
          return this.attr('r', x);
        } else {
          this.data('rx', x);
          return this.data('ry', y);
        }
      }
    };
    $.fn.sizeX = function(x) {
      if (x == null) {
        x = null;
      }
      if (x == null) {
        return this.size()[0];
      } else {
        return this.size(x, this.sizeY());
      }
    };
    return $.fn.sizeY = function(y) {
      if (y == null) {
        y = null;
      }
      if (y == null) {
        return this.size()[1];
      } else {
        return this.size(this.sizeX(), y);
      }
    };
  })(jQuery);

}).call(this);
