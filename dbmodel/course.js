const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let courseSchema = new mongoose.Schema({
     courses:{
        type:String
    },
    identifier:{
        type:String
    },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
})

const course = mongoose.model("course",courseSchema)
 
module.exports = course

//the identifier will be updated with the user _id 
// conditional statement top check if  userid and identifier match fetch ffrom the pair match for a particular user