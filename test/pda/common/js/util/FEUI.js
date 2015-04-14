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

// 如果 ie6等低版本没有控制台.则模拟控制台
window.console = typeof(console)!="undefined" ? console : {log:function(val){ }};
