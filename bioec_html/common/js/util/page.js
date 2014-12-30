
/**
 * 功能：拼合分页 HTML语句 
 * 参数：pager 分页对象 functionName 分页要调用的方法名 I_PAGE_MAX 分页的大小 
 * return:合成的分页字符串
 * 
 */
function pageControlHtml(page, functionName) {
	var StrPageControl = "";
	var totalCount = page.totalCount;// 总记录数
	var iTotalPage = page.totalPage;// 总页数
	var iCurrentPage = page.currentPage;// 当前页码

	StrPageControl = "<tr><td colspan=7>总页数：" + iTotalPage + "页    共" + totalCount
			+ "条记录   ";

	if (iCurrentPage != 1) {// 首页选项是否可点击
		StrPageControl += "<a href='javascript:" + functionName
				+ "(1);'>首页</a>";
	} else {
		StrPageControl += "首页";
	}

	for (var i = iCurrentPage - 5; i < (iCurrentPage + 6) && i <= iTotalPage; i++) {
		if (i == iCurrentPage) {// 当前页面加效果，不可点击
			StrPageControl += "&nbsp;[" + iCurrentPage + "]";
		} else if (i > 0) {// 不显示小于1的页面
			StrPageControl += "&nbsp;<a href='javascript:" + functionName
					+ "(" + i + ");'>" + i + "</a>";
		}
	}
	StrPageControl += "&nbsp;";
	if (iCurrentPage != iTotalPage) {// 是否显示尾页选项
		StrPageControl += "<a href='javascript:" + functionName + "("
				+ iTotalPage + ");'>尾页</a>";
	} else {
		StrPageControl += "尾页";
	}

	StrPageControl += "页次：" + iCurrentPage + "/" + iTotalPage + "</td></tr>";
	return StrPageControl;
}