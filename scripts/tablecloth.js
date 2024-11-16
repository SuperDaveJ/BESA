/* 
	Tablecloth 
	written by Alen Grakalic, provided by Css Globe (cssglobe.com)
	please visit http://cssglobe.com/lab/tablecloth/
*/

/********************************************************
* Some functions are added and some original functions are 
* changed to meet click grid interaction's requirements.
*
* Modified by Xihai Zhang
* June, 2008
*********************************************************/
var selectable = true;
this.tablecloth = function(){
	// CONFIG 
	//var highlightCell = true;
	// if set to true then mouseover a table cell will highlight entire column (except sibling headings)
	var highlightCols = true;
	
	// if set to true then mouseover a table cell will highlight entire row	(except sibling headings)
	var highlightRows = true;	
	
	// if set to true then click on a table sell will select row or column based on config
	
	
	// this function is called when 
	// add your own code if you want to add action 
	// function receives object that has been clicked 
	this.clickAction = function(obj,row,col) {
		//This function is modified by XZ
		//alert(selectable)
		if (triesUser < triesLimit ) {
			document.getElementById("lyfdbk").style.visibility = "hidden";
			document.getElementById("done").style.visibility = "visible";
			arrUserAns[row-1] = col;
		}
	};


	
	// END CONFIG (do not edit below this line)
	
	
	var tableover = false;
	this.start = function(){
		var tables = document.getElementsByTagName("table");
		for (var i=0;i<tables.length;i++){
			tables[i].onmouseover = function(){tableover = true};
			tables[i].onmouseout = function(){tableover = false};			
			rows(tables[i]);
		};
	};
	
	this.rows = function(table){
		var css = "";
		var tr = table.getElementsByTagName("tr");
		for (var i=0;i<tr.length;i++){
			css = "" //(css == "odd") ? "even" : "odd";
			tr[i].className = css;
			var arr = new Array();
			for(var j=0;j<tr[i].childNodes.length;j++){				
				if(tr[i].childNodes[j].nodeType == 1) arr.push(tr[i].childNodes[j]);
			};		
			for (var j=0;j<arr.length;j++){				
				arr[j].row = i;
				arr[j].col = j;
				//commented out by XZ to make empty cell work
				//if(arr[j].innerHTML == "&nbsp;" || arr[j].innerHTML == "") arr[j].className += " empty";					
				arr[j].css = arr[j].className;
				arr[j].onmouseover = function(){
					over(table,this,this.row,this.col);
				};
				arr[j].onmouseout = function(){
					out(table,this,this.row,this.col);
				};
				arr[j].onmousedown = function(){
					down(table,this,this.row,this.col);
				};
				arr[j].onmouseup = function(){
					up(table,this,this.row,this.col);
				};				
				arr[j].onclick = function(){
					click(table,this,this.row,this.col);
				};								
			};
		};
	};
	
	// appyling mouseover state for objects (th or td)
	this.over = function(table,obj,row,col){
		//if (!highlightCols && !highlightRows ) obj.className = obj.css + " over"; 
		if (!highlightCell ) obj.className = obj.css + " over"; 
		//if(check1(obj,col)){
		//if condition above is replaced by next line
		if(check1(obj,col) && (triesUser < triesLimit) ) {
			//if(highlightCols) highlightCol(table,obj,col);
			//if(highlightRows) highlightRow(table,obj,row);	
			highlightCell(table,obj,row,col);
		};
	};
	// appyling mouseout state for objects (th or td)	
	this.out = function(table,obj,row,col){
		//if (!highlightCols && !highlightRows) obj.className = obj.css; 
		if (!highlightCell) obj.className = obj.css; 
		//Add the if condition below
		if (triesUser < triesLimit) {
			//unhighlightCol(table,col);
			//unhighlightRow(table,row);
			//alert(!highlightCols)
			if (highlightCell) unhighlightCell(table,row,col);
			//unselectRow(table,row);
		}
	};
	// appyling mousedown state for objects (th or td)	
	this.down = function(table,obj,row,col){
		//Add the if condition below
		if (triesUser < triesLimit) {
			obj.className = obj.css + " down";
		}
	};
	// appyling mouseup state for objects (th or td)	
	this.up = function(table,obj,row,col){
		//Add the if condition below
		if (triesUser < triesLimit) {
			obj.className = obj.css + " over";
		}
	};	
	// onclick event for objects (th or td)	
	/*
	this.click = function(table,obj,row,col){
		if(check1){
			if(selectable) {
				unselect(table);	
				if(highlightCols) highlightCol(table,obj,col,true);
				if(highlightRows) highlightRow(table,obj,row,true);
				document.onclick = unselectAll;
			}
		};
		clickAction(obj); 		
	};		
	*/
	
	//The click function above is re-written as below by XZ
	this.click = function(table,obj,row,col){
		//
		if (selectable != true) {
			for (var i=0; i<nItems; i++) arrUserAns[i] = 0;
			tables = document.getElementsByTagName("table");
			for (var i=0;i<tables.length;i++){
				unselect(tables[i])
			}
			selectable =  true		
		}
		if(check1){
			if (triesUser < triesLimit ) {
				unselectRow(table,row);
				highlightCell(table,obj,row,col,false);
			}
		};
		clickAction(obj,row,col); 		
	};		

	//This function is added by XZ
	this.highlightCell = function(table,active,row,col,sel){
		//alert(active)
		var css = (typeof(sel) != "undefined" ) ? "selected" : "over";
		var tr = table.getElementsByTagName("tr")[row];		
		var arr = new Array();
		for(j=0;j<tr.childNodes.length;j++){				
			if(tr.childNodes[j].nodeType == 1) arr.push(tr.childNodes[j]);
		};							
		var obj = arr[col];
		if (triesUser < triesLimit) {
			if (arrUserAns[row-1]!=col) obj.className = obj.css + " "+css;
			//if (check2(active,obj) && check3(obj)) obj.className = obj.css + " " + css; 
		} else {
			if (check2(active,obj) && check3(obj)) obj.className = obj.css + " correct";
			//if (arrUserAns[row-1]!=row-1 || arrUserAns[col-1]!=col-1) obj.className = obj.css + " " + correct;
		}
		
	};

	//This function is added by XZ
	this.unhighlightCell = function(table,row,col){
		var tr = table.getElementsByTagName("tr")[row];		
		var arr = new Array();
		for(j=0;j<tr.childNodes.length;j++){				
			if(tr.childNodes[j].nodeType == 1) arr.push(tr.childNodes[j]);
			//alert(j)
		};							
		var obj = arr[col];
		//obj.className = obj.css; 
		//alert(arrUserAns[row-1]+", "+arrUserAns[col-1])
		if (arrUserAns[row-1]!=col) obj.className = obj.css; 		
	};

	this.highlightCol = function(table,active,col,sel){
		var css = (typeof(sel) != "undefined") ? "selected" : "over";
		var tr = table.getElementsByTagName("tr");
		for (var i=0;i<tr.length;i++){	
			var arr = new Array();
			for(j=0;j<tr[i].childNodes.length;j++){				
				if(tr[i].childNodes[j].nodeType == 1) arr.push(tr[i].childNodes[j]);
			};							
			var obj = arr[col];
			if (check2(active,obj) && check3(obj)) obj.className = obj.css + " " + css; 	
			 	
		};
	};
	this.unhighlightCol = function(table,col){
		var tr = table.getElementsByTagName("tr");
		for (var i=0;i<tr.length;i++){
			var arr = new Array();
			for(j=0;j<tr[i].childNodes.length;j++){				
				if(tr[i].childNodes[j].nodeType == 1) arr.push(tr[i].childNodes[j])
			};				
			var obj = arr[col];
			if(check3(obj)) obj.className = obj.css; 
		};
	};	
	this.highlightRow = function(table,active,row,sel){
		var css = (typeof(sel) != "undefined") ? "selected" : "over";
		var tr = table.getElementsByTagName("tr")[row];		
		for (var i=0;i<tr.childNodes.length;i++){		
			var obj = tr.childNodes[i];
			if (check2(active,obj) && check3(obj)) obj.className = obj.css + " " + css; 		
		};
	};
	this.unhighlightRow = function(table,row){
		var tr = table.getElementsByTagName("tr")[row];		
		for (var i=0;i<tr.childNodes.length;i++){
			var obj = tr.childNodes[i];			
			if(check3(obj)) obj.className = obj.css; 			
		};
	};

	//This function is added by XZ
	this.unselectRow = function(table,row){
		var tr = table.getElementsByTagName("tr")[row];		
		for (var i=0;i<tr.childNodes.length;i++){
			var obj = tr.childNodes[i];			
			obj.className = obj.className.replace("selected","");
			obj.className = obj.className.replace("wrong","");
		};
	};
	
	this.showCorrect = function(table) {
		unselectAll();
		var obj = table.getElementsByTagName("tr")[1];	//need this to pass it in to highlightCell function
		for (var i=0; i<nItems; i++) highlightCell(table,obj,i+1,arrCorrectAns[i],true);
	}
//added by wenqing for scenario question	
	this.showUser = function(table) {
		//unselectAll();
		var obj = table.getElementsByTagName("tr")[1];	//need this to pass it in to highlightCell function
		for(var j=0;j<arrUserAns.length;j++) {
			var tr = table.getElementsByTagName("tr")[j+1];		
			for (var i=1;i<=tr.childNodes.length;i++){
				var obj = tr.childNodes[i];	
				if (arrUserAns[j]==i && arrUserAns[j]!=arrCorrectAns[j]) obj.className = obj.className.replace("selected","wrong");
	
			}

		}
	}
//end this function
	this.unselect = function(table){
		tr = table.getElementsByTagName("tr")
		for (var i=0;i<tr.length;i++){
			for (var j=0;j<tr[i].childNodes.length;j++){
				var obj = tr[i].childNodes[j];	
				if(obj.className) {
					obj.className = obj.className.replace("selected","");
					obj.className = obj.className.replace("wrong","");
					obj.className = obj.className.replace("over","");
				}
			};
		};
	};
	this.unselectAll = function(){
		if(!tableover){
			tables = document.getElementsByTagName("table");
			for (var i=0;i<tables.length;i++){
				unselect(tables[i])
			};		
		};
	};	
	this.check1 = function(obj,col){
		return (!(col == 0 && obj.className.indexOf("empty") != -1));
	}
	this.check2 = function(active,obj){
		return (!(active.tagName == "TH" && obj.tagName == "TH")); 
	};
	this.check3 = function(obj){
		return (obj.className) ? (obj.className.indexOf("selected") == -1) : true; 
	};	
	
	start();
	
};

