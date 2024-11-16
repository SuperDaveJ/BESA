// JavaScript Document
var d1;
var dleft;
var dtop; 

function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}

function MM_setTextOfLayer(objName,x,newText) { //v4.01
  if ((obj=MM_findObj(objName))!=null) with (obj)
    if (document.layers) {document.write(unescape(newText)); document.close();}
    else innerHTML = unescape(newText);
}
function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}
function MM_goToURL() { //v3.0
  var i, args=MM_goToURL.arguments; document.MM_returnValue = false;
  for (i=0; i<(args.length-1); i+=2) eval(args[i]+".location='"+args[i+1]+"'");
}

function MM_controlShockwave(objStr,x,cmdName,frameNum) { //v3.0
  var obj=MM_findObj(objStr);
  if (obj) eval('obj.'+cmdName+'('+((cmdName=='GotoFrame')?frameNum:'')+')');
}


//************************************* 2nd Part Nav Functyions ********************************************************************
//==== the page number --
function getPage() {
	arrTemp = new Array();
	arrTemp2 = new Array();
	arrTemp = window.location.href.split("/");
	arrTemp2 = arrTemp[arrTemp.length-1].split("?");
	var strTemp = arrTemp2[0];
	var intTemp = strTemp.indexOf(".html");
	strTemp = strTemp.substring(0,intTemp);
	return strTemp.toLowerCase();
	
}


function goURL(pgURL) {
	//closing = false;
	//if (verNumber!=2 ) {
		var arrTemp = new Array();
		arrTemp = pgURL.split("/");
		arrTemp = arrTemp[arrTemp.length-1].split("?");
		var strTemp = arrTemp[0];
	//	if (strTemp!="help.html" && strTemp!="resources.html") {
	//		if ( blnLastPage ) {
	//			updateDatabase()
	//		} else {
	//			updateSuspendData()
	//		}
	//	}
	//}
	window.location = pgURL
}

function refresh() {
	closing = false;
	window.location.reload();
}


function moveIn() {
	d1 = document.all["lyExit"];
	movableObj(-22, 387, 0, 387, 20, 15, d1.id);
}
function moveOut() {
	d1 = document.all["lyExit"];
	movableObj(0, 387, -22, 387, 10, 10, d1.id);
}

function movableObj(startX, startY, endX, endY, delay, speed, refId){
	//alert(startX+", "+startY+", "+endX+", "+endY)
        sX = startX; sY = startY;     eX = endX;
        eY = endY; de = delay; sp = speed;
        ref = refId;
        xL = endX - startX;
        yL = endY - startY;
        with (Math){
                if(abs(xL) > abs(yL)){
                        xS = (xL > 0)?1:-1;
                        yS = (yL > 0)?abs(yL / xL):-abs(yL / xL);
                        howManySteps = abs(xL / speed);
                } else if(abs(yL) > abs(xL)){
                        yS = (yL > 0)?1:-1;
                        xS = (xL > 0)?abs(xL / yL):-abs(xL / yL);
                        howManySteps = abs(yL / speed);
                } else {
                        yS = (yL > 0)?1:-1;
                        xS = (xL > 0)?1:-1;
                        howManySteps = abs(xL / speed);
                }
        }
		if(IE){
				ref = document.all(ref).style;
		} else {
				ref = document[ref];
		}
        doDynamicMovement(sX, sY, eX, eY, de, xS, yS, ref, sp, howManySteps);
}

// doDynamicMovement() -- does the Dynamic Movement

function doDynamicMovement(curX, curY, eX, eY, sp, xS, yS, ref, speed, hS){
        if(Math.floor(hS - 1) != 0){
                hS--;
                curX += xS * speed;
                curY += yS * speed; 
                ref.left = Math.round(curX);
                ref.top = Math.round(curY);
                setTimeout("doDynamicMovement(" + curX + ", " + curY + ", " + eX + ", " + eY + ", " + sp + ", " + xS + ", " + yS + ", ref, " + speed + ", " + hS + ")", sp);
        } else {
                setPos(eX, eY, ref);    
        }
}

