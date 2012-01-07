/*
 * Copyright 2012 Matthias Wessendorf.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
    //{ defaultExchangeName : 'demo_exchange'}
    { defaultExchangeName : ''}
   
);

amqpconnection.on('ready', setup);

function setup() {
    // declare an exchange; used to publish messages
    var exchange = amqpconnection.exchange('demo_exchange', {type: 'fanout', durable: false}, function() {
        
        // Declaring a queue with a bogus name
        var queue = amqpconnection.queue('my-queue', {durable: false, exclusive: true}, function() {
    
            // subscribe to receive messages from the queue
            queue.subscribe(function(msg) {

                // the message object (printing its data/body field):
                console.log("Message object: " + msg.data);       
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