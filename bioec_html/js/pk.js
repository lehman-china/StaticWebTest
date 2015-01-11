$(document).ready(function(){
 $(".fw_box_tt").hover(function(){
   $(this).removeClass("box_tt_a").addClass("box_tt_b");
 },function(){
   $(this).removeClass("box_tt_b").addClass("box_tt_a");
 });

//对比特效 
 $(".mj_db").hover(function(){
   $(this).addClass("mj_db_hover");
 },function(){
   $(this).removeClass("mj_db_hover");
 });
 
  $(".mj_db").toggle(function(){
   var n = $(this).parents(".fw_box_tt").index();
   var jg = $(this).parent().siblings(".fw_tt_jg").find("span").html();
   var bt = $(this).parent().siblings(".fw_tt_bt").html();
   var tt = $(".db_right_zj").size();
   var cs = ".c_"+ n;  
   var ncs = $(cs).size();
   if(ncs<1){ 
  $(".db_left").show().addClass("db_left_hover");
  $(".db_right").show();
   if(tt<4){
   $(this).addClass("mj_db_click");
   $(".db_right").prepend('<div class="db_right_zj c_'+ n +'">'+ bt +'<span>'+ jg +'</span></div>');
   $(".db_right_tt").first().detach();
   }else{
   alert("您最多只能添加4个服务到对比栏");
   };
  }else{
   $(cs).detach();
   var tt = $(".db_right_zj").size();
   if(tt<4){
   $(".dd_bottom").before('<div class="db_right_tt">您还可以继续添加</div>');
   $(this).removeClass("mj_db_click");
   }else{
   alert("您最多只能添加4个服务到对比栏");
   };
  }; 
 },function(){
   var n = $(this).parents(".fw_box_tt").index();
   var cs = ".c_"+ n;  
   var ncs = $(cs).size();
   if(ncs<1){
   var jg = $(this).parent().siblings(".fw_tt_jg").find("span").html();
   var bt = $(this).parent().siblings(".fw_tt_bt").html();
   var tt = $(".db_right_zj").size();
   if(tt<4){
   $(this).addClass("mj_db_click");
   $(".db_right").prepend('<div class="db_right_zj c_'+ n +'">'+ bt +'<span>'+ jg +'</span></div>');
   $(".db_right_tt").first().detach();
   }else{
   alert("您最多只能添加4个服务到对比栏");
   };   
   }else{
   $(cs).detach();
   var tt = $(".db_right_zj").size();
   if(tt<4){
   $(".dd_bottom").before('<div class="db_right_tt">您还可以继续添加</div>');
   $(this).removeClass("mj_db_click");
   }else{
   alert("您最多只能添加4个服务到对比栏");
   };
  }; 
 })

 //对比展开&关闭特效 
/* $(".db_left").toggle(function(){
   $(this).removeClass("db_left_hover");
   $(".db_right").hide();
 },function(){
   $(this).addClass("db_left_hover");
   $(".db_right").show();
 });*/
 
 //对比清空特效
 $(".dd_bottom span").click(function(){
   $(".db_right_zj").detach();
   $(".mj_db").removeClass("mj_db_click");
   var zj = $(".db_right_tt").size(); 
   for(i=(zj+1);i<=4;i++)
   {
   $(".db_right").prepend('<div class="db_right_tt">您还可以继续添加</div>');
   }
 })
 
});