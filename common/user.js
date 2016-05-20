var Queue = require('./queue');

function User(socket) {
  this.socket = socket;
  this.roles = [];
  this.ign = "";
  this.gamemode = "";

  this.avatarSrc = "https://hydra-media.cursecdn.com/smite.gamepedia.com/e/ea/Icon_Player_SmiteCommunity.png";
  this.socket.on('join-queue', this.joinQueue.bind(this));
  this.socket.on('disconnect', this.disconnect.bind(this));

}

User.prototype.joinQueue = function(data) {
  var self = this;
  data.roles.forEach(function(role, index){
     Queue[data.gamemode][role].push(self);
  });
  this.ign = data.ign;
  this.roles = data.roles;
  this.gamemode = data.gamemode;
}

User.prototype.leaveQueue = function() {
  var self = this;
  this.roles.forEach(function(role, index){
    if(Queue[self.gamemode][role].indexOf(self) != -1) {
      Queue[self.gamemode][role].splice(Queue[self.gamemode][role].indexOf(self), 1);
    }
  })
}

User.prototype.disconnect = function() {
  this.leaveQueue();
}

module.exports = User;
