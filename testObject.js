var testObject = (function(){
	var count = 0;
	var timer;
	var startCounting = function(){
		timer = setInterval(inc,100);
	}
	var inc =  function (){
		count ++;
		if(count>=10){
			clearInterval(timer);
			callBack();		
		}
		console.log(count+" : count");
	}
	var callBack = function(){
		console.log("ParentCallBack");
	}
	return{
		startCounting:startCounting,
		callBack:callBack
	}
})();
