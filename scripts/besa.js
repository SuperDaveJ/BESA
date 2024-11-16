//Javascript Document for BESA, Shared Functions
//The document covers three parts of functions for the course BESA
//1st Part --  LMS functions
//2nd Part --Nav functyions
//2nd Part -- Other functions


//************************************* 1st Part LMS Functyions ********************************************************************
var verNumber = 2; // 1: for LMS; 2: CD.
var nModule = 16; //total units: 15

arrMLessons = new Array (1,2,3,6,5,4,2,2,7,6,4,2,4,7,2,2) //lessons in each unit (include the process check for each unit)
arrLessonStatus = new Array(nModule); //array to hold the status for each lesson: 0--unread; 1--halfway through; 2--completed
arrLessonTimes = new Array(nModule); //array to hold the time student take for each lesson
for (var i=0; i<nModule; i++) {
	arrLessonStatus[i] = new Array(arrMLessons[i]);
	arrLessonTimes [i] = new Array(arrMLessons[i]);
	for(var j=0; j<arrMLessons[i]; j++) {
		arrLessonStatus[i][j] = 0;
		arrLessonTimes [i][j] = 0
	}
}
var lastPage; //hold the name of a page(screen) from where the learner exit the course
var strPagesViewed; // hold the pages taht have been reviewed in current lesson
var blnLastPage = false; // turn to true when reach the last page
var strCourseStatus = "";
var closing = true; // for exit course
var bkmkpage = "mainmenu.html";
//======
function initializeCourse() {
	if (verNumber != 2 ) {
		loadPage(); //call the function in SCOFunctions.js
		
		//if (typeof(startDate) == "undefined") startDate = new Date().getTime()
		setCookie("startTime", startDate);

		var strLoc = doLMSGetValue("cmi.core.lesson_location")
		
		if (strLoc != "" && typeof(strLoc) != "undefined") bkmkpage = strLoc
		var strTemp = doLMSGetValue( "cmi.suspend_data" ); // get suspend data		
		var strTempL = ""
		var strTempT = ""
		if (strTemp == "" || typeof(strTemp) == "undefined") { //first time/no data, set up the data
			blnFirstTime = true;			
			for (i=0; i<nModule; i++) {
				for (j=0; j<arrLessonStatus[i]; j++) {
					strTempL += arrLessonStatus[i][j].join() + ",";//"," --separator for lessons in each unit; 
					strTempT += arrLessonTimes[i][j].join() + ",";
				}
				strTempL += arrLessonStatus[i].join() + "~";//"~" -- separator for units 
				strTempT += arrLessonTimes[i].join() + "~";//"~" -- separator for units 
			} 
			doLMSSetValue( "cmi.suspend_data", strTempL+"!"+strTempT );
			doLMSCommit();
		} else {
			blnFirstTime = false;
			strCourseStatus = doLMSGetValue("cmi.core.lesson_status");
			getSuspendData();				
		}
	}
}

function getSuspendData() {
	if (verNumber != 2 ) {
		var strTemp = doLMSGetValue( "cmi.suspend_data" );
		
		if ( (strTemp != "") && (typeof(strTemp) != "undefined") ) {
			var strTempL = strTemp.substring(0,strTemp.indexOf("!"));
			var strTempT = strTemp.substring(strTemp.indexOf("!")+1,strTemp.length);
			arrTemp1 = new Array();
			arrTemp2 = new Array();
			arrTemp1 = strTempL.split("~");
			arrTemp2 = strTempT.split("~");
			for (i=0; i<nModule; i++) {
				arrTemp3 = new Array();
				arrTemp3 = arrTemp2[i].split(",");
				for (j=0; j<arrMLessons[i]; j++) {
					arrLessonStatus[i][j] = parseInt(arrTemp1[i].charAt(2*j));
				    arrLessonTimes[i][j] = parseInt(arrTemp3[j]);
				}
				//alert(arrLessonTimes)
			}

		}
	}
}

//update each page
function updateSuspendData() {
	if (verNumber != 2 ) {
		var iMod = getUnit();
		var iLes = getLesson();
		lastPage = getPage()+".html";
		//var toNowT = arrLessonTimes[iMod-1][iLes-1]
		if (arrLessonStatus[iMod-1][iLes-1] < 2 ) {
			arrLessonStatus[iMod-1][iLes-1] = 1;
			//arrLessonTimes[iMod-1][iLes-1] = toNowT + getLtime();
		}
		
		var strTempL = "";
		var strTempT = "";
		for (i=0; i<nModule; i++) {
			strTempL += arrLessonStatus[i].join() + "~";
			strTempT += arrLessonTimes[i].join() + "~";
		}
		//strTemp = strTemp //PreExamDone + "~" + strTemp + preScore + "~" + postScore;
		doLMSSetValue("cmi.suspend_data", strTempL+"!"+strTempT);
		doLMSCommit();
	}
}

