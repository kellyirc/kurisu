// Description:
//   Sets up an update web hook and executes an update command when posted to.
var cp = require('child_process');

module.exports = function(robot) {
    robot.router.post('/' + robot.name + '/update-hook', function(req, res) {
        res.end('Update hook received!!');
        console.log('Running ' + process.env.HUBOT_HOOK_UPDATE_CMD);
        cp.exec(process.env.HUBOT_HOOK_UPDATE_CMD);
    });
}
