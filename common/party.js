var Guid = require('guid');

function Party(id){
  if (id === undefined) {
    id = Guid.raw();
  }
  this.id = id;
  this.users = [];
}

module.exports = Party;
