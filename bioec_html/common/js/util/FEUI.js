var FEUI = function () {
};
// *
// * 作者:雷建军
// *
// * @description jquery 气泡提示 (例:创建一个气泡:
// * var tips = FEUI.tips({html:'测试气泡',follow:'#my_div'}); 关闭气泡: tips.close();)
// * @param defineParam{}
// *
// follow : null,// 吸附的对象(用jquery选择器格式,#id,.class等)
// html : "",// 气泡显示的内容(字符串 或 html代码,或,jquery选择器格式,#id,.class等)
// position : "top", // top,bottom,left,right 4个位置
// time : 0,// 气泡持续时间,0为永久
// width : "auto",// 宽(整形或'auto')
// height : "auto",// 高(整形或'auto')
// offsetX : 0,// 气泡X偏移(整形)
// offsetY : 0,// 气泡Y偏移(整形)
// radius : 3,// 气泡圆角弧度(整形)
// opacity : 1,// 透明度
// padding : 5,// 内间距大小(整形)
// backgroundColor : "#FF9900",// 背景颜色
// color : "#FFF",// 字体颜色
// fontSize : "12",// 字体大小
// zIndex : 9999,
// // *
// // *********************************边框属性*************************************
// borderColor : "#FF9900",// 边框颜色
// borderSize : 1,// 边框大小(整形)
// arrowsSize : 5,// 箭头大小(整形,值很大的时候,可以做箭头符号使用哦)
// // *
// // ***********************箭头属性*************************************
// arrowsLength : 1.2,// 箭头的长度 (大小的倍数.默认1.2)
// arrowsX : 0,// 箭头X偏移
// arrowsY : 0 //箭头Y偏移
// @return {close:function(){}} 用来关闭气泡
/**
 * @memberOf FEUI
 * @param defineParam
 * @returns {{close: {function()}}}
 */
