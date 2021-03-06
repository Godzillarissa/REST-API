"use strict";

const express = require("express");
const app = express();
const routes = require("./routes");

const jsonParser = require("body-parser").json;
const logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/qa");

const db = mongoose.connection;
db.on("error", (err) => {
    console.error("connection error:", err);
})

db.once("open", () => {
    console.log("db connection successful");
});

app.use((req, res, next) => {
    // * means it's okay to make requests to this API from anywhere
    res.header("Access-Control-Allow-Origin", "*");
    // TODO: find out what this means:
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");

    if(req.method === "OPTION") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
        return res.status(200).json({});
    }

    next();
})

app.use("/questions", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
})

// Error Handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Express server is listening on port", port)
});

