// setPos() -- sets the end position accurately when doDynamicMovement has done its job

function setPos(x, y, ref){
        ref.left = x;
        ref.top = y;
}

function popConfirm(){
	if (parent.frames['controller'].lastQ == true) {
		parent.frames['controller'].unloadPage();
	} else {
		if (confirm("If you have not completed the test, your progress will be lost and your score will not be tracked.  Are you sure you want to Exit the exam?")==true) parent.frames['controller'].unloadPage();
	}

}
////= Page Query Functions ================================
//function PageQuery(q) {
//	if(q.length > 1) this.q = q.substring(1, q.length);
//	else this.q = null;
//	this.keyValuePairs = new Array();
//	if(q) {
//		for(var i=0; i < this.q.split("&").length; i++) {
//			this.keyValuePairs[i] = this.q.split("&")[i];
//		}
//	}
//
//	this.getKeyValuePairs = function() { return this.keyValuePairs; }
//
//	this.getValue = function(s) {
//		for(var j=0; j < this.keyValuePairs.length; j++) {
//			if(this.keyValuePairs[j].split("=")[0] == s)
//				return this.keyValuePairs[j].split("=")[1];
//		}
//		return false;
//	}
//
//	this.getParameters = function() {
//		var a = new Array(this.getLength());
//		for(var j=0; j < this.keyValuePairs.length; j++) {
//			a[j] = this.keyValuePairs[j].split("=")[0];
//		}
//		return a;
//	}
//
//	this.getLength = function() { return this.keyValuePairs.length; } 
//}
//
//function getQueryValue(key){
//	var page = new PageQuery(window.location.search); 
//	return unescape(page.getValue(key)); 
//}
////= End of Page Query Functions ================
//************************************ End of 2nd Part Nav Functions **************************************************************


//************************************ 3rd Part Other Functyions ******************************************************************
//======== check browser ===========
browser = navigator.appName
browserNum = parseInt(navigator.appVersion)
N4 = false
N6 = false
IE = false
if ( (browser == "Netscape") && (browserNum < 5) ) N4 = true
else if ( (browser == "Netscape") && (browserNum >= 5) ) N6 = true
else IE = true

//===== end ====

//************************************ End of 3rd Part Other Functions **************************************************************

//function of time countdown
//alert(diffTime)
CountActive = true;

LeadingZero = true;
DisplayFormat = "Your time left: %%H%%:%%M%%:%%S%%";
FinishMessage = "Your time is up.  No score has been recorded for this attempt.  Please exit the test and begin again.";
var DisplayStr;
function CountBack(secs) { //count down the test time

  if (secs < 0) {
    document.getElementById("pageN").innerHTML = FinishMessage;
		//DisplayStr = FinishMessage;
    return;
  }

  DisplayStr = DisplayFormat.replace(/%%H%%/g, calcage(secs,3600,24));
  DisplayStr = DisplayStr.replace(/%%M%%/g, calcage(secs,60,60));
  DisplayStr = DisplayStr.replace(/%%S%%/g, calcage(secs,1,60));

if (secs < 900) document.getElementById("PageN").style.color = "red"
  document.getElementById("PageN").innerHTML = DisplayStr;
  if (CountActive)
    setTimeout("CountBack(" + (secs+parent.frames['controller'].CountStepper) + ")", parent.frames['controller'].SetTimeOutPeriod);
}

function calcage(secs, num1, num2) {
  s = ((Math.floor(secs/num1))%num2).toString();
  if (LeadingZero && s.length < 2)
    s = "0" + s;
  return "<b>" + s + "</b>";
}

if (typeof(DisplayFormat)=="undefined")
  DisplayFormat = "Your time left: %%H%%:%%M%%:%%S%%:";
if (typeof(CountActive)=="undefined")
  CountActive = true;
if (typeof(FinishMessage)=="undefined")
  FinishMessage = "";
if (typeof(CountStepper)!="number")
  CountStepper = -1;
if (typeof(LeadingZero)=="undefined")
  LeadingZero = true;
  
CountStepper = Math.ceil(CountStepper);
if (CountStepper == 0)
  CountActive = false;