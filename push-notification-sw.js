'use strict';

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('push', function(event) {
  // Since there is no payload data with the first version
  // of push messages, we'll grab some data from
  // an API and use it to populate a notification
  event.waitUntil(
    fetch('/api/', {
      credentials: 'include'
    }).then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        throw new Error();
      }

      return response.json().then(function(data) {
        if (data.error || !data.messages) {
          console.error('The API returned an error.', data.error);
          throw new Error();
        }
        for (var i in data.messages) {
          var msg = data.messages[i];
          var title = msg.title;
          var body = msg.body;
          var icon = msg.icon;
          var url = msg.url;

          self.registration.showNotification(title, {
            body: body,
            icon: icon,
            data: {
              url: url
            }
          });
        }
      }).catch(function(err) {
        console.error('Unable to retrieve data', err);
      });
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});
