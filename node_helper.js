const request = require('request');
const node_helper = require("node_helper");

module.exports = node_helper.create({
    socketNotificationReceived: function (notification, payload) {
        const self = this;
        if (notification === "GET_POST_PLAN") {
            const url = 'https://www.posten.no/levering-av-post/_/component/main/1/leftRegion/11?postCode=' +
                payload.config.zipCode;
            let returnData = {error: true};
            let headers = {
                'X-Requested-With': 'XMLHttpRequest'
            };
            request({
                headers: headers,
                method: 'GET',
                url: url,
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    returnData = JSON.parse(body);
                }
                self.sendSocketNotification("POST_PLAN", returnData);
            });

        }
    },
});
