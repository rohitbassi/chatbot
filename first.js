var multiparty = require('multiparty');
var log4js = require('log4js')
var logger = log4js.getLogger('first');
const pool = require('./db');
var requestify = require('requestify');
var config = require('./config');
var request = require('request');
var apiai = require('apiai');
var sql = require('./sql.json');
var express = require('express');
var bodyParser = require('body-parser');
var routermessage = express.Router();
routermessage.use(bodyParser.json());

routermessage.route('/')
.post( function (req, res) {
    var content = req.body.content;
    console.log("_________________________");
      //var status = req.body.status;
    logger.debug("/first POST - Request: ", req.body);
    
    req.assert('content', 'content required').notEmpty();

    req.getValidationResult().then(function (result) {
        var errors = result.array();
        if (errors.length > 0) {
            logger.error("/first POST - Result: ", errors);
            res.status(200).json({
                'success': false,
                'message': 'Validation Failed',
                'err': errors
            })
            return;
        }
        else {        
            var addmessage = sql.message.addmessage;
            pool.query(addmessage, [content, 'NOW()'], function (err, result) {
                if (err) {
                    logger.error("/content POST - Error: ", err);
                    res.status(500).json({
                        'success': false,
                        'message': 'Could not add content',
                        'error': err
                    })
                    return;
                }
                else {
				var event =result.rows[0].content  ;
				var app = apiai("4967c94522a0484d8569f523f69295c1");				 
				var request = app.textRequest(event,{
				    sessionId : '12345'
				});
				 
				request.on('response', function(response) {
				    console.log(response);
				});
				 
				request.on('error', function(error) {
				    console.log(error);
				});
				request.end();
                    logger.debug("/content POST - Result: ", result.rows[0]);
                    res.status(200).json({
                        'success': true,
                        'message': "Successfully created new content",
                        'result': result.rows
                    })
                    return;
                }
            }); 

        }
    });
})



.get( function (req, res) {
   
    req.getValidationResult().then(function (result) {
        var errors = result.array();
        if (errors.length > 0) {
            logger.debug("/first  GET  - Result: ",errors);
            res.status(200).json({
                'success': false,
                'message': 'Validation Failed',
                'error': errors
            })
            return;
        }
    })

    var getmessage = sql.message.getmessage;
    pool.query(getmessage, function (err, result) {
        if (err) {
            logger.error("/first GET - getmessage query Error: " , err) ;
            res.status(500).json({
                'success': false,
                'message': 'Could not fetch messages',
                'error': err
            })
            return;
        }
        logger.debug("/first  GET  - Result: ",result.rows);
        res.status(200).json({
            'success': true,
            'message': 'messages Fetched',
            'result': result.rows
        })
        return;
    })
});

routermessage.route('/:id')
.delete( function (req, res) {
    var id = req.params.id;
    req.getValidationResult().then(function (result) {
        var errors = result.array();
        logger.debug("/first/:id DELETE -  Result: ", errors);
        if (errors.length > 0) {
            res.status(200).json({
                'success': false,
                'message': 'Validation Failed',
                'error': errors
            })
            return;
        }
        else {
            var deleteQuery = sql.message.deletemessage;
            pool.query(deleteQuery, [id], function (err, result) {
                if (err) {
                    logger.error("/first/:id DELETE - Error: ", err);
                    res.status(500).json({
                        'success': true,
                        'message': "Unable to Delete"

                    })
                    return;
                }
                if (result.rows.length>0) {
                    logger.debug("/first/:id DELETE -  Result: message Deleted");
                    res.status(200).json({
                        'success': true,
                        'message': "message Deleted",
                        'result' : result.rows[0]
                    })
                    return;
                }
                else {
                    logger.debug("/first/:id DELETE -  Result: Unable To Delete");
                    res.status(200).json({
                        'success': true,
                        'message': "Unable To Delete"
                    })
                    return;
                }
            })
        }

    })
});



module.exports = routermessage;
