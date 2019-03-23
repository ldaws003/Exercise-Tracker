'use strict'

const ChartJs = require("chart.js");
const moment = require('moment');

function DataDisplay(){
	
	//pagination
	this.shown = function(user, pageNum, perPage){
		if(!perPage || perPage < 1) perPage = 20;
		var n = (pageNum - 1) * perPage;
		var m = n + perPage;
		return user.exercise_data.sort((a,b) => {
			return b.date - a.date;
		}).slice(n,m);
	};
	
	//maximum amount of pages 
	this.maxPages = function(user, perPage){
		return Math.floor(user.exercise_data.length/perPage);
	};
	
	//define the type data and options of the chart
	this.makeChart = function(user, category){
		
		//filters the data only returning the category of choice then sorts it by date
		var dataPoints = user.exercise_data.filter((ele) => ele.category === category).sort((a,b) => {
			return a.date - b.date;
		});

		
		
		var dataObj = {
			exerciseAmounts: [],
			dateOfExercise: []
		}
		
		{
			let sumDur, currentDate;
			
			function isSameDate(a, b){
				return (a.getFullYear() == b.getFullYear() &&
					    a.getMonth() == b.getMonth() &&
						a.getDate() == b.getDate());
			}
			
			
			var i = 0;		
			
			while(true){	
			
				currentDate = dataPoints[i].date;
				sumDur = 0;	
				
				while (isSameDate(currentDate, dataPoints[i].date)){
					
					sumDur += dataPoints[i].duration;		
					i++;
					
					if(!dataPoints[i]){
						break;
					}
				}
				
				dataObj.exerciseAmounts.push(Math.round(sumDur/60));
				dataObj.dateOfExercise.push(currentDate);
				
				if( i > dataPoints.length - 1 ){
					break;
				}
				
			}
			
		}
				
		dataObj.dateOfExercise = dataObj.dateOfExercise.map( ele => moment(ele).format('MM/DD/YYYY'));
		
		var chartColors = {
			"aerobic": {borderColors: "rgba(158, 158, 158, 1)", backgroundColor: "rgba(196, 196, 196, 0.91)"},
			"strength":{borderColors: "rgba(245, 0, 45, 1)", backgroundColor: "rgba(255, 36, 76, 0.9)"},
			"flexibility": {borderColors: "rgba(0, 16, 235, 1)", backgroundColor: "rgba(51, 65, 255, 0.85)"},
			"balance": {borderColors: "rgba(51, 255, 248, 1)", backgroundColor: "hsla(178, 100%, 70%, 0.84)"}
		};
		
		var type = 'line';
		
		var data = {
			labels: dataObj.dateOfExercise,
			datasets: [
				{
					label: category[0].toUpperCase() + category.slice(1).toLowerCase(),
					data: dataObj.exerciseAmounts,
					borderColors: chartColors[category].borderColors,
					backgroundColor: chartColors[category].backgroundColor,
					lineTension: 0
				}
			]
		};
		
		var options = {
			showLines: true,
			responsive: false
		};
		
		
		return {type: type, data: data, options: options};
		
	}
	
}

module.exports = DataDisplay;