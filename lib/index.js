'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _facebookMessengerBot = require('facebook-messenger-bot');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var bot = new _facebookMessengerBot.Bot(process.env.PAGE_ACCESS_TOKEN, process.env.VERIFY_TOKEN);

bot.on('message', function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(message) {
        var sender, out;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        sender = message.sender;
                        _context.next = 3;
                        return sender.fetch('first_name');

                    case 3:
                        out = new _facebookMessengerBot.Elements();

                        out.add({ text: 'hey ' + sender.first_name + ', how are you!' });

                        _context.next = 7;
                        return bot.send(sender.id, out);

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}());

var app = (0, _express2.default)();
app.use('/webhook', bot.router());
app.listen(3000);