//***** The function below is not original ***********
function judgeInteraction() {
	triesUser += 1;
	var nBlank = 0;
	var nCorrect = 0
	var table = document.getElementsByTagName("table")[0];
	selectable = false
	
	for (var i=0; i<nItems; i++) {
		if (arrUserAns[i] == 0) nBlank += 1;
		if (arrUserAns[i] == arrCorrectAns[i]) nCorrect += 1;
	}
	if (nBlank == nItems) {
		//********** No selection ************
		triesUser -= 1;
		document.getElementById("lyfdbk").innerHTML = fdbkNoSelection;
	} else if (nCorrect == nItems) {
		//********** Correct ************
		triesUser = triesLimit;
		showCorrect(table);
		document.getElementById("lyfdbk").innerHTML = fdbkCorrect;
	} else {
		if (triesUser < triesLimit) {
			////********** First Incorrect ************
//			for (var i=0; i<nItems; i++) {
//				if (blnKeepCorrect) {
//					if (arrUserAns[i] != arrCorrectAns[i]) incorrectCell(table, i+1, arrUserAns[i]);
//				} else {
//					unhighlightCell(table, i+1, arrUserAns[i]);
//				}
//			}
			showUser(table);
			document.getElementById("lyfdbk").innerHTML = fdbkIncorrectFirstTry;
		} else {
			//********** Final Incorrect ************
			showCorrect(table);
			document.getElementById("lyfdbk").innerHTML = fdbkIncorrectFinal;
		}
	}

	document.getElementById("done").style.visibility = "hidden";
	document.getElementById("lyfdbk").style.visibility = "visible";
	
}

//-->


/* script initiates on page load. */
window.onload = tablecloth;
