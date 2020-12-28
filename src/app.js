/*
* java-script-simple-mqtt-device
*
* Copyright (C) 2020 Akamai Technologies, Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*/

const MqttOptionsProvider = require('./mqtt-options-provider');
const MqttClient = require('./mqtt-client');
const SandboxConfigParser = require('./sandbox-config-parser');
const Utils = require('./utils');

const publishSubscribeExample = (options, topic, qos) => {
    const mqttClient = new MqttClient();
    let lastMessage = '';

    // waits for message and publish again
    const onMessage = (topic, content, timeOfDelivery) => {
        if (String(content) === lastMessage) {
            console.log(`Received message on topic: ${topic}, content: ${content} at ${timeOfDelivery}`);
            publishMessage(); // message loop
        }
    };

    const getMessageInput = async () => {
        const message = await Utils.getInput('Type message to send or X to disconnect: ');
        if (String(message).toLowerCase() === 'x') {
            mqttClient.disconnect();
        }
        return message;
    };

    const publishMessage = () => {
        getMessageInput().then((message) => {
            lastMessage = message; // store the last message for reference

            mqttClient.publish(topic, lastMessage, qos).then((publishTime) => {
                console.log(`Published in ${publishTime}ms`);
            }).catch(err => {
                console.log(err.message);
            });
        });
    };

    // connecting to the Broker
    mqttClient.connect(options).then((connectionTime) => {
        console.log(`Connected in ${connectionTime}ms`);

        // subscribe
        mqttClient.subscribe(topic, qos, onMessage).then((subscriptionTime) => {
            console.log(`Subscribed in ${subscriptionTime}ms`);

            // publish after >1s of bake time needed for the new subscription to be propagated globally
            Utils.wait(2000).then(() => {
                publishMessage();
            });
        });
    });
};

(async () => {
    const parser = new SandboxConfigParser();
    const config = parser.getConfig();

    const optionsProvider = new MqttOptionsProvider();
    const options = await optionsProvider.sandboxOptionsProvider(config);

    const topic = config.topicPrefix + 'data'; // sandbox's configuration allows to publish to 'data' path
    const qos = await Utils.getInput('QoS level: ', parseInt);

    publishSubscribeExample(options, topic, qos);
})();




