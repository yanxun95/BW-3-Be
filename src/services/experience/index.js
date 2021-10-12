import express from "express"
import createHttpError from "http-errors"
import ExperienceModel from "./schema.js"
import mongoose from "mongoose"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import q2m from "query-to-mongo"
import { pipeline } from "stream"
import ProfileModel from "../profiles/schema.js"
import json2csv from "json2csv"
import { Readable } from 'stream';

const experienceRouter = express.Router()

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "experiencePicture",
    },
})

experienceRouter.post("/:userId", async (req, res, next) => {
    try {
        const saveExperience = new ExperienceModel(req.body)
        const { _id } = await saveExperience.save()

        const userId = req.params.userId
        const modifiedProfile = await ProfileModel.findByIdAndUpdate(userId, { $push: { experiences: _id } }, {
            new: true,
        })


        if (modifiedProfile) {
            res.send(modifiedProfile)
        } else {
            next(createHttpError(404, `Profile with id ${userId} not found!`))
        }
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

experienceRouter.post("/:expId/picture", multer({ storage: cloudStorage }).single("experiencePic"), async (req, res, next) => {
    try {
        const experienceId = req.params.expId
        const modifiedexperience = await ExperienceModel.findByIdAndUpdate(experienceId, { $set: { image: req.file.path } }, {
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
        res.setHeader("Content-Disposition", `attachment; filename=example.csv`)
        const userId = req.params.userId;
        const userExperiences = await ProfileModel.findById(userId, { "experiences": 1, "_id": 0 }).populate("experiences")
        const experienceList = JSON.stringify(userExperiences.experiences);

        const source = Readable.from(experienceList)
        const transform = new json2csv.Transform({ fields: ['role', 'username', 'startDate', 'endDate', 'description', 'area', 'image'] })
        const destination = res

        pipeline(source, transform, destination, err => {
            if (err) next(err)
        })
        // res.send(experienceList)
    } catch (error) {
        next(error)
    }
})


export default experienceRouter