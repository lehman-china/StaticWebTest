__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
};

var bootPATH = __CreateJSPath("boot.js");

var projectPATH = bootPATH+"../../../../../";
//debugger
mini_debugger = true;   

//miniui
document.write('<script src="' + bootPATH + '../../inc/jquery-1.8.3.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/miniui.js" type="text/javascript" ></sc' + 'ript>');
document.write('<link href="' + bootPATH + '/themes/default/miniui.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + '/themes/icons.css" rel="stylesheet" type="text/css" />');

//skin
document.write('<link href="' + bootPATH + '/themes/blue/skin.css" rel="stylesheet" type="text/css" />');
