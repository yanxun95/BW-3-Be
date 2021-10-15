import express from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import profilemodel from "./schema.js"
import multer from "multer";
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { pipeline } from "stream";
import { gettingpdfwithcontent } from "./pdf.js"
import experienceModel from "../experience/index.js"

const profileRouter = express.Router()

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profilepicture",
    },
})

profileRouter.get("/", async (req, res, next) => {
    try {
        const profiles = await profilemodel.find().populate('experiences')

        res.send(profiles)
    } catch (error) {
        next(error)
    }
})

profileRouter.post("/", async (req, res, next) => {
    try {
        const postnewprofile = new profilemodel(req.body)
        const { _id } = await postnewprofile.save()
        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

profileRouter.get("/:id", async (req, res, next) => {
    try {
        const eachprofile = await profilemodel.findById(req.params.id)
        const convert = eachprofile.experiences[0].role
        const eachprofilewithexp = await profilemodel.findOne({ role: `${convert}` }).populate('experiences')
        if (eachprofile) {

            res.send(eachprofilewithexp)
        }
        else {
            next(createHttpError(404, `profile with id ${req.params.id} is not found`))
        }
    } catch (error) {
        next(error)
    }
})

profileRouter.put("/:id", async (req, res, next) => {
    try {
        const updateprofile = await profilemodel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (updateprofile) res.send(updateprofile)
        else next(createHttpError(404, `profile with id ${req.params.id} is not found`))
    } catch (error) {
        next(error)
    }
})

profileRouter.delete("/:id", async (req, res, next) => {
    try {
        const deleteprofile = await profilemodel.findByIdAndDelete(req.params.id)
        if (deleteprofile) res.status(204).send({ message: "Deleted Successfully" })
        else next(createHttpError(404, `profile with id ${req.params.id} is not found`))
    } catch (error) {
        next(error)
    }
})

profileRouter.post("/:id/picture", multer({ storage: cloudStorage }).single("profilepic"), async (req, res, next) => {
    try {
        console.log(req.file)
        const profileImage = await profilemodel.findByIdAndUpdate(req.params.id, { $set: { image: req.file.path } }, { new: true })
        res.send(profileImage)
    } catch (error) {
        next(error)
    }
})

profileRouter.get("/:id/Pdf", async (req, res, next) => {
    try {
        res.setHeader("Content-Disposition", `attachment; filename: cv.pdf`)
<<<<<<< HEAD
        const pdfdata = await profilemodel.findById(req.params.id)
        const { name, surname, email, image, area, experiences, bio } = pdfdata
=======
        const pdfdata = await profilemodel.findById(req.params.id).populate('experiences')
        const {name, surname, email, image,area, experiences, bio} = pdfdata
>>>>>>> seconddaypull
        console.log(pdfdata)
        const source = await gettingpdfwithcontent({ name, surname, email, image, area, experiences, bio })
        const destination = res
        pipeline(source, destination, err => {
            if (err) next(error)
        })

    } catch (error) {
        next(error)
    }
})

export default profileRouter;