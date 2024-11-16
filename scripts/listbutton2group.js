// JavaScript Document for Trashcan

//check browser
browser = navigator.appName
browserNum = parseInt(navigator.appVersion)
N4 = false
N6 = false
IE = false
if ( (browser == "Netscape") && (browserNum < 5) ) N4 = true
else if ( (browser == "Netscape") && (browserNum >= 5) ) N6 = true
else IE = true

//=============================
// Set the message for the alert box for review the source
var am = "This function is disabled!";

//======disable right-click=========
document.onmousedown = fs;
if (document.layers) window.captureEvents(Event.MOUSEDOWN);
if (N4) window.onmousedown = fs;

function fs(e) {
   if (IE && (event.button >1)){
      alert(am)
      return false
   } else if (N4 || N6 && e.which >1) {
     alert(am)
     return false;
   }
}

//=====================
// Set up question variables
var iniLayer = 3;
var nObj ;
var nCorrect;			//nubmer of correct items
var triesUser = 0;			//number of user selection that are correct
var triesLimit = 2;
var strCorrectObjs;

arrCorrectObjs = new Array();
arrTPropty = new Array();

var targetCenterX, targetCenterY;
var targetLeft, targetRight, targetTop, targetBottom;
var targetOffsetX = 50;	//Horizontal distance from correct item center to target center in pixels
var targetOffsetY = 50;	//Vertical distance from correct item center to target center in pixels
var strUserImages = "";

var strMatched1 = "";
var strMatched2 = "";

var selectedDrag = null;
var dragLayerId, intDragNum;

var offsetX, offsetY;

var dragLayerArray, dragPositionArray, targetPositionArray;
targetLayerArray = new Array("target1");


//===================get the variables from the original pages ==================	
function distrload(dragitems,correctA, tproperty ) {
	nObj = dragitems;
	nCorrect = correctA.length/2;
	strCorrectObjs = correctA;
	arrCorrectObjs = strCorrectObjs.substring(0,strCorrectObjs.length-1).split(",");
	for (var i=0; i<tproperty.length; i++) {
		arrTPropty[i] = tproperty[i];
	}
	dragLayerArray = new Array(nObj);
	dragPositionArray = new Array(nObj);
	targetPositionArray = new Array(nCorrect);
	for (var i=0; i<nObj; i++) {
		dragLayerArray[i] = "drag"+(i+1);
		dragPositionArray[i] = new Array(4);
	}
	strMatched1 = ""
	strMatched2 = ""
	for (var i=0; i<nCorrect; i++) {
		targetPositionArray[i] = new Array(2);
		if (i<nCorrect/2) strMatched1 = strMatched1 +"0," //new add
		else strMatched2 = strMatched2 +"0," //new add
	}
}

function init() {
	
	if ( IE ) {
		var targetStyle;
		for (var i=0; i<nObj; i++) {
			eval("dragStyle = document.all['drag" + (i+1) + "'].style");
			dragPositionArray[i][0] = dragStyle.pixelLeft;
			dragPositionArray[i][1] = dragStyle.pixelTop;
			eval("dragPositionArray[" + i + "][2] = document.all['drag" + (i+1) + "'].offsetWidth");	
			eval("dragPositionArray[" + i + "][3] = document.all['drag" + (i+1) + "'].offsetHeight");
		}

		targetLeft1 = parseInt(target1.style.left) + arrTPropty[1]
		targetLeft2 = parseInt(target1.style.left) + arrTPropty[3]
		targetRight1 = targetLeft1 + 200
		targetRight2 = targetLeft2 + 200
		targetTop = parseInt(target1.style.top) + arrTPropty[0]
		targetBottom = targetTop + 200 //target1Img.height
		for (var i=0; i<nCorrect; i++) {
			if (i<nCorrect/2) targetPositionArray[i][0] = targetLeft1;
			else targetPositionArray[i][0] = targetLeft2;
			if (i==0 || i==nCorrect/2) targetPositionArray[i][1] = targetTop
			else if (i>0 && i<3 ) {
				targetPositionArray[i][1] = targetTop + i*arrTPropty[2];
			} else {
				targetPositionArray[i][1] = targetTop + (i-3)*arrTPropty[2];
			}
		}
		document.onmousedown = grabItem;
		document.onmousemove = dragItem;
		document.onmouseup = releaseItem;
	} else if (N4) {
		setNSEventCapture()
		document.onmousedown = grabItem
		document.onmousemove = dragItem
		document.onmouseup = releaseItem
	} else {	//NS 6 and others
		for (var i=0; i<nObj; i++) {
			eval("drag1 = document.getElementById('drag"+(i+1)+"')")
			eval("attachEvent(drag"+(i+1)+")")
		}
		
		window.onmousemove = dragItem
	}
	//alert(dragItem)
}



