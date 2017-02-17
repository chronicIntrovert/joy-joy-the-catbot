const express = require('express');
const bodyParser = require('body-parser');
const request = require('requestretry');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

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
                    prepareMessage(event);
                    sendMessage(event);
                    sendCat(event);
                }
            });
        });
        res.status(200).end();
    }
});

function prepareMessage(event) {
    let sender = event.sender.id;

    const options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            "recipient": { id: sender },
            "sender_action": "mark_seen"
        }
    }

    request(options).then(response => {
        if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    }).catch(error => {
        console.log('Error preparing message: ', error);
    });
}

function sendMessage(event) {
    let sender = event.sender.id;
    let text = "Joy Joy went off to fetch you one of her friends, please wait as she scurries off for a bit...";

    const options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            "recipient": { id: sender },
            "message": { text: text },
            "sender_action": "typing_on"
        }
    };

    request(options).then(response => {
        if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    }).catch(error => {
        console.log('Error sending message: ', error);
    });
}

function sendCat(event, gif) {
    let sender = event.sender.id;

    const options = {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            "recipient": { "id": sender },
            "message": {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": gif.data.image_url
                    }
                }
            }
        }
    };

    request(options).then(response => {
        if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    }).catch(error => {
        console.log('Error sending message: ', error);
    });
}

function retrieveCat(event) {

    const options = {
        uri: 'http://api.giphy.com/v1/gifs/random',
        qs: {
            api_key: 'dc6zaTOxFJmzC',
            tag: 'cat'
        },
        json: true
    };

    request(options).then(data => {
        retrieveCat(event, data);
    }).catch((error) => {
        console.log('Error retrieveing cat GIF from Giphy: ', error);
    });
}