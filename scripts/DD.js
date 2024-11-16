// JavaScript Document for Drag and Drop

// Initialization
var nObj;
var qStatus = 0;
var userTries = 0;
var tryLimit = 2;
var strTargetOrder = "";
var strDragOrder = "";
//selectedDrag is the layer that is dragging
var selectedDrag = null;
var dragLayerId;
var offsetX, offsetY;
var dragPositionArray;
var targetPositionArray;
var dragLayerArray 
var targetLayerArray 



//===================get the variables from the DD pages ==================	
function distrload(dragitems) {
	nObj = dragitems;
//	arrPopup[1] = correctA;
	dragPositionArray = new Array(nObj);
	targetLayerArray = new Array(nObj);
	dragLayerArray = new Array(nObj);
	targetPositionArray = new Array(nObj);
	for (var i=0; i<nObj; i++) {
		dragLayerArray[i] = "drag"+(i+1);
		targetLayerArray[i]="target"+(i+1);
		dragPositionArray[i] = new Array(4);
		targetPositionArray[i] = new Array(4)
	}
	
	
}

function initDD() {
	if ( IE ) {
		var targetStyle;
		for (var i=0; i<nObj; i++) {
			/***** Get initial positions *****/
			//drag layers
			eval("dragStyle = document.all['drag" + (i+1) + "'].style");
			dragPositionArray[i][0] = dragStyle.pixelLeft;
			dragPositionArray[i][1] = dragStyle.pixelTop;
			eval("dragPositionArray[" + i + "][2] = document.all['drag" + (i+1) + "'].offsetWidth");	
			eval("dragPositionArray[" + i + "][3] = document.all['drag" + (i+1) + "'].offsetHeight");
			//target layers
			eval("targetStyle = document.all['target" + (i+1) + "'].style");
			targetPositionArray[i][0] = targetStyle.pixelLeft;
			targetPositionArray[i][1] = targetStyle.pixelTop;
			eval("targetPositionArray[" + i + "][2] = document.all['target" + (i+1) + "'].offsetWidth");	
			eval("targetPositionArray[" + i + "][3] = document.all['target" + (i+1) + "'].offsetHeight");
			//alert("drag=" + (i+1) + ": Left=" + dragPositionArray[i][0] + ", Top=" + dragPositionArray[i][1] + ", Width=" + dragPositionArray[i][2] + ", Height=" + dragPositionArray[i][3] + "\rtarget=" + (i+1) + ": Left=" + targetPositionArray[i][0] + ", Top=" + targetPositionArray[i][1] + ", Width=" + targetPositionArray[i][2] + ", Height=" + targetPositionArray[i][3])
		}
		
		//Initialize mouse events
		document.onmousedown = grabItem;
		document.onmousemove = dragItem;
		document.onmouseup = releaseItem;
	} else if (N4) {
		setNSEventCapture()
		document.onmousedown = grabItem
		document.onmousemove = dragItem
		document.onmouseup = releaseItem
	} else {	//NS 6 and others
		for (var i=1; i<=nObj; i++) {
			eval("drag" + i + " = document.getElementById('drag" + i + "')");
			eval("attachEvent(drag" + i + ")");
		}
		
		window.onmousemove = dragItem
	}
}

//set z-index property
function setzIndex(dragLayer, zOrder) {
	if (N6) dragLayer.zIndex = zOrder
	else dragLayer.style.zIndex = zOrder
}

//position an object at a specific pixel coordinate
function shiftTo(dragLayer, x, y) {
	if (N4) dragLayer.moveTo(x, y)
	else if (N6) {dragLayer.style.left = x; dragLayer.style.top = y;}
	else {dragLayer.style.pixelLeft = x; dragLayer.style.pixelTop = y;}
}

function moveBack(dragLayer, intID) {
	shiftTo(dragLayer, dragPositionArray[intID-1][0], dragPositionArray[intID-1][1])
	setzIndex(dragLayer,0)
}

function moveToTarget(dragLayer, intTargetID) {
	//intTargetID is actually the target number - 1
	shiftTo(dragLayer, targetPositionArray[intTargetID][0], targetPositionArray[intTargetID][1])
}

function setSelectedElem(e) {
	//Only N4 and IE call this function
	if (N4) {
		clickX = e.pageX
		clickY = e.pagyY
		//start looking at all the layers on the page from top layer down
		for (i=document.layers.length-1; i>=0; i--) {
			testObj = document.layers[i]	//a draggable layer
			//see if user clicked on a valid layer
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
		//see if the user clicked on a valid layer
		dragLayerId = imgObj.parentElement.id
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
			//x = event.clientX - offsetX
			//y = event.clientY - offsetY
			x = event.clientX - offsetX
			y = event.clientY - offsetY
		} else {
			x = e.pageX - offsetX
			y = e.pageY - offsetY
		}
		shiftTo(selectedDrag, x, y)
		//prevent further system response to dragging
		return false
	}
}

function grabItem(e) {
	//document.getElementById('lyfdbk').style.visibility = "hidden";
	if (N6) {
		offsetX = e.layerX
		offsetY = e.layerY
		selectedDrag = this
		setzIndex(selectedDrag,100)
	} else {
		setSelectedElem(e)
		if (selectedDrag) {
			//MM_showHideLayers('feedback','','hide');
			//MM_showHideLayers('done','','show');
			if (N4) {
				offsetX = e.pageX - selectedDrag.left
				offsetY = e.pageY - selectedDrag.top
			} else {
				offsetX = window.event.offsetX
				offsetY = window.event.offsetY
				
			}
		}
	//alert("offsetX = " + offsetX + ", offsetY = " + offsetY)
		//prevent further processing of mouseDown event so that the Macintosh doesn't
		//display the contextual menu and lets dragging work normally
		return false
	}
}