//update lesson at the last page of each lesson
function updateDatabase() {
	if (verNumber != 2 ) {
		var pageLocation = "";
		getSuspendData();
		var iLes = getLesson();
		var iMod = getUnit();
		var preT = arrLessonTimes[iMod-1][iLes-1]
		var thisT = getLtime()
		lastPage = getPage()+".html"
		var strCourseStatus = doLMSGetValue( "cmi.core.lesson_status" );
		if (blnLastPage && (strCourseStatus != "passed") ) {
			//The course is set to passed at the end of the post-assessment
			if (arrLessonStatus[iMod-1][iLes-1] < 2) arrLessonStatus[iMod-1][iLes-1] = 2
			if (thisT > preT) arrLessonTimes[iMod-1][iLes-1] =  thisT
			//setCookie("startTles", 0);
			//cleanSuspendData();
			
			var nMCompleted = 0;
			var nPassed = 0;
			for (var i=0; i<nModule; i++) {
				var nLCompleted = 0;
				for (var j=0; j<arrMLessons[i]; j++) {
					if (arrLessonStatus[i][j] == 2) nLCompleted += 1
					//if (arrLessonStatus[i][j] == 3) nPassed += 1
				}
				if (nLCompleted == arrMLessons[i]) nMCompleted += 1;
			}
			if (nMCompleted == nModule) {
				pageLocation = "mainmenu.html"
				doLMSSetValue("cmi.core.lesson_status", "passed");
				doLMSSetValue("cmi.core.lesson_location",pageLocation );
	
			} else {
				pageLocation = "unit"+iMod+"/unit"+iMod+"_menu.html"
				doLMSSetValue("cmi.core.lesson_status", "incomplete");
				doLMSSetValue("cmi.core.lesson_location", pageLocation);
			}
		} else {
			//if (arrLessonStatus[iMod-1][iLes-1] < 2) arrLessonStatus[iMod-1][iLes-1] = 1
			//doLMSSetValue("cmi.core.lesson_status", "incomplete");
			
			pageLocation = "unit"+iMod+"/unit"+iMod+"_menu.html"; //"unit"+iMod+"/lesson"+iLes+"/" + lastPage;
			doLMSSetValue("cmi.core.lesson_location", pageLocation);			
		}
		//computeTime() //add this function for saving the session time (the function in SCOFunciton.js) 10/3/08 LMS test this function cause "Incorrect data" error.
		//alert( pageLocation)
		doLMSCommit();
		updateSuspendData();
	}
}

function getLtime() {
	var totalT
	var startTles = getCookie("startTles");
	//alert(startTles)
	if ( startTles != 0 ){
    	var currentT = new Date().getTime();
    	totalT = (currentT - startTles)/1000 // in sec;
		totalT = Math.round(totalT*100/100) // round to sec
		totalT = totalT/60 // in min
		totalT = Math.round(totalT*100/100) // round to min
	} else {
		totalT = 0
	}
	
	  return totalT
}
//
function exitCourse(ExitBtnClicked) {
	if (ExitBtnClicked) closing = false
	if (verNumber != 2) {

		startDate = getCookie("startTime");
		if (typeof(startDate) == "undefined") startDate = 0

		if (getPage()!="mainmenu") updateDatabase();
		unloadPage();
	}
	window.close();
}


//
function initializePage() {
	closing = true;
	if (verNumber != 2) getSuspendData()
	//verNumber = getQueryValue('ver')

}
//
function setCookie(name, value, expire){
	document.cookie = name + "=" + escape(value) + ((expire == null)?"":("; expires =" + expire.toGMTString()))
}
//
function getCookie(Name) {
	var Mysearch = Name + "=";
	if (document.cookie.length > 0) {
		offset = document.cookie.indexOf(Mysearch);
		if (offset != -1){
			offset += Mysearch.length;
			end = document.cookie.indexOf(";", offset);
			if (end == -1)
				end = document.cookie.length;
			return unescape(document.cookie.substring(offset, end));
		}
	}
}

//
function deleteCookie (name) { 
	var exp = new Date();  
	exp.setTime (exp.getTime() - 10);  
	var cookieValue = getCookie (name);  
	document.cookie = name + "=" + cookieValue + "; expires=" + exp.toGMTString();
}


//************************************ End of 1st Part LMS Functions **************************************************************

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

function getLesson() {
	var strTemp = getPage() 
	return parseInt(strTemp.substring(0,1));
}

function getUnit() {
	arrTemp = new Array();
	arrTemp = window.location.href.split("/");
	if (getPage().substr(0,1)!="u") {
		var strTemp = arrTemp[arrTemp.length-3];
	}else{
		var strTemp = arrTemp[arrTemp.length-2];
	}
	strTemp = strTemp.substring(4,strTemp.length);
	return parseInt(strTemp);
}


function goURL(pgURL) {
	closing = false;
	if (verNumber!=2 ) {
		var arrTemp = new Array();
		arrTemp = pgURL.split("/");
		arrTemp = arrTemp[arrTemp.length-1].split("?");
		var strTemp = arrTemp[0];
		if (strTemp!="help.html" && strTemp!="resources.html") {
			if ( blnLastPage ) {
				updateDatabase()
			} else {
				updateSuspendData()
			}
		}
	}
	window.location = pgURL
}

