define(["avalon"], function(avalon) {
  

    var draggable = avalon.bindingHandlers.draggable = function(data, vmodels) {

		var element = data.element
        var $element = avalon(element)
		
        $element.bind("mousedown", function(e) {
			console.log(element)
			console.log($element.attr("data-dragData"))
        });
    }
    return avalon
})
  