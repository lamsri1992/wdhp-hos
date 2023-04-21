const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

const h_code = process.env.H_CODE;

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
    console.log('<< WDHP - API :: WATCHAN DIGITAL HEALTH PLATFORM [JHCIS - First Sync] >>')
})

// Send Patient From JHCIS
app.get('/all_patient', async (req, res) => {
            
    try {
        api_connection.query('SELECT person.pcucodeperson,person.pid,person.hcode,_tmpprename_code.prename,person.fname,person.lname,'+
            'person.birth,person.sex,person.idcard,person.bloodgroup,person.allergic ' +
            'FROM person ' +
            'LEFT JOIN _tmpprename_code on _tmpprename_code.prenamecode = person.prename ' +
            'WHERE person.pcucodeperson = "'+ h_code +'"',
            (err, result, field) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send()
                }
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
                var count = 20 / keyCount;
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
app.get('/all_visit', async (req, res) => {
            
    try {
        api_connection.query('SELECT visit.visitdate,visit.pcucode,visit.visitno,visit.pid,visit.symptoms,visit.weight,visit.height,visit.pressure,visit.temperature,visit.pulse,visit.respri ' +
            'FROM visit ' +
            'WHERE visit.pcucode = "'+ h_code +'" AND visit.flagservice = "03" AND visitdate >= "2020-01-01" AND visitdate <= "2023-12-31"',
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
                var count = 20 / keyCount;
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
app.get('/all_diag', async (req, res) => {
            
    try {
        api_connection.query('SELECT visit.visitdate,visitdiag.pcucode,visitdiag.visitno,visitdiag.diagcode,cdisease.diseasenamethai ' +
            'FROM visitdiag ' +
            'LEFT JOIN visit ON visit.visitno = visitdiag.visitno ' +
            'LEFT JOIN cdisease ON cdisease.diseasecode = visitdiag.diagcode ' +
            'WHERE visit.pcucode = "'+ h_code +'" AND visitdate >= "2020-01-01" AND visitdate <= "2023-12-31"',
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
                var count = 20 / keyCount;
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
app.get('/all_drug', async (req, res) => {
            
    try {
        api_connection.query('SELECT visit.visitdate,visitdrug.pcucode,visitdrug.visitno,cdrug.drugname,visitdrug.unit,visitdrug.dose ' +
            'FROM visitdrug ' +
            'LEFT JOIN visit ON visit.visitno = visitdrug.visitno ' +
            'LEFT JOIN cdrug ON cdrug.drugcode = visitdrug.drugcode ' +
            'WHERE visit.pcucode = "'+ h_code +'" AND visitdate >= "2020-01-01" AND visitdate <= "2023-12-31"',
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
                var count = 20 / keyCount;
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