'use strict'

const User = require('../schema/user_schema.js');
const ObjectID = require('mongodb').ObjectID;


module.exports = function(app){
	
	app.route('/api/delete_account/')
	   .delete((req, res) => {
		   
		   if(!req.user){
			   res.status(404).send({message: "You need to be logged in to perform this action."});
			   return;
		   }
		   
		   if(!bcrypt.compare(req.user.password, req.body.password) && !req.body.confirm){
			   res.status(400).send({message: "Invalid request. Input must be the same as the password, and you need to confirm deleting your account."});
               return; 
		   }
		   
		   User.findByIdAndDelete(new ObjectID(req.user.id), (err, doc) => {
			   if(err) res.status(500).send({message: 'There was an error, please try again.'}); return;
			   
			   res.json({message: 'successful deletion'});
		   });
		   
	   });
}