function releaseItem(e) {
	if (selectedDrag) {
		showFdbk("");
		//determine where user released mouse button
		var releaseX, releaseY;
		if (IE) {	//Microsoft Internet Explorer
			releaseX = window.event.clientX
			releaseY = window.event.clientY
			//get the integer value of the current dragged layer
			intDragLayerID = parseInt(dragLayerId.substr(dragLayerId.length-1,1))
			for (var i=0; i<nObj; i++) {
				//check to see if there is any match
				if ( (releaseX > targetPositionArray[i][0]) && (releaseX < targetPositionArray[i][0]+targetPositionArray[i][2]) && (releaseY > targetPositionArray[i][1]) && (releaseY < targetPositionArray[i][1] + targetPositionArray[i][3]) ) {
					if (strTargetOrder.indexOf((i+1)+",") == -1) {
						moveToTarget(selectedDrag, i)
						//check to see if an object is already in the dragged list. If it is, it's been moved from one target to another
						intTemp = strDragOrder.indexOf(intDragLayerID + ",")
						if (intTemp != -1) {
							// remove from matched list first
							strTargetOrder = strTargetOrder.substring(0,intTemp) + strTargetOrder.substring(intTemp+2,strTargetOrder.length)
							strDragOrder = strDragOrder.substring(0,intTemp) + strDragOrder.substring(intTemp+2,strDragOrder.length)
						}
						// add to matched list
						strTargetOrder = strTargetOrder + (i+1) + ","
						strDragOrder = strDragOrder + intDragLayerID.toString() + ","
						//strDraggedLayers = strDraggedLayers
					} else moveBack(selectedDrag, intDragLayerID)
					break
				} else {
					moveBack(selectedDrag, intDragLayerID)
					intTemp = strDragOrder.indexOf(intDragLayerID + ",")
					if (intTemp != -1) {
						// remove from matched list
						strTargetOrder = strTargetOrder.substring(0,intTemp) + strTargetOrder.substring(intTemp+2,strTargetOrder.length)
						strDragOrder = strDragOrder.substring(0,intTemp) + strDragOrder.substring(intTemp+2,strDragOrder.length)
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
			
			//see if user released inside of target
			if ( (releaseX > targetLeft) && (releaseX < targetLeft + targetWidth) && (releaseY > targetTop) && (releaseY < targetTop + targetHeight) ) {
			//alert("dragged on target.")
			}
		}

		//turn off drag
		setzIndex(selectedDrag, 1)
		selectedDrag = null
	}
}

function attachEvent(obj) {
	
	if (N6) {//for N6 only
	obj.addEventListener("mousedown", grabItem, false)
	obj.addEventListener("mousemove", dragItem, false)
	obj.addEventListener("mouseup", releaseItem, false)
	}
}

function judgeInteraction() {
	var strTemp
	MM_showHideLayers('done','','hide');
	if (strDragOrder.length == 0) {
		strTemp = arrPopup[0];
	} else {
		userTries += 1;
		if (userTries > tryLimit) return	//do nothing, Exit the function.
		if ( (strTargetOrder == strDragOrder) && (strDragOrder.length/2 == nObj) ) {
			qStatus = 1
			//disable interaction
			disableDrag();
			strTemp = arrPopup[1];
			userTries = tryLimit;
		} else if (userTries == tryLimit) {
			// move to correct location
			for (var i=0; i<nObj; i++) eval("moveToTarget(drag" + (i+1) + ", " + i + ")")
			//disable interaction
			disableDrag();
			strTemp = arrPopup[2];
		} else {
			// move back incorrect ones
			var strTempD = strDragOrder;
			var strTempT = strTargetOrder;
			for (var i=0; i<strTargetOrder.length/2; i++) {
				var strTemp = strDragOrder.substr(i*2,1);
				if (strTargetOrder.substr(i*2,1) != strTemp ) {
					eval("moveBack(drag" + strTemp + ", " + strTemp + ")")
					intTemp = strTempD.indexOf(strTemp + ",")
					if (intTemp != -1) {
						// remove from matched list
						strTempD = strTempD.substring(0,intTemp) + strTempD.substring(intTemp+2,strTempD.length)
						strTempT = strTempT.substring(0,intTemp) + strTempT.substring(intTemp+2,strTempT.length)
					}
				}
			}
			strTemp = arrPopup[3];
			strDragOrder = strTempD;
			strTargetOrder = strTempT;
			//alert("strTempD = " + strTempD + "\rstrTempT = " + strTempT)
		}
	}
	showFdbk(strTemp);
	//document.getElementById('lyfdbk').innerHTML = strTemp;
	//document.getElementById('lyfdbk').style.visibility = "visible";
}

function showFdbk(strTemp) {
	document.getElementById('lyfdbk').innerHTML = strTemp;
	if (strTemp=="") {
		document.getElementById('lyfdbk').style.visibility = "hidden";
		if(document.getElementById('feedback')!=null) document.getElementById('feedback').style.visibility = "hidden";
		document.getElementById('done').style.visibility = "visible";
	} else {
		document.getElementById('lyfdbk').style.visibility = "visible";
		if(document.getElementById('feedback')!=null) document.getElementById('feedback').style.visibility = "visible";
		document.getElementById('done').style.visibility = "hidden";
	}
}

//set event capture for N4
function setNSEventCapture() {
	document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP)
}

function disableDrag() {
	document.onmousedown = null;
	document.onmousemove = null;
	document.onmouseup = null;
}