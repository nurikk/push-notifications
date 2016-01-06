Really working chrome web push notifications example
======


# Installation
`npm install`
1) register application
(https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web)
2) Fill you gcm_sender_id with application id in manifest.json
3) Change SERVER_API_KEY in server.js
4) Start
```bash
node server.js
```
5) Navigate to http://localhost:3000/
6) Click some buttons
7) Send notifications
```bash
curl 'http://localhost:3000/notify?direction=MOW-LED&message=hello'
```
