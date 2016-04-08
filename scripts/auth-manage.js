// Description:
//   Simple prevention of usage of some commands depending on hubot-auth roles.

module.exports = function(robot) {
    robot.listenerMiddleware(function(context, next, done) {
        var id = context.listener.options.id;
        var roleAccessRules = robot.brain.get('roleAccessRules') || {};

        if(id == null || roleAccessRules[id] == null ||
            robot.auth.hasRole(context.response.message.user, roleAccessRules[id])
        ) {
            next();
        }
        else {
            console.log('Blocked user ' + context.response.message.user.name + ' from using ' + id);
            done();
        }
    });

    robot.respond(/(.+) requires (.+)$/i, function(res) {
        if(!robot.auth.hasRole(res.message.user, 'admin')) {
            res.reply('Only admins may set that!');
        }

        var id = res.match[1];
        var role = res.match[2];

        var roleAccessRules = robot.brain.get('roleAccessRules') || {};
        roleAccessRules[id] = role;
        robot.brain.set('roleAccessRules', roleAccessRules);

        res.reply('Alright, command "' + id + '" now requires role ' + role);
    });

    robot.respond(/(.+) doesn't require any role/i, function(res) {
        if(!robot.auth.hasRole(res.message.user, 'admin')) {
            res.reply('Only admins may set that!');
        }

        var id = res.match[1];

        var roleAccessRules = robot.brain.get('roleAccessRules') || {};
        delete roleAccessRules[id];
        robot.brain.set('roleAccessRules', roleAccessRules);

        res.reply('Alright, command "' + id + '" now doesn\'t require any role');
    });
}
