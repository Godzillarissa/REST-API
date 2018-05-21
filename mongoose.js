"use strict";

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/sandbox");

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("connection error:", err);
})

db.once("open", () => {
    console.log("db connection successful");
    // All database communication goes here

    const Schema = mongoose.Schema;
    const AnimalSchema = new Schema({
       type:    {type: String, default: "goldfish"},
       size:    String,
       color:   {type: String, default: "golden"},
       mass:    {type: Number, default: 0.007},
       name:    {type: String, default: "angela"}
    });

    AnimalSchema.pre("save", function(next) {
        if (this.mass >= 100) {
            this.size = "big";
        } else if (this.mass >= 5 && this.mass < 100) {
            this.size = "medium";
        } else { // this.mass < 5
            this.size = "small"
        }
        next();
    });

    // static size-based find method
    AnimalSchema.statics.findSize = function(size, callback) {
        // this == Animal
        return this.find({size: size}, callback);
    }

    AnimalSchema.methods.findSameColor = function(callback) {
        // this == document
        return this.model("Animal").find({color: this.color}, callback);
    }

    const Animal = mongoose.model("Animal", AnimalSchema);

    const elephant = new Animal({
        type: "elephant",
        color: "grey",
        mass: 12000,
        name: "Lawrence"
    });

    const animal = Animal({
        // using defaults to create a goldfish
    });

    const whale = Animal({
        type: "whale",
        mass: 190500,
        name: "Fig"
    })

    const animalData = [
        {
            type: "mouse",
            color: "grey",
            mass: 0.035,
            name: "Marvin"
        },
        {
            type: "nutria",
            color: "brown",
            mass: 6.35,
            name: "Gretchen"
        },
        {
            type: "wolf",
            color: "grey",
            mass: 45,
            name: "Iris"
        },
        elephant,
        animal,
        whale
    ];

    // removing ALL documents
    Animal.remove({}, err => {
        if (err) console.error(err);
        Animal.create(animalData, err => {
            if (err) console.error("Save Failed", err);
            Animal.findOne({type: "elephant"}, (err, elephant) => {
                elephant.findSameColor((err, animals) => {
                    animals.forEach(animal => {
                        console.log(animal.name + " the " + animal.size + " " + animal.color + " " + animal.type);
                    });
                    db.close(() => {
                        console.log("db connection closed");
                    });
                });
            });
        });
    });
})