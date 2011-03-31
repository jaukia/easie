// example of use $(elem).animate( {top: 100}, $.easie(.25,.1,.25,1) );

/*
 * jquery.easie.js:
 * http://www.github.com/jaukia/easie
 *
 * Version history:
 * 0.01 xxx
 *
 * LICENCE INFORMATION:
 *
 * Copyright (c) 2011 Janne Aukia (janne.aukia.com),
 * Louis-Rémi Babé (public@lrbabe.com).
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL Version 2 (GPL-LICENSE.txt) licenses.
 *
 * LICENCE INFORMATION FOR DERIVED FUNCTIONS:
 *
 * Function cubicBezierAtTime is written by Christian Effenberger, 
 * and corresponds 1:1 to the WebKit project function.
 * "WebCore and JavaScriptCore are available under the 
 * Lesser GNU Public License. WebKit is available under 
 * a BSD-style license."
 *
 */

/*jslint sub: true */

(function($) {
    "use strict";

    $.easie = function(p1x,p1y,p2x,p2y,name) {
        name = name || "cubic-"+Array.prototype.join.call(arguments,"-");
        if ( !$.easing[name] ) {
            var cubicBezierAtTimeLookup = makeLookup(function(p) {
                // the duration is set to 1.0. this defines the precision of the bezier calculation.
                // with the lookup table, the precision could probably be increased without any big penalty.
                cubicBezierAtTime(p,p1x,p1y,p2x,p2y,1.0);
            });
    
            $.easing[easingName] = function(p, n, firstNum, diff) {
                return cubicBezierAtTimeLookup.apply(null, p);
            } 
        }
        return easingName;
    }

    $.easie(0.0,0.0,1.0,1.0,  "cubic-linear");
    $.easie(0.25,0.1,0.25,1.0,"cubic-ease");
    $.easie(0.42,0.0,1.0,1.0, "cubic-ease-in");
    $.easie(0.0,0.0,0.58,1.0, "cubic-ease-out");
    $.easie(0.42,0.0,0.58,1.0,"cubic-ease-in-out");

    function makeLookup(func,steps) {
        var i;
        steps = steps || 101;
        var lookupTable = [];
        for(i=0;i<steps;i++) {
            lookupTable[i] = func.call(i/(steps-1));
        }
        return function(p) {
            if(p0===1.0) return y1;
            var p0 = Math.floor((steps-1)*p);
            var y1 = lookupTable[p0];
            var y2 = lookupTable[p0+1];
            return y1+(y2-y1)*((steps-1)*p-p0);
        }
    }

    // From: http://www.netzgesta.de/dev/cubic-bezier-timing-function.html
    // 1:1 conversion to js from webkit source files
    // UnitBezier.h, WebCore_animation_AnimationBase.cpp
    function cubicBezierAtTime(t,p1x,p1y,p2x,p2y,duration) {
        var ax=0,bx=0,cx=0,ay=0,by=0,cy=0;
        // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
        function sampleCurveX(t) {return ((ax*t+bx)*t+cx)*t;}
        function sampleCurveY(t) {return ((ay*t+by)*t+cy)*t;}
        function sampleCurveDerivativeX(t) {return (3.0*ax*t+2.0*bx)*t+cx;}
        // The epsilon value to pass given that the animation is going to run over |dur| seconds. The longer the
        // animation, the more precision is needed in the timing function result to avoid ugly discontinuities.
        function solveEpsilon(duration) {return 1.0/(200.0*duration);}
        function solve(x,epsilon) {return sampleCurveY(solveCurveX(x,epsilon));}
        // Given an x value, find a parametric value it came from.
        function solveCurveX(x,epsilon) {var t0,t1,t2,x2,d2,i;
            function fabs(n) {if(n>=0) {return n;}else {return 0-n;}}
            // First try a few iterations of Newton's method -- normally very fast.
            for(t2=x, i=0; i<8; i++) {x2=sampleCurveX(t2)-x; if(fabs(x2)<epsilon) {return t2;} d2=sampleCurveDerivativeX(t2); if(fabs(d2)<1e-6) {break;} t2=t2-x2/d2;}
            // Fall back to the bisection method for reliability.
            t0=0.0; t1=1.0; t2=x; if(t2<t0) {return t0;} if(t2>t1) {return t1;}
            while(t0<t1) {x2=sampleCurveX(t2); if(fabs(x2-x)<epsilon) {return t2;} if(x>x2) {t0=t2;}else {t1=t2;} t2=(t1-t0)*0.5+t0;}
            return t2; // Failure.
        }
        // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
        cx=3.0*p1x; bx=3.0*(p2x-p1x)-cx; ax=1.0-cx-bx; cy=3.0*p1y; by=3.0*(p2y-p1y)-cy; ay=1.0-cy-by;
        // Convert from input time to parametric value in curve, then from that to output time.
        return solve(t, solveEpsilon(duration));
    }

})(jQuery);