FEUI.tips = function ( defineParam ) {
	function open() {
		var define = {
			follow : null,// 吸附的对象(用jquery选择器格式,#id,.class等)
			html : "",// 气泡显示的内容(字符串 或 html代码,或,jquery选择器格式,#id,.class等)
			position : "top", // top,bottom,left,right 4个位置
			time : 0,// 气泡持续时间,0为永久
			width : "auto",// 宽(整形或'auto')
			height : "auto",// 高(整形或'auto')
			offsetX : 0,// 气泡X偏移(整形)
			offsetY : 0,// 气泡Y偏移(整形)
			radius : 3,// 气泡圆角弧度(整形)
			opacity : 1,// 透明度
			padding : 5,// 内间距大小(整形)
			backgroundColor : "#FF9900",// 背景颜色
			color : "#FFF",// 字体颜色
			fontSize : "12",// 字体大小
			zIndex : 9999,
			// *********************************边框属性*************************************
			borderColor : "#FF9900",// 边框颜色
			borderSize : 1,// 边框大小(整形)
			arrowsSize : 5,// 箭头大小(整形,值很大的时候,可以做箭头符号使用哦)
			// ***********************箭头属性*************************************
			arrowsLength : 1.2,// 箭头的长度 (大小的倍数.默认1.2)
			arrowsX : 0,// 箭头X偏移
			arrowsY : 0// 箭头Y偏移
		};

		/**
		 * ************************一.处理参数
		 */
		$.extend( define, defineParam );

		// 很简单的三目
		function toPx( auto ) {
			return typeof auto == "string" ? auto : auto + "px";
		}

		define.width = toPx( define.width );
		define.height = toPx( define.height );

		/**
		 * ************************二.创建气泡
		 */
		function createTips( $follow ) {
			// 先建立内容div
			var $content = $( "<div>" + define.html + "</div>" );

			// 气泡div
			var $tips = $( "<div style='height:" + define.heigth + ";width:" + define.width + ";opacity:" + define.opacity + ";padding:" + define.padding + "px;position:absolute;z-index:" + define.zIndex + ";max-overflow:visible;background:" + define.backgroundColor + ";border:" + define.borderSize + "px solid " + define.borderColor + ";color:" + define.color + ";font-size:" + define.fontSize + "px;border-radius:" + define.radius + "px;box-shadow: 1px 1px 3px rgba(0,0,0,.3);'></div>" );
			$tips.append( $content );

			$( "body" ).append( $tips ); // 气泡添加到dom里
			/**
			 * ************************三.气泡位置调整,创建箭头
			 */
			// 气泡的大小位置
			var x, y, w = $tips.outerWidth( true ), h = $tips.outerHeight( true );
			// 箭头的相对于气泡的坐标,大小
			var arrowsX = 0, arrowsY, arrowsBorderX, arrowsBorderY, arrowsLength = define.arrowsSize * define.arrowsLength;

			// 配置气泡的位置
			var configPosition = {
				/** ******* 上 */
				top : function () {
					// 气泡的位置
					x = $follow.offset().left + ($follow.outerWidth( true ) / 2 - w / 2) + define.offsetX;
					y = $follow.offset().top - h - arrowsLength + define.offsetY;
					// 箭头的位置
					arrowsX = w / 2 - define.arrowsSize + define.arrowsX, arrowsY = h - define.borderSize * 2 + define.arrowsY;
					arrowsBorderX = w / 2 - define.arrowsSize + define.arrowsX, arrowsBorderY = h - define.borderSize + define.arrowsY;
				},
				/** ******* 下 */
				bottom : function () {
					// 气泡的位置
					x = $follow.offset().left + ($follow.outerWidth( true ) / 2 - w / 2) + define.offsetX;
					y = $follow.offset().top + $follow.outerHeight( true ) + arrowsLength + define.offsetY;

					// 箭头的位置
					arrowsX = w / 2 - define.arrowsSize + define.arrowsX, arrowsY = 0 - arrowsLength * 2 + define.arrowsY;
					arrowsBorderX = w / 2 - define.arrowsSize + define.arrowsX, arrowsBorderY = 0 - define.borderSize - arrowsLength * 2 + define.arrowsY;
				},
				/** ******* *******左 */
				left : function () {
					// 气泡的位置
					x = $follow.offset().left - w - arrowsLength + define.offsetX;
					y = $follow.offset().top - h / 2 + $follow.outerHeight() / 2 + define.offsetY;
					// 箭头的位置
					arrowsX = w - define.borderSize * 2 + define.arrowsX, arrowsY = (h - define.borderSize * 2) / 2 - define.arrowsSize + define.arrowsY;
					arrowsBorderX = w - define.borderSize + define.arrowsX, arrowsBorderY = (h - define.borderSize * 2) / 2 - define.arrowsSize + define.arrowsY;
				},
				/** ******* ****** 右 */
				right : function () {
					// 气泡的位置
					x = $follow.offset().left + $follow.outerWidth() + arrowsLength + define.offsetX;
					y = $follow.offset().top - h / 2 + $follow.outerHeight() / 2 + define.offsetY;
					// 箭头的位置
					arrowsX = 0 - arrowsLength * 2 + define.arrowsX, arrowsY = (h - define.borderSize * 2) / 2 - define.arrowsSize + define.arrowsY;
					arrowsBorderX = 0 - define.borderSize - arrowsLength * 2 + define.arrowsX, arrowsBorderY = (h - define.borderSize * 2) / 2 - define.arrowsSize + define.arrowsY;
				},
				config : function () {
					configPosition[ define.position ]();

					// 选择指向不同方位的三角形样式
					function arrowsStyle( position, color ) {
						var swi = {
							top : 0,
							bottom : 2,
							left : 3,
							right : 1
						};
						var colors = [ "transparent", "transparent", "transparent" ];
						var styles = [ "dashed", "dashed", "dashed" ];
						colors.splice( swi[ position ], 0, color );
						styles.splice( swi[ position ], 0, "solid" );

						var width1, width2;
						if ( position == "top" || position == "bottom" )
							width1 = arrowsLength, width2 = define.arrowsSize;
						else
							width1 = define.arrowsSize, width2 = arrowsLength;

						return "border-color:" + colors.join( " " ) + ";border-style:" + styles.join( " " ) + ";border-width:" + width1 + "px " + width2 + "px;height:0;width:0;overflow:hidden;font-size:0;line-height:0;";

					}

					// 箭头
					var $arrows = $( "<div style='left:" + arrowsX + "px;top:" + arrowsY + "px;position:absolute;" + arrowsStyle( define.position, define.backgroundColor ) + "'></div>" );
					// 箭头边框
					var $arrowsBorder = $( "<div style='left:" + arrowsBorderX + "px;top:" + arrowsBorderY + "px;position:absolute;" + arrowsStyle( define.position, define.borderColor ) + "'></div>" );
					// 设置箭头边框颜色
					$arrowsBorder.css( "border-color", (define.arrowsSize * 1.2) + "px solid " + define.borderColor );

					// 添加箭头进到气泡中
					$tips.append( $arrowsBorder ).append( $arrows );
					// 气泡的坐标
					$tips.css( {
						left : x + "px",
						top : y + "px"
					} );
				}

			};
			configPosition.config();
			return $tips;
		}

		var $tips = [];
		// 创建气泡
		$( define.follow ).each( function () {
			$tips.push( createTips( $( this ) ) );
		} );
		// 删除气泡的方法
		function close() {
			for ( var i = 0, len = $tips.length; i < len; i++ ) {
				$tips[ i ].remove();
			}
			$tips = null; // 释放,回收
		}

		define.time && setTimeout( function () {
			close();
		}, define.time );
		// 返回删除气泡的方法
		return close;
	}

	var close = open();
	return {
		close : close
	};
};


