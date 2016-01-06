window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/push-notification-sw.js', {
      scope: '/'
    });
    window._as_notification_service = new pushNotification({
      endPoint: '/subscribe'
    });
  }

  var subscribe = function() {
    var direction = this.value;
    var subscribe = new XMLHttpRequest();
    subscribe.open('POST', '/create-notification');
    subscribe.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    subscribe.send(JSON.stringify({
      direction: direction
    }));
  };
  document.getElementById('mow-led').addEventListener('click', subscribe);
  document.getElementById('mow-bkk').addEventListener('click', subscribe);

});
