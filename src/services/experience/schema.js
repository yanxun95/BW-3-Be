import mongoose from "mongoose"

const { Schema, model } = mongoose

const experienceSchema = new Schema(
    {
        role: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String, required: true },
        area: { type: String, required: true },
        username: { type: String, required: false },
        image: { type: String, default: 'https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg' },
    },
    { timestamps: true }
)

export default model("Experiences", experienceSchema)