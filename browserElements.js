(function(){
	window.browserElements={
		getVersion:{
			ie:function(ua){ // https://codepen.io/gapcode/pen/vEJNZN
				if (typeof ua!=="string"){ua=navigator.userAgent;}
				var msie=ua.indexOf('MSIE ');
				if (msie>0){return parseInt(ua.substring(msie+5, ua.indexOf('.', msie)), 10);}
				var trident=ua.indexOf('Trident/');
				if (trident>0){var rv=ua.indexOf('rv:'); return parseInt(ua.substring(rv+3, ua.indexOf('.', rv)), 10);}
				var edge=ua.indexOf('Edge/');
				if (edge>0){return parseInt(ua.substring(edge+5, ua.indexOf('.', edge)), 10);}
				return false;
			},
			firefox:function(ua){ // Home-made function; Probably broken (User agent list: https://udger.com/resources/ua-list/browser-detail?browser=Firefox )
				// You know you need to re-evaluate your code when you label something as "home-made".
				if (typeof ua!=="string"){ua=navigator.userAgent;}
				var i=ua.indexOf("Firefox");
				var v=parseInt(ua.substr(i+8, ua.length-i-8));
				return v;
			},
			chrome:function(ua){ // https://stackoverflow.com/a/4900484
				if (typeof ua!=="string"){ua=navigator.userAgent;}
				var raw=ua.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
				return (raw?parseInt(raw[2], 10):false);
			},
			opera:function(ua){
				if (typeof ua!=="string"){ua=navigator.userAgent;}
				return parseInt(ua.match(/Opera[\/ ](\d+)/)[1])
			},
			undefined:function(){return undefined;}
		},
		types:["ie", "edge", "firefox", "chrome", "opera"],
		getBrowser:function(){ // TODO: Make this much more rigorous.
			var browser, i;
			var IEdge=browserElements.getVersion.ie();
			if (IEdge>=12 && typeof IEdge==="number"){
				browser="edge";
			} else if (IEdge<=11 && typeof IEdge==="number"){
				browser="ie";
			} else if (navigator.userAgent.indexOf("Firefox")!=-1){
				browser="firefox";
			} else if (navigator.userAgent.indexOf("Opera")!==-1){
				browser="opera";
			} else if (navigator.userAgent.indexOf("Chrome")!=-1 && window.navigator.vendor=="Google Inc"){
				browser="chrome";
			}
			return browser;
		},
		getBrowserVersion:function(){
			try{
				return window.browserElements.getVersion[window.browserElements.getBrowser()]()
			} catch (e) {
				return undefined;
			}
		},
		rangeConv:function(str){
			if (!/\d*-\d*/.test(str)){return false;}
			var range=str.split("-");
			if (range.length==1){return [0, Infinity];}
			if (range[0]===""){range[0]=0;}
			if (range[1]===""){range[1]=Infinity;}
			return [parseInt(range[0]), parseInt(range[1])]; // Array.map is not supported in IE6
		},
		validate:function(elem){
			var i, noCond=true;
			if (!elem.getAttribute){return true;}
			for (i=0; i<browserElements.types.length; i++){
				if (elem.getAttribute("if-"+browserElements.types[i])!==null){
					noCond=false;
				}
			}
			if (noCond){return true;} // <elem>
			var type=browserElements.getBrowser(),
				ver=browserElements.getVersion[type](),
				ev=elem.getAttribute("if-"+type);
			if (ev===""){return true;} // <elem if-browser>
			if (ev===null){return false;}
			ev=browserElements.rangeConv(ev);
			if (ev===false){return false;} // <elem if-browser="invalid string">
			// if (ev.length==1){ev=[0, Infinity];}
			if (elem.getAttribute("if-"+type)===null){return false;} // <elem if-other>
			if (ev[0]<=ver && ver<=ev[1]){return true;} // <elem if-browser="i-j"> i<=ver<=j
			return false;
		},
		main:function(elem, single, normalHandle, specialCopy){
			var i;
			if (elem===undefined || elem+""==="[object Event]"){elem=document.body;}
			if (typeof specialCopy!=Array){specialCopy=["innerHTML", "attributes"]}
			if (typeof normalHandle!=="function"){normalHandle=function(elem){elem.parentElement.removeChild(elem);}}
			// If elements
			// Stuff like <if-script if-chrome> will only run in Chrome
			if (elem.tagName!==undefined && elem.tagName.substr(0,3)==="IF-"){
				if (browserElements.validate(elem)){
					var rep=document.createElement(elem.tagName.substr(3, elem.tagName.length-3));
					for (i=0; i<specialCopy.length; i++){
						// Copy data from the if-element to the replacement (default: ["innerHTML", "attributes"])
						rep[specialCopy[i]]=elem[specialCopy[i]];
					}
					elem.parentNode.replaceChild(rep, elem);
					return rep;
				} else {
					normalHandle(elem);
				}
				return elem;
			}
			
			// Normal element handling
			if (!browserElements.validate(elem)){
				normalHandle(elem)
			}
			if (single==false){
				for (i=0; i<elem.childNodes.length; i++){
					browserElements.main(elem.childNodes[i]);
				}
			}
			return elem;
		}
	}
	window.browserElements.getVersion.edge=window.browserElements.getVersion.ie;
})()