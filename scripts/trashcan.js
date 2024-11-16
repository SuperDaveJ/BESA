// JavaScript Document for Trashcan



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
var nUser = 0;			//number of user selection that are correct
var strCorrectObjs;
arrCorrectObjs = new Array();
var userCorrect = 0;
var targetCenterX, targetCenterY;
var targetLeft, targetRight, targetTop, targetBottom;
var targetOffsetX = 50;	//Horizontal distance from correct item center to target center in pixels
var targetOffsetY = 50;	//Vertical distance from correct item center to target center in pixels
var strUserImages = "";
var CorrectAns ="";
var strMatched = "";
var selectedDrag = null;
var dragLayerId, intDragNum;

var offsetX, offsetY;

var dragLayerArray; // targetPositionArray;
targetLayerArray = new Array("target1");

for (var i=0; i<nObj; i++) {
	dragPositionArray[i] = new Array(4)
	//targetPositionArray[i] = new Array(4)
}

//===================get the variables from the original pages ==================	
function distrload(dragitems, correctA, CorrectAns) {
	nObj = dragitems;
	CorrectAns = CorrectAns;
	nCorrect = correctA.length/2;
	strCorrectObjs = correctA;
	arrCorrectObjs = strCorrectObjs.substring(0,strCorrectObjs.length-1).split(",")
	dragLayerArray = new Array(nObj);
	dragPositionArray = new Array(nObj);
	//targetPositionArray = new Array(nObj);
	for (var i=0; i<nObj; i++) {
		dragLayerArray[i] = "drag"+(i+1);
		dragPositionArray[i] = new Array(4);
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

		targetLeft = parseInt(target1.style.left)
		targetRight = targetLeft + parseInt(target1.style.width) //target1Img.width
		targetTop = parseInt(target1.style.top)
		targetBottom = targetTop + target1Img.height
		targetCenterX = targetLeft + parseInt(target1.style.width)/2       //(targetRight-targetLeft)/2
		targetCenterY = targetTop + target1Img.height/2
		//targetPositionArray[1][0] = targetLeft + 10
		//targetPositionArray[1][1] = targetTop - 10
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
	//setTarget()
}

function setCorrect() {
	var strTemp = CorrectAns 
	document.getElementById('lyfdbk').innerHTML = strTemp;
	document.getElementById('lyfdbk').style.visibility = "visible";
	MM_showHideLayers('fdbkContinue','','show')
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

function moveBack(objDragLayer) {
	
	var releaseX, releaseY;
	releaseX = window.event.clientX
	releaseY = window.event.clientY
	movableObj(releaseX, releaseY, dragPositionArray[intDragNum-1][0], dragPositionArray[intDragNum-1][1], 10, 10, objDragLayer.id)
	setzIndex(objDragLayer,0)
	//alert(releaseX +", " + releaseY +", "+ dragPositionArray[intDragNum-1][0]+", "+ dragPositionArray[intDragNum-1][1]+", "+objDragLayer.id)
	//shiftTo(objDragLayer, dragPositionArray[intDragNum-1][0], dragPositionArray[intDragNum-1][1])
	
}

function moveToTarget(objDragLayer,itemN) {
	shiftTo(objDragLayer, targetCenterX-target1Img.width/2, targetCenterY)
	var dragitem="Drag"+(itemN+1)+"Img"
	opacity(dragitem, 100, 0, 500);
	//eval("document.getElementById('drag" + (itemN+1) + "').style.visibility = 'hidden'")
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
		//determine where user released mouse button
		var releaseX, releaseY;
		if (IE) {	//Microsoft Internet Explorer
			releaseX = window.event.clientX
			releaseY = window.event.clientY
			
			for (var i=0; i<nObj; i++) {
				//check to see if there is any match
				if ( (releaseX > targetLeft) && (releaseX < targetRight) && (releaseY > targetTop) && (releaseY < targetBottom) && (i == intDragNum-1) && (strCorrectObjs.indexOf((i+1)+",") != -1) ) {
					moveToTarget(selectedDrag,i)
					if (strMatched.indexOf(intDragNum) == -1) // add to matched list
						strMatched = strMatched + intDragNum.toString() + ","
					break
					
				} else {
					var j = selectedDrag.id.substr(selectedDrag.id.length-1,1);
					j = parseInt(j)-1; 
					if (i==j) {
						
						setzIndex(selectedDrag,iniLayer)
						moveBack(selectedDrag)
						//alert("1")
						intTemp = strMatched.indexOf(intDragNum + ",")
						if (intTemp != -1) // remove from matched list
							strMatched = strMatched.substring(0,intTemp) + strMatched.substring(intTemp+2,strMatched.length)
					}
				}
			}

		} else {	//Other browsers
			releaseX = e.pageX
			releaseY = e.pageY
			if (N6) {
				//have to hard-code this for N6 - Windows for some reason.  It doesn't see the
				//"left" or "top" property until it's explicity set like this.
				document.getElementById("target1").style.left = 10
				document.getElementById("target1").style.top = 50
				targetObj = getElementById("target1").style
				targetWidth = getElementById("target1").offsetWidth			
				targetHeight = getElementById("target1").offsetHeight
				targetLeft = parseInt(getElementById("target1").style.left)
				targetTop = parseInt(getElementById("target1").style.top)
			} else {
				targetObj = document.layers["target1"]
				targetWidth = document.layers["target1"].clip.width
				targetHeight = document.layers["target1"].clip.height
				targetLeft = document.layers["target1"].left
				targetTop = document.layers["target1"].top
			}
			
			if ( (releaseX > targetLeft) && (releaseX < targetRight) && (releaseY > targetTop) && (releaseY < targetBottom) ) {
			}
		}

		selectedDrag = null
		
		userCorrect = 0;
		for (var i=0; i<nCorrect; i++) {
			if (strMatched.indexOf(arrCorrectObjs[i]) != -1) userCorrect += 1
		}
		
		if ( (userCorrect == nCorrect) && (strMatched.length == nCorrect*2) ) {
			disableDrag();
			setCorrect();
		}
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