function refresh() {
	closing = false;
	window.location.reload();
}


function toMenu(blnCloseWin) {
	closing = false;
	var iMod = getUnit();
	if (verNumber != 2 && getLesson()!= null) {
		if ( blnLastPage ) {
			updateDatabase()
		} else {
			updateSuspendData()
		}
	}
	if (getPage().substr(0,1)!="u"  ) {
		window.location = "../unit"+iMod+"_menu.html"
	} else {
		window.location = "../mainmenu.html"
	}
}

//= Page Query Functions ================================
function PageQuery(q) {
	if(q.length > 1) this.q = q.substring(1, q.length);
	else this.q = null;
	this.keyValuePairs = new Array();
	if(q) {
		for(var i=0; i < this.q.split("&").length; i++) {
			this.keyValuePairs[i] = this.q.split("&")[i];
		}
	}

	this.getKeyValuePairs = function() { return this.keyValuePairs; }

	this.getValue = function(s) {
		for(var j=0; j < this.keyValuePairs.length; j++) {
			if(this.keyValuePairs[j].split("=")[0] == s)
				return this.keyValuePairs[j].split("=")[1];
		}
		return false;
	}

	this.getParameters = function() {
		var a = new Array(this.getLength());
		for(var j=0; j < this.keyValuePairs.length; j++) {
			a[j] = this.keyValuePairs[j].split("=")[0];
		}
		return a;
	}

	this.getLength = function() { return this.keyValuePairs.length; } 
}

function getQueryValue(key){
	var page = new PageQuery(window.location.search); 
	return unescape(page.getValue(key)); 
}
//= End of Page Query Functions ================
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

//===getting the graphic name ==========
function getgname(gfilename) {
	arrTemp = new Array();
	arrTemp = gfilename.split("/");
	var strTemp = arrTemp[arrTemp.length-1];
	return strTemp.toLowerCase();
	
}
//===end of getting graphic name==========

//===getting the graphic name ==========
function getgpath(gfilename) {
	arrTemp = new Array();
	arrTemp = gfilename.split("/");
	var strTemp = gfilename.substring(0,gfilename.indexOf(getgname(gfilename)));
	return strTemp;
	
}
//===end of getting graphic name==========

////==== play a single audio piece ==========
//function playAudio(audioSrc) {
//	document.all.flaAudio.src = audioSrc;	
//}
////=== end ======

//====== display audio transcript =====
function showaudiot(){
	var strTemp = getElementStyle('lycc','visibility','visibility')
	var v;
	var obj=document.getElementById("lycc")
	if (obj.style) { obj=obj.style; v=(strTemp=='hidden')?'visible':'hidden'; }
    obj.visibility=v; 
}
//====ends========

//======highlight a graphic ==========
function hilightG (Gid) {
	var g = document.getElementById(Gid).src;
	document.getElementById(Gid).src = g.replace('_0','_2');
	
}

function getElementStyle(elemID, IEStyleProp, CSSStyleProp) {
    var elem = document.getElementById(elemID);
    if (elem.currentStyle) {
        return elem.currentStyle[IEStyleProp];
    } else if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle(elem, "");
        return compStyle.getPropertyValue(CSSStyleProp);
    }
    return "";
}
//===== ends ======


//===fade out  ============
function opacity(id, opacStart, opacEnd, millisec) { 
    //speed for each frame 
    var speed = Math.round(millisec / 100); 
    var timer = 0; 

    //determine the direction for the blending, if start and end are the same nothing happens 
    if(opacStart > opacEnd) { 
        for(i = opacStart; i >= opacEnd; i--) { 
            setTimeout("changeOpac(" + i + ",'" + id + "')",(timer * speed)); 
            timer++; 
        } 
    } else if(opacStart < opacEnd) { 
        for(i = opacStart; i <= opacEnd; i++) 
            { 
            setTimeout("changeOpac(" + i + ",'" + id + "')",(timer * speed)); 
            timer++; 
        } 
    } 
} 


function changeOpac(opacity, id) { 
    var object = document.getElementById(id).style; 
    object.opacity = (opacity / 100); 
    object.MozOpacity = (opacity / 100); 
    object.KhtmlOpacity = (opacity / 100); 
    object.filter = "alpha(opacity=" + opacity + ")"; 
} 
//========fade out ends  =====

//== animation movement =============
function movableObj(startX, startY, endX, endY, delay, speed, refId){
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
//====== end animation =================

//==== play audio =============
function PlayFlashMovie(flaFilename)
{
	var flashMovie=getFlashMovieObject(flaFilename);
	flashMovie.Play();
}

function getFlashMovieObject(movieName)
{
  if (window.document[movieName]) 
  {
    return window.document[movieName];
  }
  if (navigator.appName.indexOf("Microsoft Internet")==-1)
  {
    if (document.embeds && document.embeds[movieName])
      return document.embeds[movieName]; 
  }
  else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
  {
    return document.getElementById(movieName);
  }
}
//====== end play audio =========
//************************************ End of 3rd Part Other Functions **************************************************************