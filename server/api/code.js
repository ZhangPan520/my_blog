const express = require('express')
const app = express()
const db = require('../db/db.js')
const mail = require('../email')
app.get('/api/code', (req, res) => {
    var code = `${Math.floor((Math.random() + 1) * 5000) + 1}`;
    new db.Code({
        code,
        address:req.query.address
    }).save((err, data) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.status(200).send(code)
            console.log('test', req.query)
            const content = `
            <div style="width: 90%; border: 2px solid lightgreen; margin: 1rem auto; padding: 1rem; text-align: center;">
                <p style="border-bottom: 1px dashed lightgreen;margin: 0;padding-bottom: 1rem; color: lightgreen; font-size: 1.25rem;">MyBlog Message</p>
            <p style="margin: 1rem 0 0;">hello,验证码 &#x1f608</p>
            <p sytle="margin: 0 0 1rem;">您的验证码是<span style="text-decoration: underline;marginLeft:1rem">${code}</span>;  60s内有效</p>
                </div>
                `
            mail.send(req.query.address, '验证码', content, res,code)
        }
    });
})
module.exports = app