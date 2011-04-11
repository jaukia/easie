Installing jquery.easie.js
--------------------------

There is just one step:

Copy the file "js/jquery.easie.js" to your project (or the minified version in "build/jquery.easie-min.js"), and you are done!

Using jquery.easie.js
---------------------

The syntax is easy.

Either, use one of the predefined, named easings:

    $(elem).animate( {top: 100}, "easieEaseIn" );
    
Or, define your own easing with css3 compatible cubic-bezier parameters:

    $(elem).animate( {top: 100}, $.easie(0.25,0.1,0.25,1.0) );

See the web site for more info:

[http://janne.aukia.com/easie/](http://janne.aukia.com/easie/)