const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TrustedContact = require('./backend/models/TrustedContact');
const ActivityLog = require('./backend/models/ActivityLog');
const User = require('./backend/models/User');

dotenv.config({ path: './backend/.env' });

async function runTest() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected DB');
  
  // get a user
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
    console.log('Contact created', contact);
    
    const log = await ActivityLog.create({ 
      user: user._id, 
      action: 'add_contact', 
      description: `Added Test Contact` 
    });
    console.log('Log created', log);
    
  } catch (err) {
    console.error('Test Failed:', err);
  }
  
  process.exit(0);
}
runTest();
