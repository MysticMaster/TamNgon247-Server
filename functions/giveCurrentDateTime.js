const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getDay() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

module.exports = {giveCurrentDateTime};
