const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv = require('dotenv');
const TrustedContact = require('./models/TrustedContact');
const ActivityLog = require('./models/ActivityLog');
const User = require('./models/User');

dotenv.config({ path: './.env' });

async function runTest() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected DB');
  
  const user = await User.findOne({});
  if(!user) {
    console.log("No user found to test");
    process.exit(0);
  }
  
  try {
    const contact = await TrustedContact.create({
      user: user._id,
      name: 'Test Contact',
      phone: '1234567890',
      relation: 'Friend'
    });
    console.log('Contact created successfully:', contact);
    
    const log = await ActivityLog.create({ 
      user: user._id, 
      action: 'add_contact', 
      description: `Added Test Contact` 
    });
    console.log('Log created successfully:', log);
    
  } catch (err) {
    console.error('Test Failed:', err);
  }
  
  process.exit(0);
}
runTest();
