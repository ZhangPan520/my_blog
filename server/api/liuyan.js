const express = require('express')
const router = express.Router()
const mail = require('../email')
const db = require('../db/db.js')
router.delete('/api/delete_liuyan',(req,res)=>{
    const {_id} = req.query.payload
    console.log(_id)
    db.Liuyan.remove({_id: _id}, (err, data) => {
        if (err) {
            res.status(401).send('删除失败')
        } else {
            res.status(200).send('删除成功')
        }
    })
})
router.post('/api/liuyan', (req, res) => {
            const liuyan = {

                name: req.body.name,
                date: Date(),
                content: req.body.content,
                isPublish: false,
            }
            new db.Liuyan(liuyan).save()
            res.status(200).send('留言成功')
})
// // 留言审核通过
router.post('/api/liuyan_tongguo',(req,res)=>{
    const {_id} = req.body.params.payload
    var fix = {isPublish:true,_id};
    console.log(fix)
    // new db.Liuyan(fix).save();
    // new db.comment({isPublish}).save()
    db.Liuyan.update({_id: _id}, {isPublish:true}, (err, data) => {
        if (err) {
            res.status(401).send('审核通过失败')
        } else {
            res.status(200).send('审核通过')
        }
    })
})
// 获取某一篇文章的所有评论
router.get('/api/liuyans', (req, res) => {
    const { role } = req.query.payload
    if (req.query.payload.sort === 'date') {                                // 根据时间排序评论
        if(role=='false'){
            db.Liuyan.find({isPublish:true}, 'name date content isPublish').sort({ date: -1 }).exec()
            .then((liuyans) => {
                res.send(liuyans)
            })
        }else{
            db.Liuyan.find({}, 'name date content isPublish').sort({ date: -1 }).exec()
            .then((liuyans) => {
                res.send(liuyans)
            })
        }
    } else {
        if (role=='false') {
            db.Liuyan.find({ isPublish: true }, 'name date content isPublish').exec().then((liuyans) => {
                res.send(liuyans)
            })
        }else{
            db.Liuyan.find({}, 'name date content isPublish').exec().then((liuyans) => {
                res.send(liuyans)
            })
        }
    }
})
module.exports = router