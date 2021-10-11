import express from "express"
import createHttpError from "http-errors"
import ExperienceModel from "./schema.js"
import mongoose from "mongoose"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import q2m from "query-to-mongo"
import { pipeline } from "stream"
import { Parser } from "json2csv"
import fs from "fs"
import fastcsv from "fast-csv"

const experienceRouter = express.Router()

experienceRouter.post("/", async (req, res, next) => {
    try {
        const newExperience = { ...req.body, username: req.params.userName }
        const saveExperience = new ExperienceModel(newExperience)
        const { _id } = await saveExperience.save()

        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

experienceRouter.get("/", async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const experiences = await ExperienceModel
            .find(query.criteria, query.options.fields)
            .limit(query.options.limit || 6)
            .skip(query.options.skip)
            .sort(query.options.sort)

        const totalExperience = await ExperienceModel.countDocuments(query.criteria)
        const experiencesWithLinks = {
            links: query.links("/experience", totalExperience),
            totalExperience,
            pageTotal: Math.ceil(totalExperience / query.options.limit),
            experiences
        }
        res.send(experiencesWithLinks)

    } catch (error) {
        next(error)
    }
})

experienceRouter.get("/:expId", async (req, res, next) => {
    try {
        const experienceId = req.params.expId

        const experience = await ExperienceModel.findById(experienceId)

        if (experience) {
            res.send(experience)
        } else {
            next(createHttpError(404, `experience with id ${experienceId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

experienceRouter.put("/:expId", async (req, res, next) => {
    try {
        const experienceId = req.params.expId
        const modifiedexperience = await ExperienceModel.findByIdAndUpdate(experienceId, req.body, {
            new: true,
        })

        if (modifiedexperience) {
            res.send(modifiedexperience)
        } else {
            next(createHttpError(404, `experience with id ${experienceId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

experienceRouter.delete("/:expId", async (req, res, next) => {
    try {
        const experienceId = req.params.expId

        const deletedexperience = await ExperienceModel.findByIdAndDelete(experienceId)

        if (deletedexperience) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `experience with id ${experienceId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

experienceRouter.post("/:expId/picture", async (req, res, next) => {
    try {
        const experienceId = req.params.expId
        console.log(req.body.image)

        const modifiedexperience = await ExperienceModel.findByIdAndUpdate(experienceId, { $set: { image: req.body.image } }, {
            new: true,
        })

        if (modifiedexperience) {
            res.send(modifiedexperience)
        } else {
            next(createHttpError(404, `experience with id ${experienceId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

experienceRouter.get("/:userId/csv", async (req, res, next) => {
    try {
        const experiences = await ExperienceModel.find();
        const json2csvParser = new Parser({ fields: ['role', 'username', 'startDate', 'endDate', 'description', 'area', 'image'] });
        const csv = json2csvParser.parse(experiences);
        console.log(csv)
        fs.writeFile("experience.csv", csv, function (error) {
            if (error) throw error;
            console.log("Write to experience.csv successfully!");
        });
        res.send("test")
    } catch (error) {
        next(error)
    }
})


export default experienceRouter