var Server = require('socket.io');
var Queue = require('./queue');
var User = require('./user');

function QueueEngine() {
  this.users = [];
}

QueueEngine.prototype.start = function() {
  this.io = new Server(6543);
  this.io.on('connection', this.userConnected.bind(this));
  setInterval(this.engine.bind(this), 1000/60);
};

QueueEngine.prototype.engine = function() {
  this.handleQueue(Queue.rankedConquest);

  this.handleQueue(Queue.normalConquest);
};

QueueEngine.prototype.handleQueue = function(queue) {
  var rolesAvailable = 0;

  for(var roles in queue){
    // console.log(roles);
    if(queue[roles].length >= 1) {
      rolesAvailable++;
    }
  }

  if (rolesAvailable != 5) {
    // return;
  }


  var uniqueRoles = 0;
  var users = [];
  for (var roleName in queue) {
    var role = queue[roleName];

    for (var i = 0; i < role.length; i++) {
      var user = role[i];
      if(users.indexOf(user) == -1) {
        users.push(user);
        break;
      }
    }
  }

  if (users.length == 5) {
      console.log("found a party!");
      var party = [];

      users.forEach(function(user) {
        var publicUser = {
          ign: user.ign,
          roles: user.roles,
          avatarSrc: user.avatarSrc
        };
        party.push(publicUser)

        for (var roleName in queue) {
          var role = queue[roleName];
          if(role.indexOf(user) != -1) {
            role.splice(role.indexOf(user), 1);
          }
        }
      });

      users.forEach(function(user) {
        user.socket.emit("PartyFound", party);
      });
  }
};



QueueEngine.prototype.userConnected = function(socket) {
  this.users.push(new User(socket));
}

module.exports = exports = new QueueEngine();
