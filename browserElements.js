(function(){
	window.browserElements={
		getIEVersion:function(){ // https://codepen.io/gapcode/pen/vEJNZN
			var ua=window.navigator.userAgent;
			var msie=ua.indexOf('MSIE ');
			if (msie>0){
				return parseInt(ua.substring(msie+5, ua.indexOf('.', msie)), 10);
			}
			var trident=ua.indexOf('Trident/');
			if (trident>0){
				var rv=ua.indexOf('rv:');
				return parseInt(ua.substring(rv+3, ua.indexOf('.', rv)), 10);
			}
			var edge=ua.indexOf('Edge/');
			if (edge>0){
				return parseInt(ua.substring(edge+5, ua.indexOf('.', edge)), 10);
			}
			return false;
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
			} else if (/chrome/i.test(navigator.userAgent)){
				browser="Chrome";
			} else if (/firefox/i.test(navigator.userAgent)){
				browser="Firefox";
			}
			return browser;
		},
		getBrowserVersion:function(){
			var type=browserElements.getBrowser();
			if (type=="Chrome"){return browserElements.getChromeVersion();}
			if (type=="Firefox"){return false;}
			if (type=="Edge"){return browserElements.getIEVersion()-11;}
			if (type=="IE"){return browserElements.getIEVersion();}
			return null;
		},
		main:function(relem){
			// type=Chrome v=70
			// if-ie, if-edge, if-firefox, if-chrome:not([minv=(1..70)][maxv$=(70..99)]), if-chrome:not([minv=(1..70)][maxv$=(100..999)]){display:none;}
			var sheet=document.createElement("style");
			var txt="if-ie, if-edge, if-firefox, if-chrome{display:none;}";
			var type=browserElements.getBrowser();
			var ver=browserElements.getBrowserVersion();
			var min, max;
			var max1l=10**((ver+"").length)-1;
			var ifname="if-"+type.toLowerCase();
			console.log(ifname)
			var i;
			txt+=ifname+":not([minv]):not([maxv]), ";
			for (min=1; min<=ver; min++){
				txt+=ifname+"[minv=\""+min+"\"]:not([maxv]), ";
				for (max=ver; max<=max1l; max++){
					txt+=ifname+"[minv=\""+min+"\"][maxv$=\""+max+"\"], ";
				}
			}
			for (max=ver; max<=max1l; max++){
				txt+=ifname+"[maxv$=\""+max+"\"]:not([minv]), ";
			}
			
			//for (min=1; min<=ver; min++){
			//	for (max1=ver; max1<=max1l*10+9; max1++){
			//		txt+=":not([minv=\""+min+"\"]"+"[maxv$=\""+max1+"\"])"
			//	}
			//}
			txt=txt.substr(0,txt.length-2)+"{display:inline;}";
			sheet.innerHTML=txt;
			document.body.append(sheet)
			console.log(txt.substr(0,300))
			console.log("...")
			console.log(txt.substr(txt.length-100,100))
			window.aaa=txt
		}
	}
})()