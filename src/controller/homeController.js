import pool from "../config/connectDB"
import handleWorker from "./handleWorker"
import handleProductPlant from "./handleProductPlant"
import handleTask from "./handleTask"

const formatTime = (time) => {
    //1/2/2022
    //01/02/2022
    //14/2/2022
    //14/06/2022
    //14/6/2022
    let arr = time.split("/")
    arr.reverse()
    for (let i in arr) {
        if (Number(arr[i]) < 10) {
            arr[i] = "0" + Number(arr[i])
        }
    }
    return arr.join("-")
}

const variableList = {
    //báo cáo công nhân
    'productpass-sum': handleWorker.getProductPassSum,
    'productfail-sum': handleWorker.getProductFailSum,
    'target-sum': handleWorker.getTargetSum,
    "name": handleWorker.getNameWorker,
    "employee-code": handleWorker.getEmployeeCode,
    "productplant": handleWorker.getProductPlant,
    "time-start": handleWorker.getTimeStart,
    "time-end": handleWorker.getTimeEnd,
    "name-task": handleWorker.getNameTask,
    "code-task": handleWorker.getCodeTask
}

const variableList_2 = {
    //Báo cáo phân xưởng
    "productplant-name": handleProductPlant.getProductPlantName,
    "time-start": handleProductPlant.getTimeStart,
    "time-end": handleProductPlant.getTimeEnd,
    "code-task": handleProductPlant.getCodeTask,
    "name-task": handleProductPlant.getNameTask,
    'productpass-sum': handleProductPlant.getProductPassSum,
    'productfail-sum': handleProductPlant.getProductFailSum,
    'target-sum': handleProductPlant.getTargetSum

}

const variableList_3 = {
    "name-task": handleTask.getNameTask,
    "code-task": handleTask.getCodeTask,
    "time-start": handleTask.getTimeStart,
    "time-end": handleTask.getTimeEnd,
    "productplant-name": handleTask.getProductPlantName,
    "productplant-code": handleTask.getProductPlantCode,
    'productpass-sum': handleTask.getProductPassSum,
    'productfail-sum' : handleTask.getProductFailSum,
    'target-sum': handleTask.getTargetSum
}

const getHomePage = (req, res) => {
    res.send('Server NodeJS Excel')
}

const getData = async (req, res) => {
    let message = req.body
    // console.log("Message Time gửi lên: " + message.time)
    let time
    if (message.time) {
        time = message.time.split(" ")
    }
    let input = []
    let final = []
    // const regex = /([a-z]|[0-9]|\(|\)|\-|\_|\/)+/
    const regex = /([a-z]|[0-9]|\-|\(|\)|(\/))+/
    for (let data of message.dataClient) {
        console.log(data)
        let result = data.match(regex)
        if (result) {
            // console.log("Math regex")
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
            if (!variableList[data]) {
                return
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
    } else if (message.productplant && (!message.task)) {
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

            if (!variableList_2[data]) {
                return
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
    } else {
        //id task là message.task
        var regExp = /([0-9]|(\/))+/
        let result
        for (let data of input) {
            console.log(data)
            let time
            if (data.match(regExp)) {
                time = data.match(regExp)[0]
                console.log(time)
                time = formatTime(time)
            }
            let other
            if (time) {
                other = data.split("(")[1]
                data = data.split("(")[0]
            }
            if (!variableList_3[data]) {
                return
            }
            result = await variableList_3[data](message.productplant, message.task, time)
            if (time) {
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

const getProductPlantById = async (req, res) => {
    let id_productplant = req.params.id
    let [productPlant, other] = await pool.execute(`select * from productplant where id = '${id_productplant}'`)
    res.send(productPlant)
}

const getListWorker = async (req, res) => {
    let id_productplant = req.params.id
    let [listWorker, other] = await pool.execute(`select * from worker where id_productplant = ${id_productplant}`)
    res.send(listWorker)
}

const getListTask = async (req, res) => {
    let id_productplant = req.params.id
    let [listTask, other] = await pool.execute(`select * from task where id_productplant = ${id_productplant}`)
    res.send(listTask)
}
module.exports = {
    getHomePage,
    getData,
    getProductPlant,
    getProductPlantById,
    getListWorker,
    getListTask
}