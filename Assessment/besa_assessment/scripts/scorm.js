//This is a simple module SCO for FAA - APT course
var inLMS = false; 	//	inLMS is set in SCOFunctions.js file automatically
var bookmark = "";
var strPagesViewed = "";
var strLessonStatus = "";
var strModuleStatus = ""
var exitPageStatus = false;
var nPages;
/* module level SCO var.: number of lessons in the module */
var modNumber = 1 //parseInt(mID.substr(2,1));

for (var i=0; i<modLessons; i++) strLessonStatus = strLessonStatus + "0";
var modLessons = 1;
/* ===funciton to initiate the modul(SCO) course===*/

function setLessonsToCompleted() {
	strLessonStatus = "";
	for (var i=0; i<modLessons; i++) strLessonStatus = strLessonStatus + "2";
}

function startCourse() {
	
	loadPage();	
	
	if (inLMS == true) {
		strModuleStatus = doLMSGetValue( "cmi.core.lesson_status" );
		var strTemp = doLMSGetValue( "cmi.suspend_data" );
		//if (strTemp == "" || typeof(strTemp) == "undefined") {
		if ( strTemp == "301" ) {	//NotInitialized
			doLMSSetValue( "cmi.suspend_data", "" );
			doCommit();
		} else if ((strModuleStatus == "completed") || (strModuleStatus == "passed")){
			
			setLessonsToCompleted();
		} else {
			//strPagesViewed = strTemp;
			if ( (strTemp != "") && (typeof(strTemp) != "undefined") ) {
			arrTemp = new Array();
			arrTemp = strTemp.split("~");
			strLessonStatus = arrTemp[0];		// a stream of 2 or 3 numbers
			strPagesViewed = arrTemp[1];
			}
		}
		
		//if (doLMSGetValue("cmi.core.entry") == "resume") {
			bookmark = doLMSGetValue("cmi.core.lesson_location");
			if ( (bookmark == "301") || (bookmark == "") || (typeof(bookmark) == "undefined") ) bookmark = "";
		//}
	}

		//alert(bookmark)
	//if ( (bookmark != "") && ((lessonStatus != "completed") || (lessonStatus != "passed")) ) {

	startPage = "q0.html" //mID + "_menu.htm";
	if ( bookmark != "" ) {
		if (confirm("Do you wish to resume where you left?")==true) {
			var lesson = bookmark.substr(1,1);
			if (lesson == 1) nPages = 19
			else if (lesson == 2) nPages = 20
			contentFrame.location.href = "lesson"+bookmark.substr(1,1)+"/" + bookmark; 
		} else contentFrame.location.href = startPage;
	} else {
		//load main menu
		contentFrame.location.href = startPage;
	}
}

/*************** Exit button is clicked. Module is exited properly. ******************/
function exitCourse() {

	if ( exitPageStatus != true ) {
		
		if ( inLMS == true ) {
			if (contentFrame.blnLastPage) updateLessonStatus('2');
			//setTimeout("exitClicked()", 1000);
			saveBookmark();
			if ( checkModuleStatus() ) {
				doLMSSetValue( "cmi.core.lesson_status", "completed" );
				doLMSSetValue( "cmi.suspend_data", "" );
			} else {
				doLMSSetValue( "cmi.core.lesson_status", "incomplete" );
				updateSuspendData();
			}
			unloadPage();
			exitPageStatus = true;
			window.opener.parent.close();
			window.close();			
			//window.parent.close();
		} else {
			exitPageStatus = true;
			window.close();
		}
	}

}
function exitClicked() {
	saveBookmark();
	if ( checkModuleStatus() ) {
		doLMSSetValue( "cmi.core.lesson_status", "completed" );
		doLMSSetValue( "cmi.suspend_data", "" );
	} else {
		doLMSSetValue( "cmi.core.lesson_status", "incomplete" );
		updateSuspendData();
	}
}



function unloadCourse() {
	if (exitPageStatus != true) {
		
		exitCourse();
	}
}

/*************** End of Exit button is clicked. Module is exited properly. ******************/
//This function needs to be called from last page of each lesson. updateLessonStatus('2')
function updateLessonStatus(cStatus) {
	var iLes = getLesson();
	if (iLes > 0) strLessonStatus = strLessonStatus.substr(0,iLes-1) + cStatus + strLessonStatus.substr(iLes);
	//if (cStatus == "2") cleanSuspendData();
	//else 
	//updateSuspendData();
}

function gotoPage(direction, pgURL) {

	if (isPageViewed(getPage()) == false && direction == "f")  {
		  if (contentFrame.blnLastPage) premenu();
		  else  strPagesViewed = strPagesViewed + "," + getPage();
	}
	contentFrame.location.href = pgURL;
		
}

