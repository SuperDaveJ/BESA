// JavaScript Document for MA
	var triesLimit = 2;
	var triesUser = 0;
	var correctAns;
	var strHTML = ""
	var blnChoiceMade = false;
	var distracters = new Array();
	var arrPopup = new Array()
	var userAns = 0;
	arrLetters = new Array(7);
	arrLetters[1] = "a";
	arrLetters[2] = "b";
	arrLetters[3] = "c";
	arrLetters[4] = "d";
	arrLetters[5] = "e";
	arrLetters[6] = "f";
	

//===================get the variables from the MC pages ==================	
function distrload(distori,popup,correctA) {
	correctAns = correctA;
	for (var i=0; i<popup.length; i++) {
		arrPopup[i] = popup[i];
	}
	for (var i=0; i<distori.length; i++) {
		distracters[i] = distori[i];
	}
	buildquestion ();
	
}

//============ plug the distracter into html ===============
function buildquestion () {

	for (var i=1; i<=distracters.length; i++) {
		//table cells 
		strHTML = strHTML + "<tr><td width='40'><a href='javascript:itemSelection("+ i +")'><img src='../../sysimages/mc_circle_"+arrLetters[i]+"_0.png' alt='Distracter "+arrLetters[i].toUpperCase()+"' id='img"+i+"' name='img"+i+"' width'38' height='38' border='0' /></a></td>"
		strHTML = strHTML + "<td class='distrText'>"+ distracters[i-1] +"</td></tr>"	
	}
	strHTML = strHTML + "<tr><td colspan='2' height='10'></td></tr><tr>"
//done button		
	strHTML = strHTML + "  <tr><td colspan='2' align='center'><span id='done'><a href='javascript:judgeInteraction()'  onMouseOver='MM_swapImage(&quot;imgdone&quot;,&quot;&quot;,&quot;../../sysimages/done_2.jpg&quot;,1)' onMouseOut='MM_swapImgRestore()'><img src='../../sysimages/done_0.jpg' name='imgdone' id='imgdone' alt='Done button' border='0' /></a></span></td></tr></table>"

//feedback layer
	strHTML = strHTML + "<div id='feedback' style='position:relative; top:-42px; width:760px; visibility:hidden;'><div class='txtfdbk' id='lyfdbk'></div></div>"
	strHTML = "<table width='670' border='0' cellspacing='3' cellpadding='3'>" + strHTML
	document.getElementById('lydistracters').innerHTML = strHTML
}

//=============the action for selecting the distracters ==========
function itemSelection( I ) {

	if (blnChoiceMade==false ) {
	userAns = I;
	document.getElementById('lyfdbk').innerHTML = "";
	document.getElementById('lyfdbk').style.visibility = "hidden";
	document.getElementById('done').style.visibility = "visible";
		for (var j=1; j<=nItems; j++) {
			var g = eval("document.getElementById('img"+j+"').src");
			var name = "img"+j;
			var gnum = g.charAt(g.length-5)
			var gfilename = getgname(g);
			var gpath = getgpath(g)
			if (j==I && gnum=="0" ) {
				gfilename = gfilename.replace('_0','_2')	
			} else if (j!=I && gnum=="2"  ) {
				gfilename = gfilename.replace('_2','_0')
			}
			document.getElementById(name).src = gpath+gfilename;
    	}
	}
}


//============click done to judge the question =======
function judgeInteraction() {
var strTemp = "";	
triesUser += 1;
//alert(userAns)  
		if (userAns=="") {
			strTemp = arrPopup[0];
			triesUser -= 1;
		} else {
			if (userAns==correctAns) {
				strTemp = arrPopup[1];
				triesUser = triesLimit;
				finalstep()
				blnChoiceMade=true;
			} else {
				if (triesUser == triesLimit ) {
					strTemp = arrPopup[2];
					//itemSelection( correctAns ) ;
					finalstep()
					blnChoiceMade=true;
				}else {
					strTemp = arrPopup[userAns+2];
				}
			}
		}
	document.getElementById('done').style.visibility = "hidden";
	document.getElementById('lyfdbk').innerHTML = strTemp;
	document.getElementById('lyfdbk').style.visibility = "visible";
	document.getElementById('feedback').style.visibility = "visible";
}

//====final step: highlight correct answer and lock them up ==
function finalstep() {	
	for (var j=1; j<=nItems; j++) {
			var g = eval("document.getElementById('img"+j+"').src");
			var name = "img"+j;
			var gnum = g.charAt(g.length-5)
			var gfilename = getgname(g);
			var gpath = getgpath(g)
			if (j==correctAns && gnum=="0" ) {
				gfilename = gfilename.replace('_0','_2')	
			} else if (j!=correctAns && gnum=="2"  ) {
				gfilename = gfilename.replace('_2','_3')
			}else{
				gfilename = gfilename.replace('_0','_3')
			}
			document.getElementById(name).src = gpath+gfilename;
    	}

	if ((obj=MM_findObj("fdbkContinue"))!=null) document.getElementById("fdbkContinue").style.visibility = "visible"
}