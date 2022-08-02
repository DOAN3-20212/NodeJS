import express from "express"
import viewEngineConfig from "./config/viewEngine"
import initWebRoute from "./routes/web"
import cors from "cors"


const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

viewEngineConfig(app)

initWebRoute(app)


app.listen(8080, () => {
    console.log("Server run at port 8080")
})