function premenu() {
	if (contentFrame.blnLastPage) updateLessonStatus('2');
	if ( checkModuleStatus() && inLMS ) doLMSSetValue( "cmi.core.lesson_status", "completed" );
	updateSuspendData()
}

function toModuleMenu() {
	mFile =  "../" + mID + "_menu.htm";
	if (contentFrame.blnLastPage) premenu();
	contentFrame.location.href = mFile;
}

function saveBookmark() {
	//alert(getPage().indexOf("menu"))
	var strBookmark = "";
	if (contentFrame.blnLastPage!= true && getPage().indexOf("menu") == -1)  {
		strBookmark =  getPage() + ".htm";
	}
	doLMSSetValue( "cmi.core.lesson_location", strBookmark);	
}


function refresh() {
	contentFrame.location.reload();
}

function getPage() {
	//return current page file name in lower case without file extension.
	arrTemp = new Array();
	arrTemp2 = new Array();
	arrTemp = contentFrame.location.href.split("/");
	arrTemp2 = arrTemp[arrTemp.length-1].split("?");
	var strTemp = arrTemp2[0];
	var intTemp = strTemp.indexOf(".htm");
	strTemp = strTemp.substring(0,intTemp);
	return strTemp.toLowerCase();
}

function getLesson() {
	//Returns an integer as lessonID
	if ( getPage().indexOf("menu") > 0 ) {
		return 0;
	} else {
		arrTemp = new Array();
		arrTemp = contentFrame.location.href.split("/");
		var strTemp = arrTemp[arrTemp.length-2];
		return parseInt(strTemp.substring(6) );
	}
}

function getLessonStatus(iLes) {	//returns an integer 0, 1, or 2.
	var intTemp;
	intTemp = parseInt(strLessonStatus.substr(iLes-1,1));
	if ( (intTemp < 0) || (intTemp > 2) ) return 0;
	else return intTemp;
}

function checkModuleStatus() {
	if (strModuleStatus == "completed") return true;
	for (var i=1; i<=modLessons; i++) {
		if (getLessonStatus(i) != 2) {
			return false;
			break;
		}
	}
	return true;
}

/*======end above functions =======*/

function isPageViewed(pageFile) {
	
	if ( (strLessonStatus == "completed") || (strLessonStatus == "passed") ) return true;
	if (strPagesViewed.indexOf(pageFile) >= 0) return true;
	else return false;
}

function updateSuspendData() {
   	if ((strPagesViewed == "") || (typeof(strPagesViewed) == "undefined")) {
		strPagesViewed = ""
	}
	var iLes = getLesson();
	if ( iLes > 0 ) { //NOT on the mainmenu or any lesson menu
		if (strPagesViewed.indexOf(getPage()) == -1)  {
			strPagesViewed = strPagesViewed + "," + getPage();
		}
	}
	if (contentFrame.blnLastPage== true) strPagesViewed = "";
	strTemp = strLessonStatus + "~" + strPagesViewed;
	if (inLMS == true) {
		doLMSSetValue("cmi.suspend_data", strTemp);
		//doCommit();
		//doLMSSetValue( "cmi.suspend_data", strPagesViewed );
	}
}

function cleanSuspendData() {
	var re = /,,/g;
	var strTemp = strPagesViewed.toLowerCase();
	arrTemp = strTemp.split(",");
	for (var i=1; i<=parent.modLessons; i++) {
		if (getLessonStatus(i) == 2) {
			for (var k=0; k<arrTemp.length; k++) {
				if ( (parseInt(arrTemp[k].substr(0,1))==modNumber) && (parseInt(arrTemp[k].substr(1,1))==i) ) arrTemp[k] = ""
			}
		}
	}
	strTemp = arrTemp.join();
	while (strTemp.indexOf(",,") != -1) {
		str2 = strTemp.replace(re,",");
		if (str2.substr(0,1) == ",") str2 = str2.substr(1);
		strTemp = str2;
	}
	//after cleaned
	strPagesViewed = strTemp;
	updateSuspendData();
}
/*======end above functions ======*/


function saveScore( uScore ) {
	oldScore = doLMSGetValue( "cmi.core.score.raw" );
	if ( (oldScore == "301") || (oldScore == "") || (oldScore == "undefined") || (typeof(oldScore) == "undefined") ) {
		doLMSSetValue( "cmi.core.score.raw", uScore );
	} else if (uScore > oldScore) {
		doLMSSetValue( "cmi.core.score.raw", uScore );
	} else {
		return false;
	}
}
