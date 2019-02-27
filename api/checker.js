'use strict'

//checks for the existence of illegal words and characters and sends an error
//all functions  would return a boolean (true if yes, false if no);


const SECURITY_QUESTIONS = [
	"What is your mother's maiden name?",
	"What was the name of your elementary school?",
	"What was the name of your first pet?",
	"What is your favorite book?",
	"What was the first company that you worked for?",
	"Where did you go to high school/college?",
	"What is your favorite food?",
	"What city were you born in?"
];


function Checke(){
	
	const illegalChars = /[\W+]/;
	
	this.isSecurityQuestionsOk = function(data){
		if(data.security_questions.length !== 2){
			return false;
		}
		
		let count = 0;
		
		for(int i = 0; i < data.security_questions.length; i++){
			
			if(SECURITY_QUESTIONS.indexOf(data.security_questions[i]) !== -1){
				count++;
			}
		}
		
		if(count !== 2){
			return false;
		}
		
		return true;
	}
	
	this.isPasswordOk = function(data){
		
		//checking to see if it is a string
		if(typeof data.password !== 'string'){
			return false;
		}
		
		//checking for illegal characters
		if(illegalChars.test(data.password)){
			return false;
		}
		
		return true;
		
	};
	
	this.isUsernameOk = function(data){
		
		//checking to see if it is a string
		if(typeof data.username !== 'string'){
			return false;
		}
		
		//checking for illegal characters
		if(illegalChars.test(data.username)){
			return false;
		}
		
		return true;
		
	};
	
	this.isEntryOk = function(data){
		
		if(typeof data.description !== 'string'){
			return false;
		}
		
		if(!(data.date instanceof Date)){
			return false;
		}
		
		if(typeof data.duration !== 'number' && data.duration > 0){
			return false;	
		}
		
		return true;
		
	};
}