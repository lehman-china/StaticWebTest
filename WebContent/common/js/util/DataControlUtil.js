/**
 * @Description: 用户端，js模糊查询。
 * @datas:待查询的对象集合
 * @colName:模糊查询的字段名
 * @fazzy:模糊词
 * @return 结果集
 * @author:雷建军  
 * @Company:dakewe (www.dakewe.com)
 * @create:2014-6-12 17:18:35
 * @update:2014-6-12 17:18:39
 */
function fazzySearch( datas, colName, fazzy ) {
	var dataBuffer = new Array( datas.length );//数据缓存，  缓存模糊词匹配的 对象
	var iNum = 0;
	//循环缓存模糊词匹配的 对象
	for ( var i = 0; i < datas.length; i++ ) {
		var data = datas[i];
		var column = data[colName];
		if ( -1 != column.indexOf( fazzy ) ) {
			dataBuffer[iNum++] = data;
		}
	}
	//笨方法去掉缓存区，无数据的索引
	var dataList = new Array( iNum );
	for ( var j = 0; j < iNum; j++ ) {
		dataList[j] = dataBuffer[j];
	}
	return dataList;
}