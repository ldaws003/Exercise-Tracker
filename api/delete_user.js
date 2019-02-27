'use strict'

const User = require('../schema/user_schema.js');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');


module.exports = function(app){
	
	app.route('/api/delete_account/')
	   .delete((req, res) => {
		   
		   if(!req.user){
			   res.status(404).send({message: "You need to be logged in to perform this action."});
			   return;
		   }
		   
		   if(!bcrypt.compareSync(req.user.password, req.body.password) && !req.body.confirm){
			   res.status(400).send({message: "Invalid request. Input must be the same as the password, and you need to confirm deleting your account."});
               return; 
		   }
		   
		   User.findByIdAndDelete(new ObjectID(req.user.id), (err, doc) => {
			   if(err) res.status(500).send({message: 'There was an error, please try again.'}); return;
			   
			   res.json({message: 'successful deletion'});
		   });
		   
	   });
	   
	app.route('/api/change_password')
	   .put((req, res) => {
		   
		   const saltRounds = 12;
		   
		   if(!req.user){
			   res.status(404).send({message: "You need to be logged in to perform this action."});
			   return;
		   }
		   
		   if(!bcrypt.compareSync(req.user.password, req.body.password) && !req.body.confirm){
			   res.status(400).send({message: "Invalid request. Input must be the same as the password, and you need to confirm deleting your account."});
               return; 
		   }
		   
		   if(!bcrypt.compareSync(req.user.password, req.body.new_password)){
			   res.status(400).send({message: "You must choose a password different from your previous."});
               return; 
		   }
		   
		   var hash = bcrypt.hashSync(req.body.password, saltRounds);
		   
		   User.findByIdAndUpdate(new ObjectID(req.user.id), {$set {password: hash}});
	   });
	   
	app.route('/api/forgotten_password')
	   .put((req, res) => {
		   
		   const saltRounds = 12;
		   
		   if(!req.user){
			   res.status(404).send({message: "You need to be logged in to perform this action."});
			   return;
		   }
		   
		   if(req.body.username !== req.user.username && !checkSecurity){
			   res.status(404).send({message: "Input username or answers to security questions aren't correct."});
			   return;
		   }
		   
		   var hash = bcrypt.hashSync(req.body.password, saltRounds);
		   
		   User.findByIdAndUpdate(new ObjectID(req.user.id), {$set {password: hash}});
	   });
}