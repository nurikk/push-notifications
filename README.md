Really working chrome web push notifications example
======
### Installation
`npm install`

1. Register application
  https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web
2. Fill you gcm_sender_id with application id in manifest.json
3. Change SERVER_API_KEY in server.js
4. Start
  ```bash
  node server.js
  ```
5. Navigate to [localhost:3000](http://localhost:3000/)
6. Allow web pushes
7. Click some buttons
8. Send notifications
  ```bash
  curl 'http://localhost:3000/notify?direction=MOW-LED&message=hello'
  ```
