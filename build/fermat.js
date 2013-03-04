// Generated by CoffeeScript 1.6.0
(function() {

  $(function() {
    var drawAnswer, findFermatPoint;
    drawAnswer = function(p, ps, angle) {
      var op, svg, wrapper, _i, _len, _results;
      if (angle) {
        console.log("angle greater than 120 degrees detected:", angle);
      }
      console.log("fermat point:", p);
      wrapper = $('.svg-wrapper');
      svg = wrapper.find('svg').svg('get');
      svg.circle(p[0], p[1], 5, {
        fill: "red"
      });
      _results = [];
      for (_i = 0, _len = ps.length; _i < _len; _i++) {
        op = ps[_i];
        _results.push(svg.line(op[0], op[1], p[0], p[1], {
          "stroke-width": 1,
          "stroke-dasharray": "10",
          stroke: "red",
          fill: "none"
        }));
      }
      return _results;
    };
    findFermatPoint = function(ps) {
      var a, bc, bcs, i, l12, l23, l31, legs, p1, p2, point, s, sql, sql12, sql23, sql31, squaredLegs, theta, _i, _j, _k, _ref, _ref1;
      squaredLegs = [];
      legs = [];
      for (i = _i = 0, _ref = ps.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        p1 = ps[i];
        p2 = ps[(i + 1) % ps.length];
        sql = Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2);
        squaredLegs.push(sql);
        legs.push(Math.sqrt(sql));
      }
      s = (legs[0] + legs[1] + legs[2]) / 2;
      a = Math.sqrt(s * (s - legs[0]) * (s - legs[1]) * (s - legs[2]));
      for (i = _j = 0; _j < 3; i = ++_j) {
        sql12 = squaredLegs[i];
        sql23 = squaredLegs[(i + 1) % 3];
        sql31 = squaredLegs[(i + 2) % 3];
        l12 = legs[i];
        l23 = legs[(i + 1) % 3];
        l31 = legs[(i + 2) % 3];
        theta = Math.acos((sql12 + sql31 - sql23) / (2 * l12 * l31));
        if (theta > 2 * Math.PI / 3) {
          return [p1, ps, theta * 180 / Math.PI];
        }
      }
      bcs = [];
      for (i = _k = 0, _ref1 = ps.length; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
        sql12 = squaredLegs[i];
        sql23 = squaredLegs[(i + 1) % 3];
        sql31 = squaredLegs[(i + 2) % 3];
        l12 = legs[i];
        l23 = legs[(i + 1) % 3];
        l31 = legs[(i + 2) % 3];
        bc = Math.pow(sql12, 2) - 2 * Math.pow(sql23 - sql31, 2) + sql12 * (sql23 + sql31 + 4 * Math.sqrt(3) * a);
        bcs.push(bc);
      }
      point = [(bcs[0] * ps[0][0] + bcs[1] * ps[1][0] + bcs[2] * ps[2][0]) / (bcs[0] + bcs[1] + bcs[2]), (bcs[0] * ps[0][1] + bcs[1] * ps[1][1] + bcs[2] * ps[2][1]) / (bcs[0] + bcs[1] + bcs[2])];
      return [point, ps, null];
    };
    return $(".svg-wrapper svg").svg({
      onLoad: function() {
        var answer, i, p, ps, svg, wrapper, _i;
        wrapper = $('.svg-wrapper');
        svg = wrapper.find('svg').svg('get');
        ps = [];
        for (i = _i = 0; _i < 3; i = ++_i) {
          p = [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 800)];
          svg.circle(p[0], p[1], 3);
          ps.push(p);
        }
        answer = findFermatPoint(ps);
        return drawAnswer.apply(null, answer);
      }
    });
  });

}).call(this);