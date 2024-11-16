// JavaScript Document for MA
	//var triesLimit = 2;
	//var triesUser = 0;
	var correctAns;
	var distracters = new Array();
	var arrPopup = new Array()
	var currentAns = 0;
	arrLetters = new Array(7);
	arrLetters[1] = "a";
	arrLetters[2] = "b";
	arrLetters[3] = "c";
	arrLetters[4] = "d";
	arrLetters[5] = "e";
	arrLetters[6] = "f";
	var nItems;
//alert(parent.iq)	
writenextq(parent.frames['controller'].qOrder[parent.frames['controller'].iq])	
	


function writenextq(n) {
	var q_stem_temp = parent.frames['controller'].assementData[n-1].childNodes[0] //firstChild.nodeValue;
	//alert(q_stem_temp.childNodes.length)
	var q_stem="";
	q_stem=q_stem_temp.childNodes[0].nodeValue;
	//if (n==23) alert(q_stem)
	//if (q_stem_temp.childNodes.length > 1) {
//		for (var i=0; i<q_stem_temp.childNodes.length; i++) {
//			
//			if (i >0 ) q_stem = q_stem + "<li>" +q_stem_temp.childNodes[i].childNodes[0].nodeValue + "</li>"
//			else q_stem = q_stem + q_stem_temp.childNodes[i].nodeValue + "<ol>"
//		}
//		q_stem = q_stem + "</ol>"
//	} else q_stem = q_stem_temp.childNodes[0].nodeValue
	//alert(q_stem)
	var distracters = new Array();
	var dist=parent.frames['controller'].assementData[n-1].childNodes[1] //nodeName  //childNodes[0]
	nItems = dist.childNodes.length
	
	for (var i=0; i<dist.childNodes.length; i++) {
		distracters[i] = dist.childNodes[i].childNodes[0].nodeValue;
	}
	//if (distracters[2]== "Wavelength ()") distracters[2] = "Wavelength (&lambda;)"
	
	var strHTML = ""
	for (var i=1; i<=distracters.length; i++) {
			//table cells
			
			strHTML = strHTML + "<tr><td width='8%'><a href='javascript:itemSelection("+ i +")'><img src='sysimages/mc_circle_"+arrLetters[i]+"_0.png' alt='Distracter "+arrLetters[i].toUpperCase()+"' id='img"+i+"' name='img"+i+"' width'38' height='38' border='0' /></a></td>"
			strHTML = strHTML + "<td class='distrText' width='92%'>"+ distracters[i-1] +"</td></tr>"	
		}
		strHTML = strHTML + "<tr><td colspan='2' height='10'></td></tr><tr>"
	//done button		
		strHTML = strHTML + "  <tr><td colspan='2' align='center'><span id='done'><a href='javascript:judgeInteraction(&quot;f&quot;)'  onMouseOver='MM_swapImage(&quot;imgdone&quot;,&quot;&quot;,&quot;sysimages/done_2.jpg&quot;,1)' onMouseOut='MM_swapImgRestore()'><img src='sysimages/done_0.jpg' name='imgdone' id='imgdone' alt='Done button' border='0' /></a></span></td></tr></table>"
		
		//feedback layer
		strHTML = strHTML + "<div id='feedback' style='position:relative; top:-42px; width:760px; visibility:hidden;'><div class='txtfdbk' id='lyfdbk'></div></div>"
		
	 strHTML = "<table width='670' border='0' cellspacing='3' cellpadding='3'>" + strHTML
		//document.getElementById('lydistracters').innerHTML = strHTML
	  document.getElementById("Content").innerHTML =  "<p>"+q_stem+"</p>"+"<div id='lydistracters' >"+strHTML+"</div>"
	  document.getElementById("PageT").innerHTML = "Question " + (parent.frames['controller'].iq+1) + " of " + (parent.frames['controller'].nQs );
	  
	  if (parent.frames['controller'].assementData[n-1].getElementsByTagName("Picture")[0]!=null) {
		  document.getElementById('mcImg').src = "sysimages/"+parent.frames['controller'].assementData[n-1].getElementsByTagName("Picture")[0].childNodes[0].nodeValue +".png";
		  document.getElementById("AudioIcon").style.visibility = "visible"
	  } else document.getElementById("AudioIcon").style.visibility = "hidden"

	checkSelected(n);
}


