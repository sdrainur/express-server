const transporter = require('../configs/mail.config').transporter

async function sendMail(userData) {
    await transporter.sendMail({
        from: 'meachapp@yandex.ru',
        to: userData.email,
        subject: 'Activation',
        text: `Hello, ${userData.firstName + ' ' + userData.secondName}.\n
        Activation code: ${userData.activationCode}`
    })
    console.log(userData.activationCode)
}

module.exports = {
    sendMail
}