'use strict'


//this would sanitize entries
function Sanitizer(){
	
	//santizing usernames
	this.username = function(data){
		data.username = data.username.trim();		
	}
	
	//sanitizing passwords
	this.password = function(data){
		data.password = data.password.trim();		
	};
	
	//sanitizing exercise data entries	
	this.entry = function(data){
		data.description = data.description.trim().toLowerCase();		
	};
}


module.exports = Sanitizer;