function checkSelected(cn) {
	var currentSelected = parent.frames['controller'].uA[cn-1];
	//document.getElementById("done").style.visibility = "hidden";
////the following code is for show viewed questions	
//	var cureentQ = parent.frames['controller'].iq;
	////alert(cureentQ)
	////parent.frames['controller'].uA[parent.frames['controller'].qOrder[parent.frames['controller'].iq]-1]
	//if (0 <= cureentQ && cureentQ < 25) showQ(1);
//	else if (25 <= cureentQ && cureentQ < 50) showQ(2);
//	else if (50 <= cureentQ && cureentQ < 75) showQ(3);
//	else showQ(4);
////end codes	
//	//alert(parent.frames['controller'].uA[cn-1])
	if (currentSelected != 0 && parent.frames['controller'].lastQ==false ) {
		itemSelection( currentSelected );
		document.getElementById("Next").style.visibility = "visible";
	} else if (parent.frames['controller'].lastQ==true) {
		document.getElementById("done").style.visibility = "hidden";
		document.getElementById("Next").style.visibility = "visible";
		changeDistr(currentSelected);
	} else document.getElementById("Next").style.visibility = "hidden";
	

}

function showQ(qslope) {
	var endq, startq;
	var strTemp = "";
	if (qslope==1) {startq = 0, endq = 25;}
	else if (qslope==2) {startq = 24, endq = 50}
	else if (qslope==3) {startq = 49, endq = 75}
	else {startq = 74, endq = 100}
	
	for (var i=startq; i<endq ; i++) {//parent.frames['controller'].nQs
	//if (parent.frames['controller'].iq > 43) alert(i+", "+parent.frames['controller'].uA[parent.frames['controller'].qOrder[i-1]])
//if (parent.frames['controller'].iq > 43) alert("i="+i+", qOrder="+parent.frames['controller'].qOrder[i]+", uA="+parent.frames['controller'].uA[parent.frames['controller'].qOrder[i]-1])
		if (parent.frames['controller'].uA[parent.frames['controller'].qOrder[i]-1] != 0 ) strTemp += "<a href='javascript:writenextq(parent.frames[&quot;controller&quot;].qOrder["+i+"])'>"+(i+1)+"</a> ";
		else strTemp += (i+1)+" ";
	}
	document.getElementById("qlink").innerHTML = "<p><a href='#'><< </a>"+strTemp+"<a href='#'> >></a></p>";
}

//=============the action for selecting the distracters ==========
function itemSelection( I ) {
	if (parent.frames['controller'].lastQ == false ) {
		changeDistr(I)
	}
}