FEUI.load = function ( params ) {
	var define = {
		parentTag : "<div></div>",//父元素 写在dom 里avalon 可控制,是否显示
		text : "加载中..",
		follow : "window", // 吸附的对象jq选择器
		opacity : 0.2,  //透明度
		color : "#000",
		position : "absolute"
	};

	$.extend( define, params );
	var $loads = [];

	function createLoad( x, y, w, h ) {
		var $zhezhao = $( "<div style='z-index:1000000;background-color:" + define.color + ";opacity:" + define.opacity + ";filter:alpha(opacity=" + (define.opacity * 100) + ");position:" + define.position + ";top:" + y + "px;left:" + x + "px;width:" + w + "px;height:" + h + "px;'></div>" +
		"<div style='width : 82px; height : 52px;border-radius:5px;opacity:0.3;filter:alpha(opacity=30);background-color:#000;position:" + define.position + ";z-index:1000001;'></div>" +//中央的黑色边框
		"<div style='width : 70px; height : 40px;background-color:#FFF;position:" + define.position + ";z-index:1000001;'></div>" +//白色底盘
		"<div style='position:" + define.position + ";z-index:1000002;'></div>" +
		"" );

		var $dipan1 = $zhezhao.eq( 1 ), $dipan = $zhezhao.eq( 2 ), $load = $zhezhao.eq( 3 );
		var loadW = $load.outerWidth( true ), loadH = $load.outerHeight( true );
		var di1W = $dipan1.outerWidth( true ), di1H = $dipan1.outerHeight( true );
		var diW = $dipan.outerWidth( true ), diH = $dipan.outerHeight( true );
		$zhezhao = $( define.parentTag ).append( $zhezhao );
		$( "body" ).append( $zhezhao );
		$load.css( { top : y + (h / 2 - loadH / 2), left : x + (w / 2 - loadW / 2) } );
		$dipan.css( { top : y + (h / 2 - diH / 2), left : x + (w / 2 - diW / 2) } );
		$dipan1.css( { top : y + (h / 2 - di1H / 2), left : x + (w / 2 - di1W / 2) } );


		// loading 样式
		var spinnerOpts = {
			lines: 8, // 共有几条线组成
			length: 0, // 每条线的长度
			width: 5, // 每条线的粗细
			radius: 8, // 内圈的大小
			corners: 1, // 圆角的程度
			rotate: 0, // 整体的角度（因为是个环形的，所以角度变不变其实都差不多）
			color: '#000', // 颜色
			speed: 1, // 速度：每秒的圈数
			trail: 60, // 高亮尾巴的长度
			shadow: false, // 是否要阴影
			hwaccel: false, // 是否用硬件加速
			className: 'spinner', // class的名字
			zIndex: 7 // z-index的值 2e9（默认为2000000000）
		};
		var spinner = new Spinner(spinnerOpts).spin();
		$load.append( spinner.el );
		$load.toFixed();
		return $zhezhao;
	}

	// 如果未设置follow是遮住整个页面的话,
	if ( define.follow == "window" ) {
		define.position = "fixed";
		$loads = createLoad( 0, 0, $( window ).width(), $( window ).height() );

	} else {
		// 所有元素加上load效果
		$( define.follow ).each( function () {
			var x = $( this ).offset().left, y = $( this ).offset().top, w = $( this ).outerWidth( true ), h = $( this ).outerHeight( true );
			$loads.push( createLoad( x, y, w, h ) );
		} );
	}
	// 关闭load
	function close() {
		for ( var i = 0, len = $loads.length; i < len; i++ ) {
			$loads[ i ].remove();
		}

		$loads = null; // 释放,回收
	}

	return { close : close };
};


