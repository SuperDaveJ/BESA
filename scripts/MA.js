// JavaScript Document for MA
	var triesLimit = 2;
	var triesUser = 0;
	var correctAns; 
	var strHTML = ""
	var blnChoiceMade = false;
	var distracters = new Array();
	var arrPopup = new Array();
	var userAns;
	arrLetters = new Array(7);
	arrLetters[0] = "a";
	arrLetters[1] = "b";
	arrLetters[2] = "c";
	arrLetters[3] = "d";
	arrLetters[4] = "e";
	arrLetters[5] = "f";	
//===================get the variables from the MC pages ==================	
function distrload(distori,popup,correctA) {
	correctAns = new Array(distori.length);
	userAns = new Array(distori.length);
	correctAns = correctA.split(",");
	for (var i=0; i<popup.length; i++) {
		arrPopup[i] = popup[i];
	}
	for (var i=0; i<distori.length; i++) {
		distracters[i] = distori[i];
		userAns[i]=0;
	}
	//alert(correctA);
	buildquestion ();
	
}

//============ plug the distracter into html ===============
function buildquestion () {
	for (var i=1; i<=distracters.length; i++) {
		//table cells 
		strHTML = strHTML + "<tr><td width='40'><a href='javascript:itemSelection("+ i +")'><img src='../../sysimages/mc_"+arrLetters[i-1]+"_0.jpg' alt='Distracter "+arrLetters[i-1].toUpperCase()+"' id='img"+i+"' name='img"+i+"' width'38' height='38' border='0' /></a></td>"
		strHTML = strHTML + "<td class='distrText'>"+ distracters[i-1] +"</td></tr>"	
	}
	strHTML = strHTML + "<tr><td colspan='2' height='10'></td></tr><tr>"
//done button		
	strHTML = strHTML + "  <tr><td colspan='2' align='center'><span id='done'><a href='javascript:judgeInteraction()'  onMouseOver='MM_swapImage(&quot;imgdone&quot;,&quot;&quot;,&quot;../../sysimages/done_2.jpg&quot;,1)' onMouseOut='MM_swapImgRestore()'><img src='../../sysimages/done_0.jpg' name='imgdone' id='imgdone' alt='Done button' border='0' /></a></span></td></tr></table></div>"

//feedback layer
	strHTML = strHTML + "<div id='feedback' style='position:relative; top:-42px; width:760px; visibility:hidden;'><div class='txtfdbk' id='lyfdbk'></div></div>"
	strHTML = "<div id='table' style='position:relative; left:25px'><table width='670' border='0' cellspacing='3' cellpadding='3'>" + strHTML
	document.getElementById('lydistracters').innerHTML = strHTML
}
	


function itemSelection( I ) {
	if ( blnChoiceMade == false) {
		var blnSelected = userAns[I-1];
		var g = eval("document.getElementById('img"+I+"').src");
		var name = "img"+I;
		var gfilename = getgname(g);
		var gpath = getgpath(g)
	//hide feedback layer	
		hidecont();
		// toggle highlight
		if (blnSelected == 1) {
			userAns[I-1] = 0;
			gfilename = gfilename.replace('_2','_0')
		} else  {
			userAns[I-1] = 1;
			gfilename = gfilename.replace('_0','_2')
		}
		document.getElementById(name).src = gpath+gfilename;
	}
}

function hidecont() {
	document.getElementById('done').style.visibility = 'visible';
	document.getElementById('feedback').style.visibility = 'hidden';
}


//============click done to judge the question =======
function judgeInteraction() {
	var blnSelected = 0;
var blnCorrect = 1;
var strTemp = "";	
triesUser += 1;
	for (var i=0; i<userAns.length; i++) {
		if (userAns[i]==1) blnSelected = 1;
		if (correctAns[i]!= userAns[i])  blnCorrect = 0;
	}
	if (blnSelected==0) { //not selected
		strTemp = arrPopup[0];
		triesUser = triesUser - 1;
	} else if (blnCorrect==1 ) { // correct 
		strTemp = arrPopup[1];
		finalstep();
		blnChoiceMade = true;

	} else { // incorrect		
		if (triesUser < triesLimit ) { //1st try incorrect
			strTemp = arrPopup[3];
		} else { //2nd try
			strTemp = arrPopup[2];
			finalstep();
			blnChoiceMade = true;
		}
		
	}
	document.getElementById('done').style.visibility = "hidden";
	document.getElementById('lyfdbk').innerHTML = strTemp;
	document.getElementById('lyfdbk').style.visibility = "visible";
	document.getElementById('feedback').style.visibility = "visible";
	

}

//====final step: highlight correct answer and lock them up ==
function finalstep() {	
	//if (reshow==1) {
		for (var i=1; i<correctAns.length+1; i++) {
			var g = eval("document.getElementById('img"+i+"').src");
			var name = "img"+i;			
			var gfilename = getgname(g);
			var gpath = getgpath(g)		
			if (correctAns[i-1]!=userAns[i-1]) {
				if(correctAns[i-1]==0) {
					gfilename = gfilename.replace('_2','_3')
				} else {
					gfilename = gfilename.replace('_0','_2')
				}
			}else if (correctAns[i-1]==0) {
				gfilename = gfilename.replace('_0','_3')
			}
			document.getElementById(name).src = gpath+gfilename;
		}
		MM_showHideLayers('fdbkContinue','','show')
	//}
}
