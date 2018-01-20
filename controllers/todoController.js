const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//connecting to the database
mongoose.connect('mongodb://<username>:<password>@ds263367.mlab.com:63367/mytodo');

//creating schema
var todoSchema = new mongoose.Schema({
    item : String
});
//model
var Todo = mongoose.model('Todo', todoSchema);


var urlencodedParser = bodyParser.urlencoded({extended: false});

//demo data 
//{item:'do salah'}, {item:'do study'},{item:'recite quran'}
//var data = [];

module.exports = function(app){
    app.get('/todo',function(req, res){
        //get data from mongodb and pass it to the view
        Todo.find({}, function(err, data){
            if(err) throw err;
            res.render('todo', {todos : data});
        });
    });

    app.post('/todo',urlencodedParser,function(req, res){
        //get data from view and post it to mongodb
        var newTodo = Todo(req.body).save(function(err, data){
            if(err) throw err;
            res.json(data);
        }); 
    });

    app.delete('/todo/:item',function(req, res){
        //delete the requested item from mongodb
        Todo.find({item : req.params.item.replace(/\-/g," ")}).remove(function(err, data){
            if(err) throw err;
            res.json(data);
        });
    });
};