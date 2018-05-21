"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sortAnswers = (a, b) => {
    return (a.votes === b.votes)
        ? b.updatedAt - a.updatedAt
        : b.votes - a.votes;
}

const AnswerSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    votes: {type: Number, default: 0}
})

//no Arrow Functions in methods
AnswerSchema.method("update", function (updates, callback) {
   Object.assign(this, updates, {updatedAt: new Date()});
   this.parent().save(callback);
});

//TODO: find out why ternary expression threw error ("votes is undefined")
AnswerSchema.method("vote", function (vote, callback) {
    console.log("i get here");
    if(vote === "up") {
        this.votes += 1;
    } else {
        this.votes -= 1;
    }
    this.parent().save(callback);
});

const QuestionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
});

// no Arrow Functions in pre-hooks
QuestionSchema.pre("save", function (next){
    this.answers.sort(sortAnswers);
    next();
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;








