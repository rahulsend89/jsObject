jsObject.onReady(function(){var e=jsObject("main"),t=e.el.children,c=10,a=100,n=jsObject("splitId"),s=!1,i=function(e){39==e.keyCode?l():37==e.keyCode&&j()},o=function(){var e,a;for(e=t.length-1;e>=0;e--)a=jsObject(t[e]),a.animate({delay:7*e,time:300,ease:"easeInOutElastic",top:c,width:10*Math.random()+5})},j=function(){c-=a,o()},l=function(){c+=a,o()},d=function(){jsObject.pause()},u=function(){n.revert(),s=!1},b=function(){var e,t,c,a,i;if(!s)for(e=n.expand(),t=20,s=!0,words=e.rvalue.allchar,c=0,a=words.length;a>c;c++)i=20*c,jsObject(words[c]).animate({time:60,delay:i,ease:"easeInBack",top:-20}).el.acb=function(){jsObject(this).animate({time:60,delay:0,top:0,ease:"easeOutBack"},u).toggleClass("toggle").el.acb=function(){jsObject.toggleClass(this,"toggle")}}};jsObject.addEvent(document,"keydown",i),jsObject(f.moveRight).click(l),jsObject(f.pause).click(d),jsObject(f.moveLeft).click(j),jsObject(f.textAnimation).click(b)});