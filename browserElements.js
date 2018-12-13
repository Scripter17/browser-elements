(function(){
	window.browserElements={
		detectIE: function(){ // https://codepen.io/gapcode/pen/vEJNZN
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf('MSIE ');
			if (msie > 0) {
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			}
			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			}
			var edge = ua.indexOf('Edge/');
			if (edge > 0) {
				return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
			}
			return false;
		},
		getBrowser:function(){ // TODO: Make this much more rigorous.
			var browser;
			var IEdge=browserElements.detectIE();
			if (IEdge>=12 && typeof IEdge==="number"){
				browser="Edge";
			} else if (IEdge<=11 && typeof IEdge==="number"){
				browser="IE";
			} else if (/chrome/i.test(navigator.userAgent)){
				browser="Chrome";
			} else if (/firefox/i.test(navigator.userAgent)){
				browser="Firefox";
			}
			return browser;
		},
		main:function(){
			var browser=browserElements.getBrowser();
			var i, elems;
			elems=document.getElementsByTagName("if-"+browser.toLowerCase());
			if (elems!==undefined){
				for (i=0; i<elems.length; i++){
					elems[i].classList.add("bedisp");
				}
			}

		}
	}
})()