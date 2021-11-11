const express = require('express')
const router = express.Router()
const secret = require('../../config').jwt
const jwt = require('jsonwebtoken')
const db = require('../db/db.js')
const sha1 = require('sha1')

const creatToken = (id, name) => {
    return jwt.sign({
        id: id,
        name: name
    }, secret.cert, { expiresIn: '7d' })
}

router.post('/api/login', (req, res) => {
    db.Code.find({code:req.body.code,address:req.body.address},(err,doc)=>{
        if(doc.length>0){
            return;
        }else{
            res.status(404).end('验证码错误')
        }
        // console.log(doc)
    })
    db.User.findOne({name: req.body.name}, (err, doc) => {
        if (err) {
            return ;
        } else if (doc){
            const salt = doc.salt
            if (doc.password === sha1(req.body.password  + salt)) {
                const token = creatToken(doc._id, doc.name)
                db.Code.remove({address:req.body.address,code:req.body.code},(err,doc)=>{
                    if(err){
                        return;
                    }else{
                        console.log("验证码删除成功")
                    }
                })
                res.status(200).send({
                    id: doc._id,
                    name: doc.name,
                    token: token
                })

            } else {
                console.log('tsetg')
                res.status(404).end('账号密码错误')
            }
        }else{
            res.status(404).send('账号密码错误')
        }
    })
})
module.exports = router
