const express = require('express');
const app = express();
const pieRepo = require('./modules/pieRepo');
const errorHelper = require('./helper/errorHelpers');
let cors = require('cors');

let router  = express.Router();

//middleware to support JSON data

app.use(express.json());

app.use(cors());


router.get('/', function(req, res, next) {
    pieRepo.get(function (data) {
    res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "All pies retrieved",
        "data": data
    });
}, function(err){
        next(err);
    
});
});

//query line http://localhost:5000/api/search?id=1&name=a

router.get('/search', function(req, res, next) {
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };
    pieRepo.search( searchObject, function (data) {    
    res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "All pie retrieved",
        "data": data
    });  
    }, function(err){
        next(err);    
});
});

router.get('/:id', function(req, res, next) {
    pieRepo.getById( req.params.id, function (data) {
    if (data) {    
    res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "Single pie retrieved",
        "data": data
    });
} 
    else {
        res.status(404).json({
            "status": 404,
            "statusText": "Not Found",
            "message": "The pie ' " + req.params.id + "'could not be found. ",
            "error" : {
                "code" : "NOT_FOUND",
                "message": "The pie '" + req.params.id + " ' could not be found. "
            }
        })
    }  
    }, function(err){
        next(err);    
});
});

router.post('/', function (req, res, next){
    pieRepo.insert(req.body, function(data){
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "New Pie added",
            "data": data
        });
    }, function (err){
        next(err);
    });
});

router.put('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function(data){
        if (data){
            pieRepo.update(req.body, req.params.id, function(data){
                res.status(200).json({
                    "status": 200,
                    "statusText": "Updateted",
                    "message": "Pie '" + req.params.id + " 'updated. ",
                    "data": data
                });

            });
        }

        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie ' " + req.params.id + "'could not be found. ",
                "error" : {
                    "code" : "NOT_FOUND",
                    "message": "The pie '" + req.params.id + " ' could not be found. "
                }
            })
        }  
        }, function(err){
            next(err);    
    });
 });


 router.delete('/:id', function(req, res, next){
     pieRepo.getById(req.params.id, function(data){
         if (data){
             pieRepo.delete(req.params.id, function(data) {
            res.status(200).json({
                "status": 200,
                "statusText": "deleted",
                "message": "Pie '" + req.params.id + " 'is deleted. ",
                "data": "Pie '" + req.params.id + " 'deleted."
            });
            });
         }
         else {
            res.status(204).json({
                "status": 204,
                "statusText": "Not Found",
                "message": "The pie ' " + req.params.id + "'could not be found. ",
                "error" : {
                    "code" : "NOT_FOUND",
                    "message": "The pie '" + req.params.id + " ' could not be found. "
                }
            })
        }  
        }, function(err){
            next(err);   
     });
 });

 router.patch('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function(data){
        if (data){
            pieRepo.update(req.body, req.params.id, function(data){
                res.status(200).json({
                    "status": 200,
                    "statusText": "patched",
                    "message": "Pie '" + req.params.id + " 'patched. ",
                    "data": data
                });

            });
        }

        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie ' " + req.params.id + "'could not be found. ",
                "error" : {
                    "code" : "NOT_FOUND",
                    "message": "The pie '" + req.params.id + " ' could not be found. "
                }
            })
        }  
        }, function(err){
            next(err);    
    });
 });
 
// route 
app.use ('/api/', router);

//configure exception logger to console
app.use(errorHelper.logErrorsToConsole);

//configure client error handler
app.use(errorHelper.clientErrorHandler);

//confi(gure exception logger to file
app.use(errorHelper.logErrorsToFile);

//configure catch-all exception middleware last
app.use(errorHelper.errorBuilder);

/*
function errorBuilder(err){
    return {
        "status": 500,
        "statusText": "Internal Server Error",
        "message": err.message,
        "error":{
            "errno": err.errno,
            "call": err.syscall,
            "code": "INTERNAL_SERVER_ERROR",
            "message": err.message
        }
    };
}

//middleware for error handling exception

//logger
app.use (function (err, req, res, next){
    console.log(errorBuilder(err));
    next(err);
});


app.use (function (err, req, res, next){
    res.status(500).json(errorBuilder(err))
});
*/

var server = app.listen(5000, function(){
    console.log("I am working Nodejs server using express on http://localhost:5000");
});

