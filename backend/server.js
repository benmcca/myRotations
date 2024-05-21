import express from "express"
import cors from "cors"
import music from './api/music.route.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/bsm25/music", music)

app.use('*', (req, res) => {
    res.status(404).json({error: "Not Found"})
})

export default app