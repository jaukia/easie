$(document).ready(function() {
    // animate main box when loading the page
    $(".main").css({"opacity":0.0}).animate({"opacity":1.0},600,"easieEaseIn");
    
    // setup interaction on the web page (and set the initial easing)
    setupInteraction("easieEaseInOut");
});

function setupInteraction(easingName) {
    var h = 200;
    var w = 200;
    var p = 10;
    
    $list = $("#easingSelector");
    $.each($.easing,function(key) {
        if(key.indexOf("easie")!=-1) {
            $('<option>'+key+'<'+'/option>').appendTo($list);
        }
    });
    $('<option value="custom" disabled="true">'+'(custom easing)'+'<'+'/option>').appendTo($list);
    
    $list.change(function(val) {
        var easingVal = $(this).val();
        func = $.easing[easingVal];
        if(!func) return;
        params = func.params.slice(0);
        pathelem.attr({path:makePath(func)});
        controls[0].update(p+fullw*params[0], h-p-fullh*params[1]);
        controls[1].update(p+fullw*params[2], h-p-fullh*params[3]);
    });
    
    var r = Raphael("graph", w, h);
    
    var name = easingName;
    var func = $.easing[name];
    var params = func.params.slice(0);
    
    var fullh = (h-2*p);
    var fullw = (w-2*p);
    
    function makePath(funcIn) {
        var count = 100;
        var lineDesc = "M"+p+" "+(h-p);
        for(var i=0;i<(count+1);i++) {
            var x = i/count;
            var y = funcIn(x,1,0,1);
            lineDesc += "L"+(p+fullw*x)+" "+(h-p-fullh*y);
        }
        return lineDesc;
    }
    
    var endattr = {fill: "#ffffff", stroke: "none"};
    
    var selectActiveColor = "#fb4b16";
    var selectColor = "#cb4b16";
    
    var lineColor = "#333";
    
    var selectattr = {fill: selectColor, stroke: "none"};
    var lineattr = {stroke: lineColor,"stroke-dasharray": ".","stroke-width":2,"stroke-linecap":"round"};
    
    var c1 = [p, h-p];
    var c2 = [w-p, p];
    
    r.circle(c1[0],c1[1], 5).attr(endattr),
    r.circle(c2[0],c2[1], 5).attr(endattr)
    
    var p1 = [p+fullw*params[0], h-p-fullh*params[1]];
    var p2 = [p+fullw*params[2], h-p-fullh*params[3]];
    
    var path1 = [["M",c1[0],c1[1]],["L",p1[0],p1[1]]];
    var path2 = [["M",c2[0],c2[1]],["L",p2[0],p2[1]]];
    
    var lines = r.set(
        r.path(path1).attr(lineattr),
        r.path(path2).attr(lineattr)
    );
    
    var pathelem = r.path(makePath(func)).attr({stroke:"white","stroke-width":5,"stroke-linecap":"round"});
    
    var controls = r.set(
        r.circle(p1[0], p1[1], 6).attr(selectattr),
        r.circle(p2[0], p2[1], 6).attr(selectattr)
    );
    
    var updateValues = function(pos,xval,yval) {
        // set precision
        xval = Math.round(xval*1000)/1000;
        yval = Math.round(yval*1000)/1000;
           
        if(pos===0) {
            params[0] = xval;
            params[1] = yval;
        } else if(pos===1) {
            params[2] = xval;
            params[3] = yval;
        }
        
        name = $.easie(params[0],params[1],params[2],params[3],"tmpDemoEasing",true);
        func = $.easing[name];
        pathelem.attr({path:makePath(func)});
        
        var match;
        $.each($.easing,function(key) {
           if(key.indexOf("easie")!=-1) {
               var ps = $.easing[key].params;
               if(ps[0]===params[0] && ps[1] === params[1] && ps[2] === params[2] && ps[3] === params[3]) {
                   match = key;
               }
           }
        });
        if(!match) match = "custom";
        $list.val(match);
        
        var cssContent = "";
        var cssPrefix1 = "-webkit-transition-timing-function: <br/>&nbsp;&nbsp;&nbsp;&nbsp;";
        var cssPrefix2 = "-moz-transition-timing-function: <br/>&nbsp;&nbsp;&nbsp;&nbsp;";
        
        var textContent = "$(\"#box\").animate({left:200}, ";
        
        var unCamelCase = function(text) {
            return text.replace("easie","").replace(/([A-Z])/g,"-$1").toLowerCase().substr(1);
        }
        
        if(match === "custom") {
            textContent += "$.easie("+params.join(",")+")";
            cssContent += "cubic-bezier("+params.join(",")+")";
        } else {
            textContent += "\""+match+"\"";
            if($.inArray(match,["easieEase","easieEaseIn","easieEaseOut","easieEaseInOut","easieLinear"]) != -1) {
                cssContent += unCamelCase(match);
            } else {
                cssContent += "cubic-bezier("+params.join(",")+")";
            }
        }
        textContent += ");";
        cssContent += ";";
        
        $("#easieCode").html(textContent);
        $("#cssCode").html(cssPrefix1+cssContent+"<br />"+cssPrefix2+cssContent);
    }
    
    function animateFunction() {
        $("#animator").css({"margin-left":0}).animate({"margin-left":200},1000,name,function() { setTimeout(animateFunction,1500) });
    }
    
    animateFunction();
    
    updateValues();
    
    controls[0].update = function(ncx,ncy) {
        this.attr({cx:ncx, cy:ncy});
        path1[1][1] = ncx;
        path1[1][2] = ncy;
        lines[0].attr({path: path1});
        updateValues(0,(ncx-p)/(w-2*p),1-(ncy-p)/(h-2*p));
    }
    
    controls[1].update = function(ncx,ncy) {
        this.attr({cx:ncx, cy:ncy});
        path2[1][1] = ncx;
        path2[1][2] = ncy;
        lines[1].attr({path: path2});
        updateValues(1,(ncx-p)/(w-2*p),1-(ncy-p)/(h-2*p));
    }
    
    var isDragging = false;
    
    controls.drag(
        function(dx, dy) {
            var ncx = (this.curx || this.attr("cx")) + dx - (this.dx || 0);
            var ncy = (this.cury || this.attr("cy")) + dy - (this.dy || 0);
            
            this.curx = ncx;
            this.cury = ncy;
            
            if(ncx>(w-p)) ncx = w-p;
            if(ncx<p) ncx = p;
            if(ncy>(h-p)) ncy = h-p;
            if(ncy<p) ncy = p;
            
            this.update(ncx,ncy);
            
            this.dx = dx;
            this.dy = dy;
            
            isDragging = true;
        },
        function() {
            this.curx = this.attr("cx");
            this.cury = this.attr("cy");
            
            this.dx = 0;
            this.dy = 0;
        },
        function() {
            isDragging = false;
            this.attr({fill: selectColor});
        }
    );
    
    controls.hover(
        function() {
            this.attr({fill: selectActiveColor});
        },
        function() {
            if(!isDragging) this.attr({fill: selectColor});
        }
    );
}