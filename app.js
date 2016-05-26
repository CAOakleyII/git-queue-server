var QueueEngine = require('./common/queueEngine');
var PORT = 6543;

QueueEngine.start(PORT);
console.log('Queue Engine started on port - ', PORT);
