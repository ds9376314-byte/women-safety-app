const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const ActivityLog = require('./models/ActivityLog');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shevora').then(async () => {
  const logs = await ActivityLog.find({});
  console.log('Total Activity Logs:', logs.length);
  console.log(logs.slice(0, 5));
  process.exit();
});
