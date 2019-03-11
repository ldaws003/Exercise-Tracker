'use strict'

//checks for the existence of illegal words and characters and sends an error
//all functions  would return a boolean (true if yes, false if no);


function Checker(){
	
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
	
	const illegalChars = /[\W+]/;
	
	this.isUsernameOk = function(username){		
		//testing for the presence of illegal characters	
		return !(illegalChars.test(username));		
	};
	
	this.isPasswordOk = function(password){
		//testing for the presence of illegal characters
		return !(illegalChars.test(password));		
	};
	
	this.isSecurityQuestionsOk = function(security_questions){

		if(security_questions.length !== 2){
			return false;
		}
		
		let count = 0;
		
		for(let i = 0; i < security_questions.length; i++){
			
			if(SECURITY_QUESTIONS.indexOf(security_questions[i].question) !== -1){
				count++;
			}
			
			if( !(50 >= security_questions[i].answer.length > 0)){
				return false;
			}
			
		}
		
		if(count !== 2){
			return false;
		}
		
		return true;
	};
	
	this.isEntryOk = function(entryExercise){
		
		if(typeof entryExercise.description !== 'string'){
			return false;
		}
		
		if(!(0 < entryExercise.description.length <= 600)){
			return false;
		}
		
		if(!(entryExercise.date instanceof Date)){
			return false;
		}
		
		if(typeof entryExercise.duration !== 'number' && entryExercise.duration > 0){
			return false;	
		}
		
		return true;
		
	};
}

module.exports = Checker;