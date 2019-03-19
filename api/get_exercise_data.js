'use strict'

const User = require('../schema/user_schema.js');
const ObjectID = require('mongodb').ObjectID;
const Checker = require('./checker.js');
const DataDisplay = require('./exercise_data_processor.js');
const dataDisplay = new DataDisplay();

const { query,body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var checker = new Checker();

module.exports = function(app){
	//get the data whenever someone goes to their journal
	app.route('/api/getdata')
	    .get(ensureAuthenticated, [
			sanitizeBody('page').trim().escape(),
			body('page', 'This has to be a number').isNumeric()
		],(req, res) => {
			if(!req.user){
				res.status(401).send({
					message: 'You are not authorized to see this'
					});
				return;
			}
				
			User.findById(new ObjectID(req.user._id), {security_questions: 1}, {runValidators: true, lean: true},(err, doc) => {
				if(err) res.status(500).send({message: 'There was an error, please try again.'}); return;
				
				doc.exercise_data = dataDisplay.shown(doc, req.body.page, 10);
				res.json(doc.exercise_data);
			});
			
			
		});
	
	app.route('/api/getchart')
		.get(ensureAuthenticated, [
			query('category').trim().escape(),
			query('category', 'Invalid category.').isIn(checker.allowedCategories)
		],(req, res) => {
			
			User.findById(new ObjectID(req.user._id), (err, docs) => {
				if(err){ res.status(500).send({message: 'There was an error, please try again.'}); return;}
				
				var chartData = dataDisplay.makeChart(docs, req.query.category);
				res.json(chartData);
			});
		});

	   
	//updating an entry
	app.route('/api/updatedata')
	    .put(ensureAuthenticated, [
			sanitizeBody('description').trim().escape(),
			sanitizeBody('category').trim().escape(),
			body('category', 'Invalid category.').isIn(checker.allowedCategories),
			body('description').isLength({min: 4}).withMessage('Description is too short'),
			body('duration', 'This has to be a number').isNumeric(),
			body('date', 'This has to be a date').isISO8601()			
		],
		(req, res) => {
			if(!req.user){
				res.status(401).send({
					message: 'You are not authorized to update this.'
					});
				return;
			}
			
		    var data = req.body;
			
			User.findOneAndUpdate({_id: new ObjectID(req.user._id)}, {$push: {exercise_data: data}}, {new: true},(err, doc) => {
				if(err){res.status(500).send({message: "There was an error and your entry wasn't added, please try again."});}
				
				res.json({msg: 'entry added'});				
			});
		})
		
    //deleting an entry
	    .delete(ensureAuthenticated, [
			sanitizeBody('description').trim().escape(),
			sanitizeBody('category').trim().escape(),
			sanitizeBody('duration').trim().escape().toInt(),
			body('category', 'Invalid category.').isIn(checker.allowedCategories),
			body('description').isLength({min: 4}).withMessage('Description is too short'),
			body('duration', 'This has to be a number').isNumeric(),
			body('date', 'This has to be a date').isISO8601()		
		],(req, res) => {
			
			if(!req.user){
				res.status(401).send({
					message: 'You are not authorized to see this'
					});
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
			
			User.findOneAndUpdate({_id: ObjectID(req.user._id)}, setObject, {new: true}, (err, doc) => {
				if(err){res.status(500).send({message: "There was an error and your entry wasn't deleted, please try again."}); return;}
				
				res.json({msg: 'entry deleted'});	
			});
		});
		
	function ensureAuthenticated(req, res, next){

		if(req.isAuthenticated()){
			return next();
		}
		res.redirect('/');
	};
	
};