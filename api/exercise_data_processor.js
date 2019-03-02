'use strict'


function DataDisplay(){
	
	this.shown = function(pageNum, perPage){
		if(!perPage || perPage < 1) perPage = 20;
		var n = (pageNum - 1) * perPage;
		var m = n + perPage;
		return a.slice(n,m)
	} 
}

module.export = DataDisplay;