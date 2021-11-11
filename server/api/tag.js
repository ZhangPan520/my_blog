const express = require('express')
const router = express()
const db = require('../db/db.js')

router.get('/api/tags', (req, res) => {
    db.Article.find({isPublish: true}).distinct('tags', (err, doc) => {
        if (err) {
            console.log(err)
        } else if (doc) {
            res.send(doc)
        }
    })
})

module.exports = router
