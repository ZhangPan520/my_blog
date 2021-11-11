const express = require('express')
const app = express()
const db = require('../db/db.js')
const mail = require('../email')
app.post('/api/visible', (req, res) => {
    db.Visible.update({}, { $inc: { count: 1 }}, (err, data) => {
        if(data){
            res.status(200).send('自增成功')
        }
    })
})
app.get('/api/countwatch',(req,res)=>{
    db.Visible.find({},(err,data)=>{
        if(err){
            res.status(400).send(err)
        }
        if(res){
            res.status(200).send(data);
        }
    })
})
module.exports = app