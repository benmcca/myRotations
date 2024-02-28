// Benjamin McCabe
// 3/1/2024
// IT302 - 002
// Phase 2 Assignment
// bsm25@njit.edu

import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import MusicDAO from "./dao/musicDAO.js"

async function main() {
    dotenv.config()

    const client = new mongodb.MongoClient(process.env.MUSIC_DB_URI)
    const port = process.env.PORT || 8000

    try {
        await client.connect()
        await MusicDAO.injectDB(client)

        app.listen(port, () => {
            console.log('server is running on port: ' + port)
        })
    }
    catch(e) {
        console.error(e)
        process.exit(1)
    }
}
main().catch(console.error)