//set z-index property
function setzIndex(dragLayer, zOrder) {
	if (N6) dragLayer.zIndex = zOrder
	else dragLayer.style.zIndex = zOrder
}

function shiftTo(dragLayer, x, y) {
	if (N4) dragLayer.moveTo(x, y)
	else if (N6) {dragLayer.style.left = x; dragLayer.style.top = y;}
	else {dragLayer.style.pixelLeft = x; dragLayer.style.pixelTop = y;}
}

function moveBack(objDragLayer, intDragNum) {
	//alert(objDragLayer +", "+intDragNum)
	var releaseX, releaseY;
	//releaseX = window.event.clientX
//	releaseY = window.event.clientY
//	movableObj(releaseX, releaseY, dragPositionArray[intDragNum-1][0], dragPositionArray[intDragNum-1][1], 10, 10, objDragLayer.id)
	shiftTo(objDragLayer, dragPositionArray[intDragNum-1][0], dragPositionArray[intDragNum-1][1])
	setzIndex(objDragLayer,0)
}


function moveToTarget(objDragLayer,itemN,group) {
	//alert(targetPositionArray)
	if (group==1) shiftTo(objDragLayer, targetPositionArray[itemN][0], targetPositionArray[itemN][1])
	else shiftTo(objDragLayer, targetPositionArray[itemN+3][0], targetPositionArray[itemN+3][1])

}

function setSelectedElem(e) {
	//Only N4 and IE call this function
	if (N4) {
		clickX = e.pageX
		clickY = e.pagyY
		for (i=document.layers.length-1; i>=0; i--) {
			testObj = document.layers[i]	//a draggable layer
			for (j=0; j<dragLayerArray.length; j++) {
				if ( (testObj.id == dragLayerArray[j]) && (clickX > testObj.left) && (clickX < testObj.left+testObj.clip.width) && (clickY > testObj.top) && (clickY < testObj.top+testObj.clip.height) ) {
					selectedDrag = testObj
					setzIndex(selectedDrag,100)
					return
				}
			}
		}
	} else {	//IE
		imgObj = window.event.srcElement	//image object
		testObj = imgObj.parentElement	//draggable layer
		dragLayerId = imgObj.parentElement.id
		intDragNum = parseInt(dragLayerId.substring(4,dragLayerId.length))
		for (i=0; i<dragLayerArray.length; i++) {
			if (dragLayerId == dragLayerArray[i] && testObj) {
				selectedDrag = testObj
				setzIndex(selectedDrag,100)
				return
			}
		}
	}
}

function dragItem(e) {
	if (selectedDrag) {
		if (IE) {
			x = event.clientX - offsetX
			y = event.clientY - offsetY
		} else {
			x = e.pageX - offsetX
			y = e.pageY - offsetY
		}
		shiftTo(selectedDrag, x, y)
		return false
	}
}

function grabItem(e) {
	if (N6) {
		offsetX = e.layerX
		offsetY = e.layerY
		selectedDrag = this
		//iniLayer = selectedDrag.zIndex
		setzIndex(selectedDrag,100)
	} else {
		setSelectedElem(e)
		if (selectedDrag) {
			if (N4) {
				offsetX = e.pageX - selectedDrag.left
				offsetY = e.pageY - selectedDrag.top
			} else {
				offsetX = window.event.offsetX
				offsetY = window.event.offsetY
			}
		}
		return false
	}
}

