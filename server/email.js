const nodemailer = require('nodemailer')
const db = require('./db/db.js')
let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false,
    auth: {
        user: '320311176@qq.com',
        pass: 'hvrtrvrueaydbjig'
    }
})

exports.send = function(to, subject, html, res,code) {
    const mailOptions = {
        from: '"博客小管家" <320311176@qq.com>',
        to : to,
        subject : subject,
        html : html
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
            res.status(504).end("通知邮件发送失败")
        } else {
            res.status(200).end('send email successfully')
            console.log("Message sent: " + info.response)
            //用于删除已经存储的验证码
            if(code){
                setTimeout(() => {
                    db.Code.remove({ code:code,address:to }, (err, data) => {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        console.log('删除成功')
                    })
                }, 60000)
            }
        }
    })
}
