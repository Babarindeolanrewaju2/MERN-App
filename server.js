'use strict'

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const Comment = require('./model/comments');

mongoose.Promise = global.Promise;

const app = express();
const router = express.Router();

const port = process.env.API_PORT || 3001;

const mongoDB = 'mongodb://admin:mern12345@ds042687.mlab.com:42687/comments_database';
mongoose.connect(mongoDB, {useMongoClient: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  
    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
}); 

router.get('/', (req, res) => {
    res.json({message: 'API Initialized'});
});

//adding the /comments route to our /api router
router.route('/comments')
    //retrieve all comments from the database
    .get( (req, res) => {
        //looks at our Comment Schema
        Comment.find( (err, comments) => {
            if (err) res.send(err);
            res.json(comments)
        });
    })
    .post( (req, res) => {
        const comment = new Comment();
        comment.author = req.body.author;
        comment.text = req.body.text;

        comment.save( err => {
            if (err) res.send(err);
            res.json({ message: 'Comment successfully added!'});
        });
    });

app.use('/api', router);

app.listen(port, () => {
    console.log(`api running on port ${port}`);
});