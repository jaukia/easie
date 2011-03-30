// example of use $(elem).animate( {top: 100}, $.cubicBezierEasing(.25,.1,.25,1) );

(function($) {

$.cubicBezierEasing = function(p0,p1,p2,p3,duration) {
  var easingName = Array.prototype.join.call(arguments);
  duration = duration || 1;
  if ( !$.easing[easingName] ) {
    $.easing[easingName] = function(pos) {
      return cubicBezierAtTime.apply(null, Array.prototype.unshift.call(arguments, pos));
    } 
  }
  return easingName;
}

function cubicBezierAtTime() {
...
}

})(jQuery);