function releaseItem(e) {
	if (selectedDrag) {
		showFdbk("")
		//determine where user released mouse button
		var releaseX, releaseY;
		if (IE) {	//Microsoft Internet Explorer
			releaseX = window.event.clientX
			releaseY = window.event.clientY
		} else {
			releaseX = e.pageX
			releaseY = e.pageY
		}
		for (var i=0; i<nObj; i++) {
			//check to see if there is any match
			if ( (releaseX > targetLeft1) && (releaseX < targetRight1) && (releaseY > targetTop) && (releaseY < targetBottom) && (i == intDragNum-1)  && (strMatched1.indexOf("0") != -1) ) {  //&& (strCorrectObjs.indexOf((i+1)+",") != -1)
			
				var pos = strMatched1.indexOf("0")
				if (strMatched1.indexOf(intDragNum)!=-1) strMatched1 = strMatched1.substring(0,strMatched1.indexOf(intDragNum)) + "0" + strMatched1.substring(strMatched1.indexOf(intDragNum)+1,strMatched1.length)
				strMatched1 = strMatched1.substring(0,pos) + intDragNum + strMatched1.substring(pos+1,strMatched1.length)
				moveToTarget(selectedDrag,pos/2,1)
				pos = strMatched2.indexOf(intDragNum)
				if (pos != -1) {
					strMatched2 = strMatched2.substring(0,pos) + "0" + strMatched2.substring(pos+1,strMatched2.length)
				}
			} else if ((releaseX > targetLeft2) && (releaseX < targetRight2) && (releaseY > targetTop) && (releaseY < targetBottom) && (i == intDragNum-1)  && (strMatched2.indexOf("0") != -1) ) {
				
				var pos = strMatched2.indexOf("0")
				if (strMatched2.indexOf(intDragNum)!=-1) strMatched2 = strMatched2.substring(0,strMatched2.indexOf(intDragNum)) + "0" + strMatched2.substring(strMatched2.indexOf(intDragNum)+1,strMatched2.length)
				strMatched2 = strMatched2.substring(0,pos) + intDragNum + strMatched2.substring(pos+1,strMatched2.length)
				moveToTarget(selectedDrag,pos/2,2)
				pos = strMatched1.indexOf(intDragNum)
				if (pos != -1) {
					strMatched1 = strMatched1.substring(0,pos) + "0" + strMatched1.substring(pos+1,strMatched1.length)
				}
			} else if (i == intDragNum-1) {
				
				var pos = strMatched1.indexOf(intDragNum)
				//alert(pos)
				if (pos != -1) {
					strMatched1 = strMatched1.substring(0,pos) + "0" + strMatched1.substring(pos+1,strMatched1.length)
				}
					moveBack(selectedDrag, intDragNum)
				pos = strMatched2.indexOf(intDragNum)
				if (pos != -1) {
					strMatched2 = strMatched2.substring(0,pos) + "0" + strMatched2.substring(pos+1,strMatched2.length)
				}
					moveBack(selectedDrag, intDragNum)
			}
		}
		setzIndex(selectedDrag,iniLayer)
		selectedDrag = null
	}
}

