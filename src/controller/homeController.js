import pool from "../config/connectDB"
import handleWorker from "./handleWorker"
import handleProductPlant from "./handleProductPlant"
// import variableList from "./handle"

const variableList = {
    //báo cáo công nhân
    'productpass-sum': handleWorker.getProductPassSum,
    'productfail-sum': handleWorker.getProductFailSum,
    'target-sum': handleWorker.getTargetSum,
    "name": handleWorker.getNameWorker,
    "employee-code": handleWorker.getEmployeeCode,
    "product-plant": handleWorker.getProductPlant,
    "time-start": handleWorker.getTimeStart,
    "time-end": handleWorker.getTimeEnd,
    "name-task": handleWorker.getNameTask,
    "code-task": handleWorker.getCodeTask
}

const variableList_2 = {
    //Báo cáo phân xưởng
    "productplant-name" : handleProductPlant.getProductPlantName,
    "time-start": handleProductPlant.getTimeStart,
    "time-end": handleProductPlant.getTimeEnd,
    "code-task": handleProductPlant.getCodeTask,
    "name-task": handleProductPlant.getNameTask,
    'productpass-sum': handleProductPlant.getProductPassSum,
    'productfail-sum': handleProductPlant.getProductFailSum,
    'target-sum': handleProductPlant.getTargetSum

}

const getHomePage = (req, res) => {
    res.send('Server NodeJS Excel')
}

const getData = async (req, res) => {
    let message = req.body
    // console.log("Message Time gửi lên: " + message.time)
    let time = message.time.split(" ")
    let input = []
    let final = []
    const regex = /([a-z]|[0-9]|\(|\)|\-|\_)+/
    // console.log("Data Cần lấy: " + message.dataClient)
    for (let data of message.dataClient) {
        let result = data.match(regex)
        if (result) {
            input.push(result[0])
        }
    }
    if (message.worker) {
        let result
        for (let data of input) {
            let id_task
            if (data.match(/\d+/)) {
                id_task = data.match(/\d+/)[0] // "3"
            }
            let other
            if (id_task) {
                other = data.split("(")[1]
                data = data.split("(")[0]
                console.log("Other: " + other)
            }

            //kiểm tra xem là khoảng thời gian hay là 1 ngày
            if (!time[1]) {
                result = await variableList[data](message.worker, time[0], time[0], id_task)
            } else {
                result = await variableList[data](message.worker, time[0], time[1], id_task)
            }
            // console.log("Kết quả: " + result)

            if (id_task) {
                final.push({
                    data: data + "(" + other,
                    value: result
                })
            } else {
                final.push({
                    data,
                    value: result
                })
            }

        }
        res.send(final)
    } else {
        //id phân xưởng là message.productplant
        let result
        for (let data of input) {
            let id_task
            if (data.match(/\d+/)) {
                id_task = data.match(/\d+/)[0] // "3"
            }
            let other
            if (id_task) {
                other = data.split("(")[1]
                data = data.split("(")[0]
                console.log("Other: " + other)
            }

            //kiểm tra xem là khoảng thời gian hay là 1 ngày
            if (!time[1]) {
                result = await variableList_2[data](message.productplant, time[0], time[0], id_task)
            } else {
                result = await variableList_2[data](message.productplant, time[0], time[1], id_task)
            }

            if (id_task) {
                final.push({
                    data: data + "(" + other,
                    value: result
                })
            } else {
                final.push({
                    data,
                    value: result
                })
            }

        }
        res.send(final)
    }
}

const getProductPlant = async (req, res) => {
    // console.log("Client get data phân xưởng")
    let [productPlantList, other] = await pool.execute("select * from productplant")
    res.send(productPlantList)
}

const getListWorker = async (req, res) => {
    let id_productplant = req.params.id
    let [listWorker, other] = await pool.execute(`select * from worker where id_productplant = ${id_productplant}`)
    res.send(listWorker)
}

module.exports = {
    getHomePage,
    getData,
    getProductPlant,
    getListWorker
}