const express = require('express')
const cors = require('cors')
const isReachable = require('is-reachable');
const http = require('http');
const mysql = require('mysql2')
const dotenv = require('dotenv')
const cron = require('node-cron');
const LineAPI = require('line-api');
const path = require('path');
const notify = new LineAPI.Notify({
    token: "HYBwjs2I2F5c2MKbzKifeMWtkaJuNBUuqJihpImXtnM"
})

dotenv.config()

const h_code = process.env.H_CODE;
const h_name = process.env.H_NAME;

// Database Connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

const api_connection = mysql.createConnection({
    host: process.env.DB_HOST_API,
    user: process.env.DB_USER_API,
    password: process.env.DB_PASSWORD_API,
    database: process.env.DB_NAME_API,
    port: process.env.DB_PORT_API
})

const app = express()
app.use(cors())
app.use(express.json())

app.listen(3000, function () {
    console.log('<< WDHP - API :: WATCHAN DIGITAL HEALTH PLATFORM [JHCIS] >>')
})

// Patient
cron.schedule('00 10 * * *', function () { 
    let d = new Date(Date.now()).toLocaleString(); //แสดงวันที่และเวลา
    console.log("------------------------------------------");
    console.log(`Running Cron Job ${d}`);;
    
    // Run Script
    var options = {
        host: process.env.DB_HOST_API,
        port: process.env.H_PORT,
        path: '/patient',
        method: 'GET'
    };
    
    http.request(options, function(res) {
        console.log('\nRunning API Script :: ' + options.path)
    }).end();
    // End 

    isReachable(process.env.DB_HOST_API +":"+ process.env.H_PORT).then(reachable => {
        if (!reachable) { // => false
            let msg = `ไม่สามารถเชื่อมต่อ API ได้ !!\n` + d + ` :: ` + h_code + ` => ` + h_name
            notify.send({
                message: msg
            })
        }else{
            let msg = `เชื่อมโยงข้อมูลผู้ป่วยสำเร็จ !!\n` + d + ` :: ` + h_code + ` => ` + h_name;
            notify.send({
                message: msg
            })
        }
    })
});

// Visit
cron.schedule('05 10 * * *', function () { 
    let d = new Date(Date.now()).toLocaleString(); //แสดงวันที่และเวลา
    console.log("------------------------------------------");
    console.log(`Running Cron Job ${d}`);;
    
    // Run Script
    var options = {
        host: process.env.DB_HOST_API,
        port: process.env.H_PORT,
        path: '/visit',
        method: 'GET'
    };
    
    http.request(options, function(res) {
        console.log('\nRunning API Script :: ' + options.path)
    }).end();
    // End 

    isReachable(process.env.DB_HOST_API +":"+ process.env.H_PORT).then(reachable => {
        if (!reachable) { // => false
            let msg = `ไม่สามารถเชื่อมต่อ API ได้ !!\n` + d + ` :: ` + h_code + ` => ` + h_name
            notify.send({
                message: msg
            })
        }else{
            let msg = `เชื่อมโยงข้อมูลการรับบริการสำเร็จ !!\n` + d + ` :: ` + h_code + ` => ` + h_name;
            notify.send({
                message: msg
            })
        }
    })
});

// Diag
cron.schedule('10 10 * * *', function () { 
    let d = new Date(Date.now()).toLocaleString(); //แสดงวันที่และเวลา
    console.log("------------------------------------------");
    console.log(`Running Cron Job ${d}`);;
    
    // Run Script
    var options = {
        host: process.env.DB_HOST_API,
        port: process.env.H_PORT,
        path: '/diag',
        method: 'GET'
    };
    
    http.request(options, function(res) {
        console.log('\nRunning API Script :: ' + options.path)
    }).end();
    // End 

    isReachable(process.env.DB_HOST_API +":"+ process.env.H_PORT).then(reachable => {
        if (!reachable) { // => false
            let msg = `ไม่สามารถเชื่อมต่อ API ได้ !!\n` + d + ` :: ` + h_code + ` => ` + h_name
            notify.send({
                message: msg
            })
        }else{
            let msg = `เชื่อมโยงข้อมูลการให้รหัสโรคสำเร็จ !!\n` + d + ` :: ` + h_code + ` => ` + h_name;
            notify.send({
                message: msg
            })
        }
    })
});