function changeDistr(I) {
	currentAns = I;
	//document.getElementById('lyfdbk').innerHTML = "";
	//document.getElementById('lyfdbk').style.visibility = "hidden";
	//document.getElementById('done').style.visibility = "visible";
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
//============click done to judge the question =======
function judgeInteraction(direction) { 

parent.frames['controller'].uA[parent.frames['controller'].qOrder[parent.frames['controller'].iq]-1]=currentAns;
currentAns = 0;

var branch = parent.frames['controller'].assementData[parent.frames['controller'].qOrder[parent.frames['controller'].iq]-1].getElementsByTagName("Branch")[0].childNodes[0].nodeValue
//alert(branch)
var tempiq
//alert(parent.frames['controller'].iq)
	if (direction=="f") {
		if (branch != "No") branch = branch.substring(0,branch.indexOf(";"))
		parent.frames['controller'].iq += 1;
		
	} else {
		if (branch != "No") branch = branch.substring(branch.indexOf(";")+1);
		if (branch == "No") parent.frames['controller'].iq -= 1;
	}
	//branch = parent.frames['controller'].assementData[parent.frames['controller'].qOrder[parent.frames['controller'].iq]-1].getElementsByTagName("Branch")[0].childNodes[0].nodeValue;
	
//alert(parent.frames['controller'].iq)
//alert("After: "+parent.iq + ", " + parent.nQs)
	//if (parent.frames['controller'].iq > 30) alert(parent.frames['controller'].iq+", "+branch)
	if (branch == "No" ) {		
		if (parent.frames['controller'].iq < parent.frames['controller'].nQs ) {		
			tempiq=parent.frames['controller'].iq
			writenextq(parent.frames['controller'].qOrder[tempiq])
		} else finalstep()
	} else {
		//parent.iq += 1;
		goURL(branch+".html")
	}
}

//====final step: highlight correct answer and lock them up ==
function finalstep() {
	var totalC = 0; 
	var strHTML = "";
	var strTemp = "";
	var scorePct;
	var arrUnitN = new Array()
	var arrUnitC = new Array()
	//var arrUnitQ = new Array()
	for (var i=0; i<16; i++) {
		arrUnitN[i]=0;
		arrUnitC[i]=0;
		//arrUnitQ[i]="";
	}
	
	//alert(parent.frames['controller'].uA+ " and " + parent.frames['controller'].arrCorrectAns)
	for (var i=0; i<parent.frames['controller'].nQs; i++) {
		var unitNum = parent.frames['controller'].assementData[i].getElementsByTagName("Unit")[0].childNodes[0].nodeValue;
		
		arrUnitN[unitNum-1]=arrUnitN[unitNum-1]+1;
		//alert(unitNum + ", and "+ arrUnitN[unitNum-1])
		if (parent.frames['controller'].uA[i] == parent.frames['controller'].arrCorrectAns[i])	{
			totalC += 1;
			arrUnitC[unitNum-1]=arrUnitC[unitNum-1]+1
		} //else arrUnitQ[unitNum] += "<li>"+parent.frames['controller'].assementData[i].getElementsByTagName("QuestionStem")[0].childNodes[0].nodeValue+"</li>";
		
    }
	for (var i=1; i<arrUnitN.length; i++) {
		if (Math.round(arrUnitC[i]/arrUnitN[i]*100)<70) strTemp = strTemp + "<li>Unit "+ (i+1) +"</li>" //<ul>"+ arrUnitQ[i]+"</ul></li>"
	}
	if (strTemp != "" ) strTemp = "<ul>"+ strTemp +"</ul>" //"<div id='lytable' style='top:-20px; height:350px; padding-right:7px; scrollbar-arrow-color:#000000; scrollbar-base-color:#63570d; overflow: auto;'><ul>"+ strTemp +"</ul></div>";
	
	
	
	scorePct = Math.round (totalC/parent.frames['controller'].nQs * 100)
	
	strHTML = " You answered " + totalC + " questions correctly. Your score is " + scorePct + " %. <br /><br />"
	if (scorePct >= 70) strHTML = "Congratulations! " + strHTML
	
	if (strTemp != "" & scorePct >= 70 ) strHTML = strHTML + "Based on the questions you missed, you should consider reviewing the following Unit(s): " + strTemp;
	else if (strTemp == "" & scorePct >= 70) strHTML = strHTML
	else strHTML = strHTML + "Based on the questions you missed, you need to review the following Unit(s): " + strTemp;
	document.getElementById("Content").innerHTML =  "<p>" + strHTML + "</p>"
	document.getElementById("pageN").innerHTML = "Page " + (parent.frames['controller'].nQs +1) + " of " + (parent.frames['controller'].nQs +1)
	document.getElementById("PageT").innerHTML = "Scoring Report"
	document.getElementById("Prompt").innerHTML = "You have finished the exam!  Exit the test to return to the Med+Learn menu page."
	parent.frames['controller'].lastQ = true;
	parent.frames['controller'].iq -= 1; //for final back
	//document.getElementById("Back").style.visibility = "hidden"
	//document.getElementById("qlink").innerHTML = ""
}

//===getting the graphic name ==========
function getgname(gfilename) {
	arrTemp = new Array();
	arrTemp = gfilename.split("/");
	var strTemp = arrTemp[arrTemp.length-1];
	return strTemp.toLowerCase();
	
}

//===getting the graphic name ==========
function getgpath(gfilename) {
	arrTemp = new Array();
	arrTemp = gfilename.split("/");
	var strTemp = gfilename.substring(0,gfilename.indexOf(getgname(gfilename)));
	return strTemp;
	
}