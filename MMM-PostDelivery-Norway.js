/*
 * Magic Mirror module for displaying the next post delivery day for your zip code in Norway
 * By Reidar W https://github.com/reidarw/MMM-PostDelivery-Norway
 * MIT Licensed
 */

Module.register("MMM-PostDelivery-Norway", {
    defaults: {
        zipCode: 7033,
        header: 'Leveringsdag for post',
        numberOfDays: 1, // Max 6
    },

    start: function() {
        this.deliveryPlan = [];
        this.loaded = false;
        this.getDeliveryPlan();
        this.scheduleUpdate();
    },

    getDeliveryPlan: function() {
        this.sendSocketNotification("GET_POST_PLAN", {
            config: this.config
        });
    },

    scheduleUpdate: function(delay) {
        let nextLoad = 5 * 60 * 60 * 1000; // 5 hours
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }
        const self = this;
        setInterval(function() {
            self.getDeliveryPlan();
        }, nextLoad);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "POST_PLAN") {
            this.deliveryPlan = payload;
            console.log(this.deliveryPlan);
            this.loaded = true;
            this.updateDom(1000);
        }
    },

    getDom: function() {
        let wrapper = document.createElement("div");

        if (this.loaded === false) {
            wrapper.innerHTML = 'Laster...';
            wrapper.className = "dimmed light small";

            return wrapper;
        }

        if (this.config.header) {
            let headerContainer = document.createElement('div');
            headerContainer.innerHTML = this.config.header;
            headerContainer.className = 'light small';
            wrapper.appendChild(headerContainer);
        }

        const daysInNorwegian = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

        for (i = 0; i < this.config.numberOfDays; i++) {
            if (typeof this.deliveryPlan.delivery_dates[i] !== 'undefined') {
                let deliveryContainer = document.createElement("div");
                deliveryContainer.className = 'small';
                if (this.deliveryPlan.delivery_dates[i]) {
                    let date = new Date(this.deliveryPlan.delivery_dates[i]);
                    deliveryContainer.innerHTML = daysInNorwegian[date.getDay()];
                    wrapper.appendChild(deliveryContainer);
                }

            }
        }

        return wrapper;
    }
});
