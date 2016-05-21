function Queue() {

  this.normalConquest = [];
  this.normalConquest["ADC"] = [];
  this.normalConquest["Support"] = [];
  this.normalConquest["Jungle"] = [];
  this.normalConquest["Mid"] = [];
  this.normalConquest["Solo"] = [];

  this.rankedConquest = [];
  this.rankedConquest["ADC"] = [];
  this.rankedConquest["Support"] = [];
  this.rankedConquest["Jungle"] = [];
  this.rankedConquest["Mid"] = [];
  this.rankedConquest["Solo"] = [];

  this.parties = [];
}

module.exports = exports = new Queue();
