'use strict'


//this would sanitize entries
function Sanitizer(){
	
	//santizing usernames
	this.sanitizeUsername = function(data){
		data.username = data.username.trim();		
	}
	
	//sanitizing passwords
	this.sanitizePassword = function(data){
		data.password = data.password.trim();		
	};
	
	//sanitizing exercise data entries	
	this.sanitizeEntry = function(data){
		data.description = data.description.trim().toLowerCase();		
	};
}


module.exports = Sanitizer;