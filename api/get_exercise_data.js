'use strict'

const User = require('../schema/user_schema.js');
const ObjectId = require('mongodb').ObjectID;

module.exports = function(app){
	//get the data whenever someone goes to their profile
	app.route('/api/getdata')
	    .get((req, res) => {
			if(!req.user){
				res.status(401).send({
					message: 'You are not authorized to see this'
					});
				return;
			}
			
			User.findById(new ObjectID(req.user.id), {security_questions: 1}, {runValidators: true, lean: true},(err, doc) => {
				if(err) res.status(500).send({message: 'There was an error, please try again.'}); return;
				res.json(doc);
			});
			
			
		});
	   
	//updating an entry
	app.route('/api/updatedata')
	    .post((req, res) => {
			if(!req.user){
				res.status(401).send({
					message: 'You are not authorized to see this'
					});
				return;
			}
			
		    var data = req.body;
			
			data.duration = parseInt(data.duration);
			
			if(!data.description || !data.date || !data.duration){
				res.status(400).send({message: 'All fields must be filled out.'});
				return;
			}
			
			User.findOneAndUpdate({_id: new ObjectID(req.user.id)}, {$push {exercise_data: data}}, {runValidators: true, new: true},(err, doc) => {
				if(err) res.status(500).send({message: "There was an error and your entry wasn't added, please try again."});
				
				res.json({message: 'entry added'});				
			});
		})
		
    //deleting an entry
	    .delete((req, res) => {
			
			if(!req.user){
				res.status(401).send({
					message: 'You are not authorized to see this'
					});
				return;
			}
			
			if(!data.description || !data.date || !data.duration){
				res.status(400).send({message: 'All fields must be filled out.'});
				return;
			}
			
			var setObject = {$pull:
                    			{exercise_data: 
									{
										description: data.description,
										data: data.date,
										duration: data.duration
									}
								}
							};
			
			User.findOneAndUpdate({_id: ObjectID(req.user.id)}, setObject, {runValidators: true, new: true}, (err, doc) => {
				if(err) res.status(500).send({message: "There was an error and your entry wasn't deleted, please try again."}); return;
				
				res.json({message: 'entry deleted'});	
			});
		});
	
};