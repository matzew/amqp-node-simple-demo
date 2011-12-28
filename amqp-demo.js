var http = require('http');
var amqp = require('amqp');
var URL = require('url');

// Creates connection to an AMQP broker,
// like Apache QPid or RabbitMQ
var amqpconnection = amqp.createConnection(
    { host: 'localhost'
    , port: 5672
    , login: 'guest'
    , password: 'guest'
    , vhost: '/'
    },
    //{ defaultExchangeName : 'amqpExchange'}
    { defaultExchangeName : ''}
   
);

amqpconnection.on('ready', setup);

function setup() {
    // declare an exchange; used to publish messages
    var exchange = amqpconnection.exchange('amqpExchange', {type: 'fanout', durable: false}, function() {
        
        // Declaring a queue with a bogus name
        var queue = amqpconnection.queue('my-queue', {durable: false, exclusive: true}, function() {
    
            // subscribe to receive messages from the queue
            queue.subscribe(function(msg) {
                // the message object, can have different fields...
                console.log("Message object: " + msg);       
            });

            // bind the queue to an exchange, in order to receive messages
            queue.bind(exchange.name, '');
        });

        // callback when queue binding was successful...
        queue.on('queueBindOk', function() {
            console.log("BIND OK....");
        });
    });
}