const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

// Xác thực email
// Tạo bộ gửi mail
let sendEmailKit = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anhdnph31267@fpt.edu.vn',
        pass: 'ffnz qjrj esqj aqwe'
    }
});

// Route gửi email
router.post('/', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        // Thiết lập nội dung gửi
        let content = {
            from: 'anhdnph31267@fpt.edu.vn',
            to: to,
            subject: subject,
            text: text
        };

        // Thực hiện gửi
        sendEmailKit.sendMail(content, (err, info) => {
            if (err) {
                console.log('Lỗi gửi mail', err);
                res.status(400).send(null);
            } else {
                console.log('Đã gửi:', info.response);
                res.status(200).send(content.text);
            }
        });
    } catch (error) {
        console.error('Lỗi server', error);
        res.status(500).send(null);
    }
})

module.exports = router