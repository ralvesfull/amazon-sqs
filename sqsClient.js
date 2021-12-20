const AWS = require('aws-sdk');

async function  sendMessage(message) {
    AWS.config.update({ region: process.env.AWS_REGION });
    const sqs = new AWS.SQS();
     await sqs.sendMessage({
        MessageBody: JSON.stringify(message),
        QueueUrl: `${process.env.AWS_QUEUE_URL}`,
        MessageGroupId: `${process.env.AWS_MESSAGE_GROUP}`
    }).promise();

    var params = {
        QueueUrl: `${process.env.AWS_QUEUE_URL}`,
        VisibilityTimeout: 600 // 10 min wait time for anyone else to process.
    };
    
    await sqs.receiveMessage(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
          } else {
            if (!data.Message) { 
              console.log('Nothing to process'); 
              return;
            }
            const orderData = JSON.parse(data.Messages[0].Body);
            console.log('Order received', orderData);
            // orderData is now an object that contains order_id and date properties
            // Lookup order data from data storage
            // Execute billing for order
            // Update data storage
            // Now we must delete the message so we don't handle it again
            
            // // const deleteParams = {
            // //   QueueUrl: queueUrl,
            // //   ReceiptHandle: data.Messages[0].ReceiptHandle
            // // };
            // // sqs.deleteMessage(deleteParams, (err, data) => {
            // //   if (err) {
            // //     console.log(err, err.stack);
            // //   } else {
            // //     console.log('Successfully deleted message from queue');
            // //   }
            // // });
          }   
    });
}

module.exports = { sendMessage }