// Drug
cron.schedule('15 10 * * *', function () { 
    let d = new Date(Date.now()).toLocaleString(); //แสดงวันที่และเวลา
    console.log("------------------------------------------");
    console.log(`Running Cron Job ${d}`);;
    
    // Run Script
    var options = {
        host: process.env.DB_HOST_API,
        port: process.env.H_PORT,
        path: '/drug',
        method: 'GET'
    };
    
    http.request(options, function(res) {
        console.log('\nRunning API Script :: ' + options.path)
    }).end();
    // End 

    isReachable(process.env.DB_HOST_API +":"+ process.env.H_PORT).then(reachable => {
        if (!reachable) { // => false
            let msg = `ไม่สามารถเชื่อมต่อ API ได้ !!\n` + d + ` :: ` + h_code + ` => ` + h_name
            notify.send({
                message: msg
            })
        }else{
            let msg = `เชื่อมโยงข้อมูลรายการยาสำเร็จ !!\n` + d + ` :: ` + h_code + ` => ` + h_name;
            notify.send({
                message: msg
            })
        }
    })
});

// Check Connection
app.get('/status', async (req, res) => {

    api_connection.connect(function(err) {
        if (err) {
            const responseData = {
                apiVersion:"WDHP-HOS V_1.0",
                message:{
                    code: "CONNECTION_ERROR",
                    status: "failed(400)"
                }
            }
            const jsonContent = JSON.stringify(responseData);
            res.end(jsonContent);
        }else{
            const responseData = {
                apiVersion:"WDHP-HOS V_1.0",
                message:{
                    code: "CONNECTION_SUCCESS",
                    status: "success(200)"
                }
            }
            const jsonContent = JSON.stringify(responseData);
            res.end(jsonContent);
        }
    })
})

// Send Patient From JHCIS
app.get('/patient', async (req, res) => {
            
    try {
        api_connection.query('SELECT person.pcucodeperson,person.pid,person.hcode,_tmpprename_code.prename,person.fname,person.lname,'+
            'person.birth,person.sex,person.idcard,person.bloodgroup,person.allergic ' +
            'FROM person ' +
            'LEFT JOIN _tmpprename_code on _tmpprename_code.prenamecode = person.prename ' +
            'WHERE date_format(dateupdate, "%Y-%m-%d") >= CURDATE() - INTERVAL 1 DAY AND person.pcucodeperson = "'+ h_code +'"',
            (err, result, field) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send()
                }
            res.status(200).json(result)
                var jsArray = result;
                var keyCount  = Object.keys(result).length;
                jsArray.forEach(jsdata =>
                    connection.query("INSERT INTO h_patient (pcucodeperson,pid,hcode,prename,fname,lname,birth,sex,idcard,bloodgroup,allergic) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        jsdata.pcucodeperson,
                        jsdata.pid,
                        jsdata.hcode,
                        jsdata.prename,
                        jsdata.fname,
                        jsdata.lname,
                        jsdata.birth,
                        jsdata.sex,
                        jsdata.idcard,
                        jsdata.bloodgroup,
                        jsdata.allergic
                    ],
                     (err, results) => {
                        if (err) throw err
                    })
                );
                var ProgressBar = require('progress');
                count = 20 / keyCount;
                var bar = new ProgressBar('Processing [ :percent ]', { total: keyCount });
                var timer = setInterval(function () {
                bar.tick();
                if (bar.complete) {
                    console.log("Patient Data Transfer Complete :: "+ keyCount + " Records\n------------------------------------------\n");
                    clearInterval(timer);
                }
            }, count);
            res.status(200).json("Total Data :: "+ keyCount + " Records")
            })
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})

// Send Visit From JHCIS
app.get('/visit', async (req, res) => {
            
    try {
        api_connection.query('SELECT visit.visitdate,visit.pcucode,visit.visitno,visit.pid,visit.symptoms,visit.weight,visit.height,visit.pressure,visit.temperature,visit.pulse,visit.respri ' +
            'FROM visit ' +
            'WHERE date_format(visit.visitdate, "%Y-%m-%d") >= CURDATE() - INTERVAL 1 DAY visit.pcucode = "'+ h_code +'" AND visit.flagservice = "03" ORDER BY visit.visitdate ASC',
            (err, result, field) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send()
                }
                var jsArray = result;
                var keyCount  = Object.keys(result).length;
                jsArray.forEach(jsdata =>
                    connection.query("INSERT INTO h_visit (visitdate,pcucode,visitno,pid,symptoms,weight,height,pressure,temperature,pulse,respri) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                    [
                        jsdata.visitdate,
                        jsdata.pcucode,
                        jsdata.visitno,
                        jsdata.pid,
                        jsdata.symptoms,
                        jsdata.weight,
                        jsdata.height,
                        jsdata.pressure,
                        jsdata.temperature,
                        jsdata.pulse,
                        jsdata.respri
                    ],
                     (err, results) => {
                        if (err) throw err
                    })
                );
                var ProgressBar = require('progress');
                count = 20 / keyCount;
                var bar = new ProgressBar('Processing [ :percent ]', { total: keyCount });
                var timer = setInterval(function () {
                bar.tick();
                if (bar.complete) {
                    console.log("Visit Data Transfer Complete :: "+ keyCount + " Records\n------------------------------------------\n");
                    clearInterval(timer);
                }
            }, count);
            res.status(200).json("Total Data :: "+ keyCount + " Records")
            })
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})

