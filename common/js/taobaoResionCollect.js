var myConsole = null;
var values = "";
$( function() {
			myConsole = new MyConsole();
		} );

function startCollect() {
	forEach( tdist_all, backCall );

}

function backCall( name, obj ) {
	var id = name;
	if ( isLeaf( id ) ) {
		var l1 = id.substring( 0, 2 ) + "0000";
		var l2 = id.substring( 0, 4 ) + "00";
		var l3 = id;
		var url = "http://lsp.wuliu.taobao.com/locationservice/addr/output_address_town.do?l1=" + l1 + "&l2=" + l2 + "&l3=" + l3 + "&_ksTS=1406300740939_189&callback=?"; // 调用淘宝的地区jsonp操作
		$.getJSON( url, taoBaoJsonpCall );
	}
}

/**
 * {"success":true,"result":{"140823100":["桐城镇","140823","tong cheng zhen"]}}
 * 
 * @param {}
 *            data
 */
function taoBaoJsonpCall( data ) {
	// 如果是成功的
	if ( data.success ) {
		var result =  JSON.stringify(data.result);
		var url = "http://localhost/bioec/debug_executionDebugAjax.action?result="+result;
		$.post( url, null, null, "text" );
		/*
		 * var childs = data.result; var texts = ""; for ( id in childs ) { var
		 * child = childs[id]; texts += "INSERT INTO
		 * `bioec_region`(id,parent_id,title,py_title) VALUES ( '" + id + "', '" +
		 * child[1] + "', ' " + child[0] + "', '" + child[2] + "');"; }
		 * myConsole.printfln( texts );
		 */
	}
}

/**
 * 流畅的循环对象,使用延时方法,setTimeout.腾出资源.使之循环大数据量时不会卡死
 * 
 * @param {}
 *            obj 待循环的对象
 * @param {}
 *            backCall 执行的回调方法 例:backCall( name, obj )
 */
function forEach( obj, backCall ) {
	// 求对象中属性个数
	var objLength = 0;
	for ( id in obj ) {
		objLength++;
	}
	// objLength = 50;
	// 对象中所有属性名放入数组中
	var names = new Array( length ), index = 0;
	for ( name in tdist_all ) {
		names[index] = name;
		index++;
	}

	// 延时方法,循环代码
	var MyForTmp = function( i, names, obj, objLength, backCall ) {
		if ( i < objLength ) {
			setTimeout( function() {
						MyForTmp( i + 1, names, obj, objLength, backCall );
					}, 1 );
			backCall( names[i], obj );

			if ( i % 100 == 100 ) {
				myConsole.printfln( "/*" + i + "*/" );
			}
		}
	};
	MyForTmp( 0, names, obj, objLength, backCall );
}

/**
 * 载入子地区
 * 
 * @param {}
 *            id 地区ID
 * @return 子地区集合,例:{'4':['阿拉斯加','0','Alaska(U.S.A)'],'5':['阿尔巴尼亚','0','Albania'],'6':['阿尔及利亚','0','Algeria']}
 */
function loadChildRegion( id ) {
	var regions = tdist_all;
	var childRegions = {};
	for ( id in regions ) {
		var region = regions[id];
		// 如果等于父ID
		if ( region[1] == id ) {
			childRegions[id] = regions[id];
		}
	}
	return childRegions;
}

/**
 * 检查地区是否是叶节点
 * 
 * @param {}
 *            id 地区ID
 */
function isLeaf( id ) {
	var lastChar = id.substring( id.length - 2, id.length );
	return parseInt( lastChar ) > 0;
}
function test(){
	forEach( tdist_all, function( name, obj ){  
		var param = '"result":{"140823100":["桐城镇","140823","tong cheng zhen"]}';
		
		} );
}
