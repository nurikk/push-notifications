(function(win) {

  var pushNotification = function(config) {
    this.config = config;
    this.init();
  };

  pushNotification.prototype = {

    init: function() {
      var self = this;
      navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        if (!serviceWorkerRegistration.pushManager) {
          console.error('Push is not supported, Try Chrome M41.');
          return;
        } else {
          Notification.requestPermission(function(result) {
            if (result === 'granted') {
              self.manageSubscription(serviceWorkerRegistration);
            } else {
              console.error('Please allow Notification')
            }
          });
        }
      })
    },

    manageSubscription: function(serviceWorkerRegistration) {
      var self = this;
      serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          if (!subscription) {
            self.subscribe(serviceWorkerRegistration);
          } else {
            self.updateSubscription(subscription);
          }
        });
    },

    subscribe: function(serviceWorkerRegistration) {
      var self = this;
      serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true
        })
        .then(function(subscription) {
          self.updateSubscription(subscription);
        })
        .catch(function(e) {
          console.error('Unable to register for push', e);
        });
    },

    updateSubscription: function(subscription) {
      if (this.config.endPoint) {
        var subscribe = new XMLHttpRequest();
        subscribe.open('POST', this.config.endPoint);
        subscribe.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        subscribe.send(JSON.stringify({
          endpoint: subscription.endpoint
        }));
      }
    }
  };

  window.pushNotification = pushNotification;

})(window);
