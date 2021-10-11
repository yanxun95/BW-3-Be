import mongoose from "mongoose";

const {Schema, model} = mongoose;

const profileSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    bio: {type: String, required: true},
    title: {type: String, required: true},
    area: {type: String, required: true},
    image: { type: String, default: 'https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg' },
    username: {type: String, required: true},
   // experience: [{ type: Schema.Types.ObjectId, ref: "Experience" }],
  
},
{
    timestamps: true
})

export default model("profiles", profileSchema)