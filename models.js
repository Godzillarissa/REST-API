"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sortAnwers = (a, b) => {
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

AnswerSchema.method("update", (updates, callback) => {
   Object.assign(this, updates, {updatedAt: new Date()});
   this.parent().save(callback);
});

AnswerSchema.method("vote", (vote, callback) => {
    this.votes = (vote === "up")
        ? votes + 1
        : votes - 1;
    this.parent().save(callback);
});

const QuestionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
});

QuestionSchema.pre("save", next => {
    this.answers.sort(sortAnwers);
    next();
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;








