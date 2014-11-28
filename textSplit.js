jsObject.extend({
	expand:function(el){
		var allchar = el.innerHTML.split(" ");		
		var startdiv = "<div style='position:relative;display:inline;'>";
		var enddiv = "</div>";
		var str = startdiv+""+allchar.join(enddiv+" "+startdiv)+""+enddiv;
		el.innerHTML = str;		
		var words = el.children;
		var all_char = [];
		for (var i = 0 ; i < el.children.length; i++) {
			var _char = el.children[i];			
			_char.innerHTML = startdiv+""+_char.innerHTML.split("").join(enddiv+""+startdiv)+""+enddiv;
			for (var j = 0; j < _char.children.length; j++) {
				all_char.push(_char.children[j]);
			};			
		};
		return{
			allchar:all_char,
			words:words
		}
	},
	revert:function(el){
		var start = /<(div+)[^>]*?(\/)?>/g;
		var end = /<\/div>/g;
		el.innerHTML = el.innerHTML.replace(start,"").replace(end,"");
	}
});
jsObject.prototype.expand = function(){
	return {
		rvalue:jsObject.expand(this.el),
		current:this
	};
}
jsObject.prototype.revert = function(){
	jsObject.revert(this.el);
	return this;
}