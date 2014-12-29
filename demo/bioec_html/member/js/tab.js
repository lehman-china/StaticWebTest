var tds = document.getElementById('order_term').getElementsByTagName('p');
	window.onload = function(){
	for( var i=0; i<tds.length; i++ ){
	 tds[i].onclick = function(){
	  tdonclick(this);
	 }
	}
	}
	function tdonclick(obj){
	for( var o=0; o<tds.length; o++ ){
	 if( tds[o] == obj ){
	  tds[o].className = 'this_term';
	 }
	 else{
	  tds[o].className = '';
	 }
	}
	};
