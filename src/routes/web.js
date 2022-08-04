import express from "express";
import homeController from "../controller/homeController"


const router = express.Router()

const initWebRoute = (app) => {

    router.get('/', homeController.getHomePage)

    router.post("/data", homeController.getData)

    router.get("/productplant", homeController.getProductPlant)

    router.get("/productplant/:id", homeController.getProductPlantById)

    router.get("/productplant/worker/:id", homeController.getListWorker)

    router.get("/productplant/task/:id", homeController.getListTask)


    return app.use('/', router)
}

export default initWebRoute