//============click done to judge the question =======
function judgeInteraction() {
//alert("strMatched1: "+strMatched1+", strMatched2:"+strMatched2)
	var userCorrect = 0;
	var strIncorrect1 = "";
	var strIncorrect2 = "";
	var strTemp = "";
	var strK1 = "";
	var strK2 = "";
	var strCorrectObj1 = "1,2,3,"
	var strCorrectObj2 = "4,5,6,"
	triesUser += 1;
	for (var i=0; i<strCorrectObj1.length; i++) {
		if (strCorrectObj1.match(strMatched1.substr(i,1))) userCorrect += 1
		else if (strMatched1.substr(i,1) != ",") { 
		strIncorrect1 = strIncorrect1 + strMatched1.substr(i,1) + ",";
			strK1 = strK1 + i + ","
		}
	}
	for (var i=0; i<strCorrectObj2.length; i++) {
		if (strCorrectObj2.match(strMatched2.substr(i,1))) userCorrect += 1
		else if (strMatched2.substr(i,1) != ",") { 
		strIncorrect2 = strIncorrect2 + strMatched2.substr(i,1) + ",";
			strK2 = strK2 + i + ","
		}
	}
	
	if (strMatched1.match("0")!=null || strMatched2.match("0")!=null) {
			strTemp = arrPopup[0];
			triesUser -= 1;	
			document.getElementById('fdbkLink').href = "javascript:showFdbk('')"; //hidecont()";
			
	} else if (triesUser < triesLimit ) { 
		disableDrag();						
		if  ((userCorrect-nCorrect) == nCorrect)  {	//correct.
			strTemp = arrPopup[1];
			disableDrag()
			document.getElementById('lyfdbk').style.height = "50px"
			document.getElementById('fdbkLink').href = "javascript:goURL('5rfr03a.html?uC=1')";
			
		} else {
			strTemp = arrPopup[3];
			document.getElementById('fdbkLink').href = "javascript:goURL('5rfr03a.html?uC=0')";
			////move back
			var arrTemp = new Array;
			arrTemp = strK1.substring(0,strK1.length-1).split(",");
			for (var i=0; i<arrTemp.length; i++) {
				//keep correct ones and replace incorrect ones with 0
				strMatched1 = strMatched1.replace(strMatched1.substr(arrTemp[i],1), '0')
			}
			var mbItems = new Array;
			mbItems = strIncorrect1.substring(0,strIncorrect1.length-1).split(",");
			//alert(mbItems)
			for (i=0; i<mbItems.length; i++) {
				if (mbItems[i]!=0) eval("moveBack(drag" + mbItems[i] + ", " + mbItems[i] + ")");
			}
			arrTemp = strK2.substring(0,strK2.length-1).split(",");
			for (var i=0; i<arrTemp.length; i++) {
				//keep correct ones and replace incorrect ones with 0
				strMatched2 = strMatched2.replace(strMatched2.substr(arrTemp[i],1), '0')
			}
			var mbItems = new Array;
			mbItems = strIncorrect2.substring(0,strIncorrect2.length-1).split(",");
			//alert(mbItems)
			for (i=0; i<mbItems.length; i++) {				
				if (mbItems[i]!=0) eval("moveBack(drag" + mbItems[i] + ", " + mbItems[i] + ")");
			}
		}
	} else { //2nd try
		if  ((userCorrect-nCorrect) == nCorrect)  {	//correct.
			strTemp = arrPopup[1];
		} else {			
			strTemp = arrPopup[2];
			setCorrect();
			//document.getElementById('lyfdbk').style.height = "90px"
			document.getElementById('lyfdbk').style.overflow = "auto";
		}
		
		document.getElementById('fdbkLink').href = "javascript:findNext()";
		disableDrag()
	}
	showFdbk(strTemp);
	if (triesUser >1 ) document.getElementById('lyfdbk').style.height = "50px"

}

function showFdbk(strTemp) {
	document.getElementById('lyfdbk').innerHTML = strTemp;
	if (strTemp=="") {
		document.getElementById('lyfdbk').style.visibility = "hidden";
		if(document.getElementById('feedback')!=null) document.getElementById('feedback').style.visibility = "hidden";
		document.getElementById('done').style.visibility = "visible";
		if (document.getElementById('fdbkContinue')!=null) document.getElementById('fdbkContinue').style.visibility = "hidden";
	} else {
		document.getElementById('lyfdbk').style.visibility = "visible";
		if(document.getElementById('feedback')!=null) document.getElementById('feedback').style.visibility = "visible";
		document.getElementById('done').style.visibility = "hidden";
		if (document.getElementById('fdbkContinue')!=null) document.getElementById('fdbkContinue').style.visibility = "visible";
	}

}

function setCorrect() {
	for (var i=0; i<nObj; i++) {
	var obj = eval("document.getElementById('drag"+(i+1)+"')")
		//alert(obj)
		if (i<nCorrect) shiftTo(obj, targetPositionArray[i][0], targetPositionArray[i][1])
		else shiftTo(obj, dragPositionArray[i][0], dragPositionArray[i][1])
	}
}

function attachEvent(obj) {
	if (N4 || N6) {//for N6 only
		obj.addEventListener("mousedown", grabItem, false)
		obj.addEventListener("mousemove", dragItem, false)
		obj.addEventListener("mouseup", releaseItem, false)
	}
}


//set event capture for N4
function setNSEventCapture() {
	if (N4) document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP)
}

function disableDrag() {
	document.onmousedown = null;
	document.onmousemove = null;
	document.onmouseup = null;
}