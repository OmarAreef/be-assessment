const Url = require('../models/url.model');
const axios = require('axios');
const { performance } = require('perf_hooks');
const reportService = require('./report.service');
const userService = require('./user.service')
const notificationService = require('./notification.service')
exports.create = async (url) => {
    const newUrl = new Url({ ...url });
    const result = await newUrl.save();
    return result;
}

exports.findAll = async (user, tag = null) => {
    const tags = tag ? { tags: tag } : {}
    const findParams = {
        User: user.id,
        ...tags
    }
    const result = await Url.find(findParams);
    return result;
}

exports.findOne = async (id, user) => {
    const result = await Url.find({ _id: id, User: user.id });
    return result;

}

exports.update = async (id, url, user) => {
    const result = await Url.findOneAndUpdate({
        _id: id,
        User: user.id
    }, { ...url }, {
        new: true
    });
    return result;
}

exports.delete = async (id, user) => {
    const result = await Url.findOneAndDelete({
        _id: id,
        User: user.id
    });
    return result;
}

exports.getFirstUrl = async (userId) => {
    const result = await Url.findOne({ User: userId });
    return result;
}

exports.checkURL = async (url) => {
    const urlParams = url.formulateRequestData();
    const user = url.User;
    
    let time = performance.now();
    await axios.get(urlParams.url, { headers: urlParams.headers })
        .then(async (response) => {
            const process = Math.ceil(performance.now() - time)
            url.history.push({
                status: 'up',
                responseTimeInMS: process
            })
            url = await url.save({ new: true });
            url = await url.getLatest();
        })
        .catch(async (error) => {
            const process = Math.ceil(performance.now() - time)
            url.history.push({
                status: 'down',
                responseTimeInMS: process
            })
            url = await url.save({ new: true });
            url = await url.getLatest();
            const notificationMSG = `
            one of the urls you have registerd has gone down please check ${url.name}, ${url.url}
            `
            notificationService.sendNotification("email" , notificationMSG,user )
        })
    return url
}

const constructReportObjectFromUrl = (url) => {
    return {
        name: url.name,
        url: url.url,
        averageResponseTime: url.getAverageResponseTime(),
        status: url.status,
        availability: url.getAvailabiltyPercentage(),
        outages: url.getTheNumberOfOutages(),
        uptime: url.totalUptimeInSeconds,
        downtime: url.totalDowntimeInSeconds,
        history: url.history
    }
}



exports.generateReport = async (urls, user) => {
    const reportObjectArr = urls.map(url => constructReportObjectFromUrl(url));
    const report = await reportService.generateReport(reportObjectArr, user)

    return report;
}

exports.cronJob = async () => {
    const urls = await Url.find({});
    urls.forEach(async (url) => {
        await this.checkURL(url);
    })
}