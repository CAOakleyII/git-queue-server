var Queue = require('./queue');

function User(socket) {
  this.socket = socket;

  this.socket.on('join-queue', this.joinQueue.bind(this));
  this.socket.on('disconnect', this.leaveQueue.bind(this));

}

User.prototype.joinQueue = function(data) {
  var self = this;
  data.roles.forEach(function(role, index){
     Queue[data.gamemode][role].push(self);
  });
  this.ign = data.ign;
  this.roles = data.roles;
}

User.prototype.leaveQueue = function(data) {
  console.log(data);
}

module.exports = User;
