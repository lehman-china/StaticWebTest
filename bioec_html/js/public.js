
/*头部搜索*/
function swh1(){
	$("#search_swlist").show();
	$("#search_swcont").hide();
	$("#search_swmain").hide();
	$("#pinming").hide();
	$("#huohao").show();
	$("#search_text").focus();
	
};
function swh2(){
	$("#search_swlist").hide();
	$("#search_swcont").show();
	$("#search_swmain").hide();
	$("#pinming").show();
	$("#huohao").hide();
	$("#search_text").focus();
};

$(function(){
	
$(".search_switch,.search_swimg").mouseover(function(){
	$(".search_swmain").show();
	
});
	
$(".search_switch").mouseout(function(){
		$(".search_swmain").hide();
	
});



})