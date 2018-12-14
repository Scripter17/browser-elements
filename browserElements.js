(function(){
	window.browserElements={
		getIEVersion:function(){ // https://codepen.io/gapcode/pen/vEJNZN
			var ua=window.navigator.userAgent;
			var msie=ua.indexOf('MSIE ');
			if (msie>0){return parseInt(ua.substring(msie+5, ua.indexOf('.', msie)), 10);}
			var trident=ua.indexOf('Trident/');
			if (trident>0){var rv=ua.indexOf('rv:'); return parseInt(ua.substring(rv+3, ua.indexOf('.', rv)), 10);}
			var edge=ua.indexOf('Edge/');
			if (edge>0){return parseInt(ua.substring(edge+5, ua.indexOf('.', edge)), 10);}
			return false;
		},
		getFireFoxVersion:function(){ // Home-made function; Probably broken (User agent list: https://udger.com/resources/ua-list/browser-detail?browser=Firefox )
			// You know you need to re-evaluate your code when you label something as "home-made".
			var ua=navigator.userAgent;
			var i=ua.indexOf("Firefox");
			var v=parseInt(ua.substr(i+8, ua.length-i-8));
			return v;
		},
		getChromeVersion:function(){ // https://stackoverflow.com/a/4900484
			var raw=navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
			return (raw?parseInt(raw[2], 10):false);
		},
		getBrowser:function(){ // TODO: Make this much more rigorous.
			var browser;
			var IEdge=browserElements.getIEVersion();
			if (IEdge>=12 && typeof IEdge==="number"){
				browser="Edge";
			} else if (IEdge<=11 && typeof IEdge==="number"){
				browser="IE";
			} else if (navigator.userAgent.indexOf("Firefox")!=-1){
				browser="Firefox";
			} else if (navigator.userAgent.indexOf("Chrome")!=-1){
				browser="Chrome";
			}
			return browser;
		},
		getBrowserVersion:function(){
			var type=browserElements.getBrowser();
			if (type=="Chrome"){return browserElements.getChromeVersion();}
			if (type=="Firefox"){return browserElements.getFireFoxVersion();}
			if (type=="Edge"){return browserElements.getIEVersion()-11;}
			if (type=="IE"){return browserElements.getIEVersion();}
			return null;
		},
		main:function(){
			// type=Chrome ver=70
			//
			// if-chrome[minv=(1..70)][maxv$=(70..999)],
			// if-chrome[maxv$=(70..999)]:not([minv]),
			// if-chrome[minv=(1..70)]:not([maxv]),
			// if-chrome:not([minv]):not([maxv]), {display:block;}
			//
			// if-custom[type~="chrome"][minv=(1..70)][maxv$=(70..999)],
			// if-custom[type~="chrome"][maxv$=(70..999)]:not([minv]),
			// if-custom[type~="chrome"][minv=(1..70)]:not([maxv]),
			// if-custom[type~="chrome"]:not([minv]):not([maxv]), {display:block;}
			
			var sheet=document.createElement("style");
			var type=browserElements.getBrowser();
			var ver=browserElements.getBrowserVersion();
			var min, max;
			var maxmax=Math.pow(10,((ver+"").length)-1);
			var ifname="if-"+type.toLowerCase();
			var ifcust="if-custom[type~=\""+type.toLowerCase()+"\"]";
			var txt="if-ie, if-edge, if-firefox, if-chrome, if-custom{display: none;}\n"; // Makes browserElements not show up in the 0.05 seconds it takes to generate the CSS
			var txt2=""; // A weird bug in some Chrome versions makes too many selectors not work. Sorry, but it has to be done this way
			txt+=ifname+":not([minv]):not([maxv]),"; // if-chrome:not([minv]):not([maxv])
			txt2+=ifcust+":not([minv]):not([maxv]),";
			for (min=1; min<=ver; min++){
				txt+=ifname+"[minv=\""+min+"\"]:not([maxv]),"; // if-chrome[minv=(1..70)]:not([maxv])
				txt2+=ifcust+"[minv=\""+min+"\"]:not([maxv]),";
				for (max=ver; max<=maxmax; max++){
					txt+=ifname+"[minv=\""+min+"\"][maxv$=\""+max+"\"],"; // if-chrome[minv=(1..70)][maxv$=(70..999)]
					txt2+=ifcust+"[minv=\""+min+"\"][maxv$=\""+max+"\"],";
				}
			}
			for (max=ver; max<=maxmax; max++){txt+=ifname+"[maxv$=\""+max+"\"]:not([minv]),";} // if-chrome[maxv$=(70..999)]:not([minv])
			for (max=ver; max<=maxmax; max++){txt2+=ifcust+"[maxv$=\""+max+"\"]:not([minv]),";}
			txt=txt.substr(0, txt.length-1)+"{display: block;}\n"+txt2.substr(0, txt2.length-1)+"{display: block;}";
			sheet.innerHTML=txt;
			document.head.appendChild(sheet);
			/*console.log(txt.substr(0,300))
			console.log("...")
			console.log(txt.substr(txt.length-100,100))*/
			browserElements.genCSS=txt;
		}
	}
})()