// Send Diag From JHCIS
app.get('/diag', async (req, res) => {
            
    try {
        api_connection.query('SELECT visit.visitdate,visitdiag.pcucode,visitdiag.visitno,visitdiag.diagcode,cdisease.diseasenamethai ' +
            'FROM visitdiag ' +
            'LEFT JOIN visit ON visit.visitno = visitdiag.visitno ' +
            'LEFT JOIN cdisease ON cdisease.diseasecode = visitdiag.diagcode ' +
            'WHERE date_format(visit.visitdate, "%Y-%m-%d") >= CURDATE() - INTERVAL 1 DAY AND visit.pcucode = "'+ h_code +'" ORDER BY visit.visitdate ASC',
            (err, result, field) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send()
                }
                var jsArray = result;
                var keyCount  = Object.keys(result).length;
                jsArray.forEach(jsdata =>
                    connection.query("INSERT INTO h_visit_diag (visitdate,pcucode,visitno,diagcode,diseasenamethai) VALUES (?,?,?,?,?)",
                    [
                        jsdata.visitdate,
                        jsdata.pcucode,
                        jsdata.visitno,
                        jsdata.diagcode,
                        jsdata.diseasenamethai
                    ],
                     (err, results) => {
                        if (err) throw err
                    })
                );
                var ProgressBar = require('progress');
                count = 20 / keyCount;
                var bar = new ProgressBar('Processing [ :percent ]', { total: keyCount });
                var timer = setInterval(function () {
                bar.tick();
                if (bar.complete) {
                    console.log("Diag Data Transfer Complete :: "+ keyCount + " Records\n------------------------------------------\n");
                    clearInterval(timer);
                }
            }, count);
            res.status(200).json("Total Data :: "+ keyCount + " Records")
            })
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})


// Send Drug From JHCIS
app.get('/drug', async (req, res) => {
            
    try {
        api_connection.query('SELECT visit.visitdate,visitdrug.pcucode,visitdrug.visitno,cdrug.drugname,visitdrug.unit,visitdrug.dose ' +
            'FROM visitdrug ' +
            'LEFT JOIN visit ON visit.visitno = visitdrug.visitno ' +
            'LEFT JOIN cdrug ON cdrug.drugcode = visitdrug.drugcode ' +
            'WHERE date_format(visit.visitdate, "%Y-%m-%d") >= CURDATE() - INTERVAL 1 DAY AND visit.pcucode = "'+ h_code +'" ORDER BY visit.visitdate ASC',
            (err, result, field) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send()
                }
                var jsArray = result;
                var keyCount  = Object.keys(result).length;
                jsArray.forEach(jsdata =>
                    connection.query("INSERT INTO h_visit_drug (visitdate,pcucode,visitno,drugname,unit,dose) VALUES (?,?,?,?,?,?)",
                    [
                        jsdata.visitdate,
                        jsdata.pcucode,
                        jsdata.visitno,
                        jsdata.drugname,
                        jsdata.unit,
                        jsdata.dose
                    ],
                     (err, results) => {
                        if (err) throw err
                    })
                );
                var ProgressBar = require('progress');
                count = 20 / keyCount;
                var bar = new ProgressBar('Processing [ :percent ]', { total: keyCount });
                var timer = setInterval(function () {
                bar.tick();
                if (bar.complete) {
                    console.log("Drug Data Transfer Complete :: "+ keyCount + " Records\n------------------------------------------\n");
                    clearInterval(timer);
                }
            }, count);
            res.status(200).json("Total Data :: "+ keyCount + " Records")
            })
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})