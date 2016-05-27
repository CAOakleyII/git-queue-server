var QueueState = require('./queueState');
var GameModes = require('../enums/gameModes');
var Platforms = require('../enums/platforms');

function User(socket) {
  this.socket = socket;
  this.roles = [];
  this.ign = "";
  this.gamemode = "";
  this.partyId = "";
  this.queueId = "";

  this.avatarSrc = "https://hydra-media.cursecdn.com/smite.gamepedia.com/e/ea/Icon_Player_SmiteCommunity.png";
  this.socket.on('leave-queue', this.leaveQueue.bind(this));
  this.socket.on('join-queue', this.joinQueue.bind(this));
  this.socket.on('disconnect', this.disconnect.bind(this));
  this.socket.on('accept-party', this.acceptParty.bind(this));
  this.socket.on('retrieve-party', this.retrieveParty.bind(this));
  this.socket.on('party-message', this.partyMessage.bind(this));
}

User.prototype.joinQueue = function(data) {
  var self = this;
  var gamemode = GameModes.Conquest;
  var ranked = false;

  this.removeFromQueue();

  var queue = QueueState.queues.find(function(x) {
    if (x.platform == data.platform) {
      if (data.platform == Platforms.PC && x.region != data.region)
      {
        return;
      }
      data.roles.forEach(function(role, index){
        x.roles[role].push(self);
      });
      self.queueId = x.id;
      return x;
    }
  });

  this.ign = data.ign;
  this.roles = data.roles;
  this.gamemode = data.gamemode;
}

User.prototype.leaveQueue = function() {
  this.removeFromQueue();
}

User.prototype.acceptParty = function(data) {
  this.socket.nsp.to(this.partyId).emit('accepted-party', this.ign);
}

User.prototype.retrieveParty = function() {
  var self = this;
  var party = QueueState.publicParties.find(function(x) { return x.id == self.partyId })
  if (!party){ return }
  this.socket.emit("retrieve-party", party.users);
}

User.prototype.removeFromQueue = function() {
  var self = this;
  this.roles.forEach(function(role, index){
    QueueState.queues.find(function(queue) {
      if (queue.id == self.queueId) {
        queue.roles[role].splice(queue.roles[role].indexOf(self), 1);
      }
    });
  });
}

User.prototype.partyMessage = function(msg) {
  var message = {
    user : {
      ign: this.ign
    },
    time: Date.now(),
    text: msg.text
  };
  this.socket.nsp.to(this.partyId).emit('party-message', message);
}

User.prototype.disconnect = function() {
  this.removeFromQueue();
}

module.exports = User;
