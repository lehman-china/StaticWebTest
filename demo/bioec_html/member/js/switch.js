/*  function $(sId)
{
	 return document.getElementById(sId);
}*/
	
function comtext(){
	document.getElementById("commain").style.display = "block"
}
function btn1(obj)
{
  document.getElementById("switch_tit").innerHTML= document.getElementById("coma").innerHTML;
	}
	
function btn2(obj)
{
   document.getElementById("switch_tit").innerHTML= document.getElementById("comb").innerHTML;
	}
	
function btn3(obj)
{
   document.getElementById("switch_tit").innerHTML= document.getElementById("comc").innerHTML;
	}
function btn4(obj)
{
   document.getElementById("switch_tit").innerHTML= document.getElementById("comd").innerHTML;
	}
function company_btn(){
	document.getElementById("company_news").style.display = "block";
	document.getElementById("company_infobox").style.display = "none";
	}
function company_btn1(){
	document.getElementById("company_news").style.display = "none";
	document.getElementById("company_infobox").style.display = "block";
	}
function news_add(){
	document.getElementById("news_add").style.display = "block";
	}
function news_add1(){
	document.getElementById("news_add").style.display = "none";
	}
function modify(){
	document.getElementById("modify_add").style.display = "block";
	document.getElementById("address").style.display = "none";
	}
function modify_add1(){
	document.getElementById("modify_add").style.display = "none";
	document.getElementById("address").style.display = "block";
	}
function news_bill(){
	document.getElementById("news_bill").style.display = "block";
	}
function news_bill1(){
	document.getElementById("news_bill").style.display = "none";
	}
function modify_bill(){
	document.getElementById("modify_bill").style.display = "block";
	document.getElementById("bill_main").style.display = "none";
	}
function modify_bill1(){
	document.getElementById("modify_bill").style.display = "none";
	document.getElementById("bill_main").style.display = "block";
	}
function vat_main_yes(){
	document.getElementById("vat_main").style.display = "block";
	}
function vat_main_no(){
	document.getElementById("vat_main").style.display = "none";
	}
function vat_main_no1(){
	document.getElementById("vat_main1").style.display = "none";
	}
function vat_main_yes1(){
	document.getElementById("vat_main1").style.display = "block";
	}
function save_bill(){
	document.getElementById("modify_bill").style.display = "none";
	document.getElementById("bill_main").style.display = "block";
	}
	
	
/*基本信息*/
function change_data(){
	document.getElementById("data_main").style.display = "none";
	document.getElementById("head_pic").style.display = "none";
	document.getElementById("xgdata").style.display = "block"
	}
function xgdata_btn(){
	document.getElementById("data_main").style.display = "block";
	document.getElementById("head_pic").style.display = "block";
	document.getElementById("xgdata").style.display = "none"
	}
function psw_succ(){
	
	document.getElementById("change_psw_main").style.display = "none";
	document.getElementById("psw_succ").style.display = "block";
	}
function bendi(){
	$("#temp1").addClass("head_qh");
	$("#temp2").removeClass("head_qh");
	document.getElementById("bendi").style.display = "block";
	document.getElementById("xitong").style.display = "none";
	}
function xitong(){
	$("#temp1").removeClass("head_qh");
	$("#temp2").addClass("head_qh");
	document.getElementById("bendi").style.display = "none";
	document.getElementById("xitong").style.display = "block";
	}
	
function binding_phone(){
	document.getElementById("binding_phone").style.display = "block";
	document.getElementById("data_main").style.display = "none";
	document.getElementById("xgdata").style.display = "none";
	}
	
function binding_result(){
	document.getElementById("binding_result").style.display = "block";
	document.getElementById("binding_phone").style.display = "none";
	}
	
function binding_result1(){
	document.getElementById("binding_result1").style.display = "block";
	document.getElementById("binding_email").style.display = "none";
	}
	
function binding_result2(){
	document.getElementById("binding_result1").style.display = "none";
	document.getElementById("binding_result2").style.display = "block";
	}
	
function binding_email(){
	document.getElementById("binding_email").style.display = "block";
	document.getElementById("data_main").style.display = "none";
	document.getElementById("xgdata").style.display = "none";
	}
	

	





























