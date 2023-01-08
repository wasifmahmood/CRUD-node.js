
const twilio = require('twilio');
const accountSid = 'AC09ad87a684c974e7f6c5f406ee561d0b';
const authToken = 'fcff405f09ebe0eee1d45b0ecaca5636';
const client = twilio(accountSid, authToken);

//     // client.messages
//     // .create({
//     //    body: 'Hello from Twilio!',
//     //    from: +18507539761,
//     //    to: +923013963678,
//     //  })
//     // .then(message => console.log(message.sid));


//   module.exports={
//     client
//   }