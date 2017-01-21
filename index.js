const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});

/* Handling all messages */
app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    sendCat(event);
                }
            });
        });
        res.status(200).end();
    }
});

request.post({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        setting_type: 'call_to_actions',
        thread_state: 'new_thread',
        call_to_actions: [{
            payload: 'GET_START'
        }]
    },
    method: 'POST',
    json: true
}, function(err, res) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
});

function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: { text: text }
        }
    }, function(error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function sendCat(event) {
    let sender = event.sender.id;

    request({
        url: 'http://api.giphy.com/v1/gifs/random',
        qs: {
            api_key: 'dc6zaTOxFJmzC',
            tag: 'cat'
        },
        json: true
    }).then((data) => {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: sender },
                message: {
                    attachment: {
                        type: image,
                        payload: {
                            url: data.image_url
                        }
                    }
                }
            }
        }, function(error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }).catch((err) => {
        console.log(err);
    });
}