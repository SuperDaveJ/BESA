// JavaScript Document
var selected = new Array();
	var blnChoiceMade = false;
	var distracters = new Array();
	var arrPopup = new Array()
	var currentAns = 0;
arrLetters = new Array(7);
	arrLetters[0] = "a";
	arrLetters[1] = "b";
	arrLetters[2] = "c";
	arrLetters[3] = "d";
	arrLetters[4] = "e";
	arrLetters[5] = "f";
	


function writenextq(n) {

var q_stem_temp = parent.assementData[n-1].getElementsByTagName("QuestionStem")[0] 
	q_stem=q_stem_temp.childNodes[0].nodeValue;
	

var distracters = new Array();
var dist=parent.assementData[n-1].getElementsByTagName("Option") 

	nItems = parent.assementData[n-1].getElementsByTagName("Option").length
	
	for (var i=0; i<nItems; i++) {
		distracters[i] = dist[i].childNodes[0].nodeValue;
		selected[i]= 0;
	}
	
	var strHTML = ""
		for (var i=0; i<distracters.length; i++) {
			//table cells
			
			strHTML = strHTML + "<tr><td width='8%'><a href='javascript:itemSelection("+ i +")'><img src='sysimages/mc_circle_"+arrLetters[i]+"_0.png' alt='Distracter "+arrLetters[i].toUpperCase()+"' id='img"+i+"' name='img"+i+"' width'38' height='38' border='0' /></a></td>"
			strHTML = strHTML + "<td class='distrText' width='92%'>"+ distracters[i] +"</td></tr>"	
		}

	strHTML = strHTML + "<tr><td colspan='2' height='10'></td></tr><tr>"
	//done button		
		strHTML = "<table width='670' border='0' cellspacing='3' cellpadding='3'>"+ strHTML + "  <tr><td colspan='2' align='center'><span id='done'><a href=\"javascript:judgeInteraction('f')\"><img src=\"sysimages/done_0.jpg\" onmouseover=\"this.src='sysimages/done_2.jpg'\" onmouseout=\"this.src='sysimages/done_0.jpg'\" name='imgdone' id='imgdone' alt='Done button' border='0' /></a></span></td></tr></table>"
		
		//feedback layer
	strHTML = strHTML + "<div id='feedback' style='position:relative; top:-42px; width:760px; visibility:hidden;'><div class='txtfdbk' id='lyfdbk'></div></div>"
		
	document.getElementById("Content").innerHTML =  "<p>"+q_stem+"</p>"+"<div id='lydistracters' >"+strHTML+"</div>"
	document.getElementById("PageT").innerHTML = "Question " + (parent.iq+1) + " of " + (parent.nQs );
	checkSelected(n); 
	
}

function checkSelected(n) {
	var currentSelected = parent.uA[n];

	if (currentSelected != 0 ) {
		itemSelection( currentSelected );
		document.getElementById("Next").style.visibility = "visible";
	} else document.getElementById("Next").style.visibility = "hidden";
}

//=============the action for selecting the distracters ==========
function itemSelection( I ) {
	if (blnChoiceMade==false ) {
	currentAns = (I+1);
		for (var j=0; j<nItems; j++) {
			eval("document.getElementById('img"+j+"')").src = "sysimages/mc_circle_"+arrLetters[j]+"_0.png"
			if (j==I) eval("document.getElementById('img"+j+"')").src = "sysimages/mc_circle_"+arrLetters[j]+"_2.png"

   		}
	}
}

//============click done to judge the question =======
function judgeInteraction(direction) { 
	parent.uA[parent.qOrder[parent.iq]]=currentAns;
	//alert(currentAns)
	currentAns = 0;
//alert(parent.iq)
var branch = parent.assementData[parent.qOrder[parent.iq]-1].getElementsByTagName("Branch")[0].childNodes[0].nodeValue
//alert(branch)
var tempiq
//alert(parent.iq)
	if (direction=="f") {
		if (branch != "No") branch = branch.substring(0,branch.indexOf(";"))
		 	parent.iq += 1;
			if (parent.iq == 100) {			
				if (confirm("This is the last question. Select Cancel if you would like to go back and check your answers. Select OK to continue to the reporting page.")==true) parent.iq += 1;
				else parent.iq -= 1;
		}
//		
	} else {
		if (branch != "No") branch = branch.substring(branch.indexOf(";")+1);
		if (branch == "No") parent.iq -= 1;
//
	}

//alert(branch)
	if (branch == "No" ) {		
		if (parent.iq < parent.nQs ) {		
			tempiq=parent.iq
			writenextq(parent.qOrder[tempiq])
		} else finalstep()
	} else {
		//parent.iq += 1;
		goURL(branch+".html")
	}

}