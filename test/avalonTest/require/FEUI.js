var FEUI = function() {
};
// *
// * 作者:雷建军
// *
// * @description jquery 气泡提示 (例:创建一个气泡: var tips =
// * FEUI.tips({html:'测试气泡',follow:'#my_div'}); 关闭气泡: tips.close();)
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

FEUI.tips = function( defineParam ) {
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
			// *
			// *********************************边框属性*************************************
			borderColor : "#FF9900",// 边框颜色
			borderSize : 1,// 边框大小(整形)
			arrowsSize : 5,// 箭头大小(整形,值很大的时候,可以做箭头符号使用哦)
			// *
			// ***********************箭头属性*************************************
			arrowsLength : 1.2,// 箭头的长度 (大小的倍数.默认1.2)
			arrowsX : 0,// 箭头X偏移
			arrowsY : 0
			// 箭头Y偏移
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
			var $content =  $( "<div>" + define.html + "</div>" );

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
				top : function() {
					// 气泡的位置
					x = $follow.offset().left + ($follow.outerWidth( true ) / 2 - w / 2) + define.offsetX;
					y = $follow.offset().top - h - arrowsLength + define.offsetY;
					// 箭头的位置
					arrowsX = w / 2 - define.arrowsSize + define.arrowsX, arrowsY = h - define.borderSize * 2 + define.arrowsY;
					arrowsBorderX = w / 2 - define.arrowsSize + define.arrowsX, arrowsBorderY = h - define.borderSize + define.arrowsY;
				},
				/** ******* 下 */
				bottom : function() {
					// 气泡的位置
					x = $follow.offset().left + ($follow.outerWidth( true ) / 2 - w / 2) + define.offsetX;
					y = $follow.offset().top + $follow.outerHeight( true ) + arrowsLength + define.offsetY;

					// 箭头的位置
					arrowsX = w / 2 - define.arrowsSize + define.arrowsX, arrowsY = 0 - arrowsLength * 2 + define.arrowsY;
					arrowsBorderX = w / 2 - define.arrowsSize + define.arrowsX, arrowsBorderY = 0 - define.borderSize - arrowsLength * 2 + define.arrowsY;
				},
				/** ******* *******左 */
				left : function() {
					// 气泡的位置
					x = $follow.offset().left - w - arrowsLength + define.offsetX;
					y = $follow.offset().top - h / 2 + $follow.outerHeight() / 2 + define.offsetY;
					// 箭头的位置
					arrowsX = w - define.borderSize * 2 + define.arrowsX, arrowsY = (h - define.borderSize * 2) / 2 - define.arrowsSize + define.arrowsY;
					arrowsBorderX = w - define.borderSize + define.arrowsX, arrowsBorderY = (h - define.borderSize * 2) / 2 - define.arrowsSize + define.arrowsY;
				},
				/** ******* ****** 右 */
				right : function() {
					// 气泡的位置
					x = $follow.offset().left + $follow.outerWidth() + arrowsLength + define.offsetX;
					y = $follow.offset().top - h / 2 + $follow.outerHeight() / 2 + define.offsetY;
					// 箭头的位置
					arrowsX = 0 - arrowsLength * 2 + define.arrowsX, arrowsY = (h - define.borderSize * 2) / 2 - define.arrowsSize + define.arrowsY;
					arrowsBorderX = 0 - define.borderSize - arrowsLength * 2 + define.arrowsX, arrowsBorderY = (h - define.borderSize * 2) / 2 - define.arrowsSize + define.arrowsY;
				},
				config : function() {
					configPosition[define.position]();

					// 选择指向不同方位的三角形样式
					function arrowsStyle( position, color ) {
						var swi = {
							top : 0,
							bottom : 2,
							left : 3,
							right : 1
						};
						var colors = ["transparent", "transparent", "transparent"];
						var styles = ["dashed", "dashed", "dashed"];
						colors.splice( swi[position], 0, color );
						styles.splice( swi[position], 0, "solid" );

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
		$( define.follow ).each( function() {
					$tips.push( createTips( $( this ) ) );
				} );
		// 删除气泡的方法
		function close() {
			for ( var i = 0, len = $tips.length; i < len; i++ ) {
				$tips[i].remove();
			}
		}
		define.time && setTimeout( function() {
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







// 加载器exports
define(function(){
	return FEUI;
});

