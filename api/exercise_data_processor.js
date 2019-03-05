'use strict'

const ChartJs = require("chart.js");

function DataDisplay(){
	
	//pagination
	this.shown = function(user, pageNum, perPage){
		if(!perPage || perPage < 1) perPage = 20;
		var n = (pageNum - 1) * perPage;
		var m = n + perPage;
		return user.exercise_data.slice(n,m);
	};
	
	//maximum amount of pages 
	this.maxPages = function(user, perPage){
		return user.exercise_data.length/perPage;
	};
	
	//define the type data and options of the chart
	this.makeChart = function(user, category){
		
		//filters the data only returning the category of choice then sorts it by date
		var dataPoints = user.exercise_data.filter((ele) => ele.category === category).sort((a,b) => {
			/*var a = new Date(a.date);
			var b = new Date(b.date);*/
			return b - a;
		});
		
		var dataObj = {
			exerciseAmounts: [],
			dateOfExercise: []
		}
		
		{
			let sumDur, currentDate;
			
			currentDate = dataPoints[0].date;
			
			function isSameDate(a, b){
				return (a.getFullYear() == b.getFullYear() &&
					    a.getMonth() == b.getMonth() &&
						a.getDate() == b.getDate());
			}
			
			for(let i = 0; i < dataPoints.length; i++){
				//check if currentDate equals the date of the current obj
				if(isSameDate(currentDate, dataPoints[i].date)){
					//if so add that to the array
				} else {
					//if not push to sumDur and a copy of currentDate to their respective arrays
					//set sumDur to the duration of the current obj + and the currentDate to the date
				}
				
				
				

				//once you are at the last entry push the sumDur and the new
				
			}
			
		}
		
		
		
		//this would contain all of the labels by date
		
		
		
		var data = {
			labels: ,
			datasets: [
				{
					label: category[0].toUpperCase() + category.slice(1).toLowerCase(),
					data: dataPoints
				}
			]
		};
	
		
		var exerciseTypes = {
			"aerobic",
			"strength",
			"flexibility",
			"balance"
		};
		
		var chartColors = {
			"aerobic": {borderColors: "rgba(158, 158, 158, 1)", backgroundColor: "rgba(196, 196, 196, 0.91)"},
			"strength":{borderColors: , backgroundColor: },
			"flexibility": {borderColors: , backgroundColor: },
			"balance": {borderColors: , backgroundColor: }
		};
		
		var type = 'line';
		
		var data = {
			
		};
		
		var options = {
			showLines: true,
			responsive: false
		};
		
		
		return {type, data, options};
		
	}
	
}

module.export = DataDisplay;