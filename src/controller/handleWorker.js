import pool from "../config/connectDB"

const getProductPassSum = async (id,time_start,time_end,id_task) => {
    let sql = `select sum(productpass) from task_worker where id_worker = ${id}  and date between '${time_start}' and '${time_end}' group by id_task`
    let [product_pass_sum,other] = await pool.execute(sql)
    console.log("Product Pass Sum : " + product_pass_sum[0])
    if (product_pass_sum[id_task - 1]) {
        return product_pass_sum[id_task - 1]['sum(productpass)']
    } else {
        return null
    }
}

const getProductFailSum = async (id,time_start,time_end,id_task) => {
    let sql = `select sum(productfail) from task_worker where id_worker = ${id}  and date between '${time_start}' and '${time_end}' group by id_task`
    let [product_fail_sum,other] = await pool.execute(sql)
    if (product_fail_sum[id_task - 1]) {
        return product_fail_sum[id_task - 1]['sum(productfail)']
    } else {
        return null
    }
}

const getTargetSum = async (id,time_start,time_end,id_task) => {
    let sql = `select sum(target) from task_worker where id_worker = ${id}  and date between '${time_start}' and '${time_end}' group by id_task`
    let [target_sum,other] = await pool.execute(sql)
    if (target_sum[id_task - 1]) {
        return target_sum[id_task - 1]['sum(target)']
    } else {
        return null
    }
}

const getNameWorker = async (id) => {
    let sql = `select name from worker where id = ${id}`
    let [nameWorker,other] = await pool.execute(sql)
    return nameWorker[0].name 
}

const getEmployeeCode = async (id) => {
    let sql = `select employee_code from worker where id = ${id}`
    let [employeeCode,other] = await pool.execute(sql)
    return employeeCode[0].employee_code 
}

const getProductPlant = async (id) => {
    let sql = `select productplant.name as name from productplant join worker on productplant.id = worker.id_productplant where id_productplant = ${id}`
    let [name_productplant,other] = await pool.execute(sql)
    return name_productplant[0].name 
}

const getTimeStart = (id,time_start,time_end) => {
    return time_start
}

const getTimeEnd = (id,time_start,time_end) => {
    return time_end
}

const getNameTask = async (id,time_start,time_end,id_task) => {
    let sql = `select task.name as name from task join task_worker on task_worker.id_task = task.id where id_worker = ${id}  and date between '${time_start}' and '${time_end}' group by id_task`
    let [name_task,other] = await pool.execute(sql)
    if (name_task[id_task - 1]) {
        return name_task[id_task - 1]['name']
    } else {
        return null
    }
}

const getCodeTask = async (id,time_start,time_end,id_task) => {
    
    let sql = `select task.task_code as code from task join task_worker on task_worker.id_task = task.id where id_worker = ${id}  and date between '${time_start}' and '${time_end}' group by id_task`
    // console.log(sql)
    let [task_code,other] = await pool.execute(sql)
    if (task_code[id_task - 1]) {
        return task_code[id_task - 1]['code']
    } else {
        return null
    }
}

module.exports = {
    getProductPassSum,
    getProductFailSum,
    getTargetSum,
    getNameWorker,
    getEmployeeCode,
    getProductPlant,
    getTimeStart,
    getTimeEnd,
    getNameTask,
    getCodeTask
}