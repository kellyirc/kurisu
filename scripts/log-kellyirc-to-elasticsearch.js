// Description:
//   Logs everything in #kellyirc @ EsperNet to an elasticsearch instance.

var hubot = require('hubot');
var got = require('got');

var Listener = hubot.Listener;
var TextMessage = hubot.TextMessage;

module.exports = function(robot) {
    robot.listeners.push(new Listener(robot,
        function(msg) { return msg instanceof TextMessage && msg.room === '#kellyirc'; },
        function(res) {
            var data = {
                user: res.message.user.name,
                text: res.message.text,
                time: new Date()
            };

            got.post('http://37.139.26.224/elasticsearch/log/kellyirc', {
                body: JSON.stringify(data),
                auth: process.env['KURISU_LOG_AUTH']
            })
            .catch(function(err) {
                console.error(err.stack);
            });
        }
    ));
}
