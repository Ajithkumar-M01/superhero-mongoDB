import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const uri = process.env.MONGODB_URI

mongoose
    .connect(uri)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err)
    })

const superheroSchema = new mongoose.Schema({
    superheroName: {type: String, required: true},
    originalName: {type: String, required: true},
    abilities: {type: String},
    description: {type: String},
})

const Superhero = mongoose.model("Superhero", superheroSchema)

app.get("/api/superheroes/", async (req, res) => {
    try {
        const superheroes = await Superhero.find()
        res.status(200).json(superheroes)
    } catch (err) {
        res.status(500).json({message:"Error occured in fetching",err})
    }
})

app.post("/api/superheroes", async (req, res) => {
    const newSuperhero = new Superhero({
        superheroName: req.body.superheroName,
        originalName: req.body.originalName,
        abilities: req.body.abilities,
        description: req.body.description,
    })

    try {
        const savedSuperhero = await newSuperhero.save()
        res.status(200).json(savedSuperhero)
    } catch (err) {
        res.status(500).json({message:"Error occured in saving",err})
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})