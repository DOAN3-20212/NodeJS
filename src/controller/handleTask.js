import pool from "../config/connectDB";

const formatDate = (value) => {
    const date = new Date(value)
    const day = date.getDate() < 10 ?  "0" + date.getDate() : date.getDate() 
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return day + "/" + month + "/" + year
}

const getNameTask = async (id_productplant,id_task,time) => {
    let [nameTask,other] = await pool.execute(`select * from task where id = '${id_task}'`)
    return nameTask[0].name
}

const getCodeTask = async (id_productplant,id_task,time) => {
    let [codeTask,other] = await pool.execute(`select * from task where id = '${id_task}'`)
    return codeTask[0].task_code
}

const getTimeStart = async (id_productplant,id_task,time) => {
    let [time_start,other] = await pool.execute(`select * from task where id = '${id_task}'`)
    return formatDate( time_start[0].time_start)
}

const getTimeEnd = async (id_productplant,id_task,time) => {
    let [time_end,other] = await pool.execute(`select * from task where id = '${id_task}'`)
    return formatDate( time_end[0].time_end)
}
const getProductPlantName = async (id_productplant,id_task,time) => {
    let [name,other] = await pool.execute(`select * from productplant where id = '${id_productplant}'`)
    return name[0].name
}

const getProductPlantCode = async (id_productplant,id_task,time) => {
    let [name,other] = await pool.execute(`select * from productplant where id = '${id_productplant}'`)
    return name[0].name
}

const getProductPassSum = async (id_productplant,id_task,time) => {
    let [result,other] = await pool.execute(`select sum(productpass) from task_worker where id_task = '${id_task}' and date = '${time}'`)
    return result[0]['sum(productpass)']
    
}

const getProductFailSum = async (id_productplant,id_task,time) => {
    let [result,other] = await pool.execute(`select sum(productfail) from task_worker where id_task = '${id_task}' and date = '${time}'`)
    return result[0]['sum(productfail)']
    
}

const getTargetSum = async (id_productplant,id_task,time) => {
    if (time) {
        let [result,other] = await pool.execute(`select sum(target) from task_worker where id_task = '${id_task}' and date = '${time}'`)
        return result[0]['sum(target)']
    } else {
        let [result,other] = await pool.execute(`select sum(target) from task where id = '${id_task}'`)
        return result[0]['sum(target)']
    }
    
}

module.exports = {
    getNameTask,
    getCodeTask,
    getTimeStart,
    getTimeEnd,
    getProductPlantName,
    getProductPlantCode,
    getProductPassSum,
    getProductFailSum,
    getTargetSum
}