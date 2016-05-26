var Server = require('socket.io');
var QueueState = require('./queueState');
var Queue = require('./queue')
var User = require('./user');
var Guid = require('guid');
var PartyEngine = require('./partyEngine');
var Party = require('./party');
var Regions = require('../enums/regions');
var Platforms = require('../enums/platforms');

function QueueEngine() {
  this.users = [];
}

QueueEngine.prototype.start = function(port) {
  this.io = new Server(port);
  this.io.on('connection', this.userConnected.bind(this));
  setInterval(this.engine.bind(this), 1000/60);

  var normalConquestPCNA = new Queue();

  var normalConquestPCEU = new Queue();
  normalConquestPCEU.region = Regions.EU;

  var normalConquestPCAUS = new Queue();
  normalConquestPCAUS.region = Regions.AUS;

  var normalConquestXbox = new Queue();
  normalConquestXbox.platform = Platforms.Xbox;

  var normalConquestPS4 = new Queue();
  normalConquestPS4.platform = Platforms.PS4;

  QueueState.queues = QueueState.queues.concat([
    normalConquestPCNA,
    normalConquestPCEU,
    normalConquestPCAUS,
    normalConquestXbox,
    normalConquestPS4
  ]);
};

QueueEngine.prototype.engine = function() {
  var self = this;
  QueueState.queues.forEach(function(queue) {
    self.handleQueue(queue);
  });
};

QueueEngine.prototype.handleQueue = function(queue) {
  var rolesAvailable = 0;

  for (var role in queue.roles){
    if (queue.roles[role].length >= 1) {
      rolesAvailable++;
    }
  }

  if (rolesAvailable != queue.partySize) {
    return;
  }

  var uniqueRoles = 0;
  var users = [];
  for (var roleName in queue.roles) {
    var role = queue.roles[roleName];

    for (var i = 0; i < role.length; i++) {
      var user = role[i];
      if (users.indexOf(user) == -1) {
        users.push(user);
        break;
      }
    }
  }

  if (users.length == queue.partySize) {

      var partyId = Guid.raw();
      var publicParty = new Party(partyId);
      var serverParty = new Party(partyId);

      serverParty.users = users;

      // set up public and server party for users that are matched
      users.forEach(function(user) {
        var publicUser = {
          ign: user.ign,
          roles: user.roles,
          avatarSrc: user.avatarSrc
        };

        publicParty.users.push(publicUser)

        // remove users from the queue for each of their roles.
        for (var roleName in queue.roles) {
          var role = queue.roles[roleName];
          if (role.indexOf(user) != -1) {
            role.splice(role.indexOf(user), 1);
          }
        }

      });


      console.log("created a party! - track how often this finds a party");
      PartyEngine.setUpParty(serverParty);
      QueueState.parties.push(serverParty);
      QueueState.publicParties.push(publicParty)
      serverParty.users.forEach(function(user) {
        user.socket.emit("party-found", publicParty.users);
      });
  }
};



QueueEngine.prototype.userConnected = function(socket) {
  this.users.push(new User(socket));
}

module.exports = exports = new QueueEngine();
