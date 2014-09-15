
/**
 * 
 * 雷建军 2014-7-25 16:38:43 模拟控制台,注意要等页面加载完后再实例化对象,并需要jquery的支持
 */
var MyConsole = function() {
	var _this = this;
	// 控制台标题+工具栏
	var title_console = "<div style='width : 100%;border:medium double rgb(0,0,63);background-color : #1CBEF2;'>"+
			"<span  >html控制台(Console):</span>"+
			"<a href='javascript:' onclick='$(\"#console_back\").hide(300)' style='float:right;border:1px solid rgb(0,0,63);background-color:#FF4949;height:18px;'>关闭控制台</a>"+
			"<a href='javascript:' onclick='$(\"#console_content\").html(\"\")' style='float:right;border:1px solid rgb(0,0,63);background-color:#FCA423;height:18px;'>清空控制台</a>"+
		"</div>";

	//控制台内容
	var content_console = "<textarea id='console_content' style='width : 100%; height : 200;border:medium double rgb(0,0,63);overflow-x:hidden;'></textarea>";

	// 添加控制台背景div
	var style = "left : 0px; top : 100%;margin-top:-230px;" + // 显示坐标
		"width : 100%; height : 230;" + // 宽和高
		"background-color : #FFFFFF;" + // 背景色
		"position : absolute;" + //
		"display : block";
	$( document.body ).append( "<div id='console_back' style='" + style + "'>" + title_console + content_console + "</div>" );
	
	var $console_content = $( "#console_content" );//控制台内容部分div
	var $console_back = $( "#console_back" );//控制台背景div

	/**
	 * 追加内容到模拟控制台
	 */
	this.printf = function( content ) {
		$console_content.append( content );
		$console_back.show();
		// 滚动条到末尾
		$console_content[0].scrollTop = $console_content[0].scrollHeight; 
	};

	/**
	 * 追加内容到模拟控制台
	 */
	this.printfln = function( content ) {
		_this.printf( content + "\n" );
	};
	// 显示控制台
	this.open = function(){
		$console_back.show(200);
	}
	// 关闭控制台
	this.close = function(){
		$console_back.hide(200);
	}
};
