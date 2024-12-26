const { Notification } = require("electron")
const path = require('path')
const { iconPath } = require("./constant")

const NOTIFICATION_TITLE = '小狗提醒您！'
const NOTIFICATION_BODY = '现在时间8:00\n时间不早了，快回家去撸狗！'

exports.showNotification = function () {
    new Notification({
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY,
        // silent: true, // 系统默认的通知声音
        icon: iconPath, // 通知图标
    }).show()
}