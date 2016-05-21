var Queue = require('./queue');

function PartyEngine() {

}

PartyEngine.prototype.setUpParty = function(party) {
  party.users.forEach(function(user, i){
    user.partyId = party.id;
    user.socket.join(party.id);
  });
}


module.exports = exportrs = new PartyEngine();
