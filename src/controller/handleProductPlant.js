import pool from "../config/connectDB";

const getProductPlantName = async (id) => {
    let sql = `select name from productplant where id = ${id}`
    let [name, other] = await pool.execute(sql)
    return name[0].name
}

const getTimeStart = (id,time_start,time_end) => {
    return time_start
}

const getTimeEnd = (id,time_start,time_end) => {
    return time_end
}

const getCodeTask = async (id,time_start,time_end,id_task) => {
    let sql = `select task.id,task.task_code from task join productplant on task.id_productplant = productplant.id join task_worker on task.id = task_worker.id_task WHERE productplant.id = '${id}' and task_worker.date BETWEEN '${time_start}' AND '${time_end}' GROUP BY task_worker.id_task;`
    let [data,other] = await pool.execute(sql)
    if (data[id_task - 1]) {
        return data[id_task - 1]['task_code']
    } else {
        return null
    }
}

const getNameTask = async (id,time_start,time_end,id_task) => {
    let sql = `select task.id,task.task_code,task.name from task join productplant on task.id_productplant = productplant.id join task_worker on task.id = task_worker.id_task WHERE productplant.id = '${id}' and task_worker.date BETWEEN '${time_start}' AND '${time_end}' GROUP BY task_worker.id_task;`
    let [data,other] = await pool.execute(sql)
    if (data[id_task - 1]) {
        return data[id_task - 1]['name']
    } else {
        return null
    }
}

const getProductPassSum = async (id,time_start,time_end,id_task) => {
    let sql = `select task.id,task.task_code,task.name,sum(task_worker.productpass) from task join productplant on task.id_productplant = productplant.id join task_worker on task.id = task_worker.id_task WHERE productplant.id = '${id}' and task_worker.date BETWEEN '${time_start}' AND '${time_end}' GROUP BY task_worker.id_task;`
    let [data,other] = await pool.execute(sql)
    if (data[id_task - 1]) {
        return data[id_task - 1]['sum(task_worker.productpass)']
    } else {
        return null
    }
}

const getProductFailSum = async (id,time_start,time_end,id_task) => {
    let sql = `select task.id,task.task_code,task.name,sum(task_worker.productfail) from task join productplant on task.id_productplant = productplant.id join task_worker on task.id = task_worker.id_task WHERE productplant.id = '${id}' and task_worker.date BETWEEN '${time_start}' AND '${time_end}' GROUP BY task_worker.id_task;`
    let [data,other] = await pool.execute(sql)
    if (data[id_task - 1]) {
        return data[id_task - 1]['sum(task_worker.productfail)']
    } else {
        return null
    }
}

const getTargetSum = async (id,time_start,time_end,id_task) => {
    let sql = `select task.id,task.task_code,task.name,sum(task_worker.target) from task join productplant on task.id_productplant = productplant.id join task_worker on task.id = task_worker.id_task WHERE productplant.id = '${id}' and task_worker.date BETWEEN '${time_start}' AND '${time_end}' GROUP BY task_worker.id_task;`
    console.log(sql)
    let [data,other] = await pool.execute(sql)
    if (data[id_task - 1]) {
        return data[id_task - 1]['sum(task_worker.target)']
    } else {
        return null
    }
}
module.exports = {
    getProductPlantName,
    getTimeStart,
    getTimeEnd,
    getCodeTask,
    getNameTask,
    getProductPassSum,
    getProductFailSum,
    getTargetSum
}