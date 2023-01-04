'use strict'

const User = require('../schema/user_schema.js');
const ObjectID = require('mongodb').ObjectID;
const Checker = require('./checker.js');
const DataDisplay = require('./exercise_data_processor.js');
const dataDisplay = new DataDisplay();
const Contact = require('../schema/contact_schema.js');

const { query,body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var checker = new Checker();

module.exports = function(app){
	//get the data whenever someone goes to their journal
	app.route('/api/getdata')
	    .get(ensureAuthenticated, [
			//check to see if it is above 0
			query('page', 'This has to be a number').isNumeric()
		],(req, res) => {
			if(!req.user){
				res.status(401).send({
					message: 'You are not authorized to see this'
					});
				return;
			}
			
			User.findById(new ObjectID(req.user._id), {exercise_data: 1}, (err, doc) => {
				if(err){res.status(500).send({message: 'There was an error, please try again.'}); return;}

				doc.exercise_data = dataDisplay.shown(doc, req.query.page, 10);
				res.json({update: doc.exercise_data});
			});
			
			
		});
	
	app.route('/api/storecontact')
		.post((req, res) => {
			var contact = new Contact(req.body);
			contact.save(function(err){
				if(err) console.log(err);
					res.json({message: "Success!"});
			});
		})
	
	app.route('/api/getchart')
		.get(ensureAuthenticated, [
			query('category').trim().escape(),
			query('category', 'Invalid category.').isIn(checker.allowedCategories)
		],(req, res) => {
			
			User.findById(new ObjectID(req.user._id), (err, docs) => {
				if(err){ res.status(500).send({message: 'There was an error, please try again.'}); return;}
				
				var canChart = docs.exercise_data.filter((ele) => ele.category === req.query.category).length;
				var chartData;
				if(canChart){
					chartData = dataDisplay.makeChart(docs, req.query.category);
				} else {
					chartData = null;
				}
				
				
				res.json({update:chartData});
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
				
				res.json({update: data, max: dataDisplay.maxPages(doc, 10)});				
			});
		})
		
    //deleting an entry
	    .delete(ensureAuthenticated, [
			query('_id', 'This has to be a number').trim().escape()
		],(req, res) => {
			
			if(!req.user){
				res.status(401).send({
					message: 'You are not authorized to see this'
					});
				return;
			}
			
			console.log("this is the query", req.query);
			console.log("this is the body", req.body);
			
			var data = req.body._id || req.query._id;
			
			var setObject = {$pull:
                    			{exercise_data: 
									{
										_id: ObjectID(data._id)
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