FEUI.disable = function ( params ) {
	var define = {
		parentTag : "<div></div>",//父元素 写在dom 里avalon 可控制,是否显示
		follow : "body", // 吸附的对象jq选择器
		opacity : 0.6,  //透明度
		color : "#FFF"
	};
	$.extend( define, params );
	var $disables = [];
	function createDisable( x, y, w, h ) {
		var $zhezhao = $( "<div style='z-index:1000000;background-color:" + define.color + ";opacity:" + define.opacity + ";filter:alpha(opacity=" + (define.opacity * 100) + ");position:absolute;top:" + y + "px;left:" + x + "px;width:" + w + "px;height:" + h + "px;'></div>" );
		$zhezhao = $( define.parentTag ).append( $zhezhao );
		$( "body" ).append( $zhezhao );
	}
	// 所有元素加上 disable 效果
	$( define.follow ).each( function () {
		var x = $( this ).offset().left, y = $( this ).offset().top, w = $( this ).outerWidth( true ), h = $( this ).outerHeight( true );
		$disables.push( createDisable( x, y, w, h ) );
	} );
	// 关闭load
	function close() {
		for ( var i = 0, len = $loads.length; i < len; i++ ) {
			$disables[ i ].remove();
		}
		$disables = null; // 释放,回收
	}
	return { close : close };
};

/**
 * 弹出层
 * @memberOf FEUI
 * @param params {}
 *
 */
FEUI.layer = function ( params ) {
	var define = {
		html : "您确定吗?",//要显示的文字
		yes : function () {// 点击确定回调
		},
		no : function () {// 点击取消回调
		}
	};

	/**
	 * ************************一.处理参数
	 */
	$.extend( define, params );

	var html = '<div></div><div class="elastic_layer"></div><div class="layer"><div class="layer_content">    <p>' + define.html + '</p>    <p><a href="#" class="btn_qd">确定</a><a class="btn_qx" href="#" ms-click="qxtc()">取消</a></p>    </div> </div> </div>';
	var $layer = $( html );
	$layer.find( ".btn_qd" ).click( function () {
		$layer.remove();
		define.yes();
	} );
	$layer.find( ".btn_qx" ).click( function () {
		$layer.remove();
		define.no();
	} );
	$( "body" ).append( $layer )

};

/**
 * 关闭
 */
FEUI.close = function ( target ) {
	$( target ).remove();
};



// javascript 做的 load 效果
//fgnass.github.com/spin.js#v2.0.1
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return l[e]||(m.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",m.cssRules.length),l[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<k.length;d++)if(c=k[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}m.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k=["webkit","Moz","ms","O"],l={},m=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),n={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",position:"absolute"};h.defaults={},f(h.prototype,{spin:function(b){this.stop();{var c=this,d=c.opts,f=c.el=e(a(0,{className:d.className}),{position:d.position,width:0,zIndex:d.zIndex});d.radius+d.length+d.width}if(e(f,{left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var o=e(a("group"),{behavior:"url(#default#VML)"});return!d(o,"transform")&&o.adj?i():j=d(o,"animation"),h});
