const request = require('request');
const node_helper = require("node_helper");

module.exports = node_helper.create({
    socketNotificationReceived: function (notification, payload) {
        const self = this;
        if (notification === "GET_POST_PLAN") {

            const time = Math.floor(Date.now() / 1000).toString();

            // Using the same solution as BobTheShoplifter
            // https://github.com/BobTheShoplifter/HomeAssistant-Posten/
            // This implementation bypasses Posten's API key requirements,
            // but please note that we are only accessing publicly available information.
            // We believe this information falls under the jurisdiction of the Norwegian Freedom of Information Act.
            // We kindly ask that Posten refrain from altering this functionality. Thank you.
            const base64String = 'f3ccd044MTY4MjYyODE2MQ==';
            const decodedBuffer = Buffer.from(base64String, 'base64');
            const text = decodedBuffer.toString('ascii').slice(0, 6);
            const timeUtf8 = Buffer.from(time.toString(), 'utf8');
            const combinedBuffer = Buffer.concat([Buffer.from(text), timeUtf8]);
            const token = combinedBuffer.toString('base64').replace(/=/g, '');

            const url = 'https://www.posten.no/levering-av-post/_/service/no.posten.website/delivery-days?postalCode=' +
                payload.config.zipCode;
            let returnData = {error: true};
            let headers = {
                'X-Requested-With': 'XMLHttpRequest',
                'kp-api-token': token
            };
            request({
                headers: headers,
                method: 'GET',
                url: url,
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    returnData = JSON.parse(body);
                    console.log(returnData);
                }
                self.sendSocketNotification("POST_PLAN", returnData);
            });

        }
    },
});
