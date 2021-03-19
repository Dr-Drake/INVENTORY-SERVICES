/** Function to connect to rabbitmq serever via amqp */
const amqp = require("amqplib");
var queue = "usercreated";
var isconnected = false;
var channel = null;

function initRabbitMq(){

    // Create connection to amqp server
    amqp.connect("amqp://localhost?hearbeat=60", (err0, conn)=>{
        if (err0){
            setTimeout(function() { initRabbitMq(); }, 5000);
            console.log("Rabit Mq is down Will Retry after 5 seconds");
            isconnected=false;
            return;
        }
        console.log("Successfully connected to rabbitmq server");

        // Create channel in confirmation mode
        conn.createConfirmChannel((err1, ch)=>{
            if (err1){
                setTimeout(function() { initRabbitMq(); }, 5000);
                console.log("Rabit Mq is down Will Retry after 5 seconds");
                isconnected=false;
                return;
            }
        console.log("Channel created in confirmation mode");
        isconnected = true;

        // Ensure a queue for messages
        // Ensure that the queue is not deleted when server restarts (durable)
        ch.assertQueue(queue, {durable: true}); 
        channel = ch;

        conn.on('error',function(err){
            initRabbitMq();
            console.log(err);
        });
        })
    })
}

/**
 * 
 * @param {Object} msg 
 */
function sendMail(msg){
    if (channel){
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {}, (err, ok)=>{
            if (err){
                console.warn("Message was nacked");
                return
            }

            console.warn("Message was acked");
        })
    }
}