'use strict'

const moongose = require('mongoose');
const Schema = moongose.Schema;

const CommentSchema = new Schema({
    author: String,
    text: String
});

module.exports = moongose.model('Comment', CommentSchema);