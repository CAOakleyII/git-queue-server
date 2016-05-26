var GameModes = require('../enums/gameModes');
var Regions = require('../enums/regions');
var Platforms = require('../enums/platforms')
var Guid = require('guid');

function Queue() {
  this.partySize = 5;
  this.gamemode = GameModes.Conquest;
  this.region = Regions.NA;
  this.platform = Platforms.PC;
  this.ranked = false;
  this.id = Guid.raw();
  this.roles = [];
  this.roles["ADC"] = [];
  this.roles["Support"] = [];
  this.roles["Jungle"] = [];
  this.roles["Mid"] = [];
  this.roles["Solo"] = [];

}

module.exports = Queue;
