// java-script-simple-mqtt-device
//
// Copyright (C) 2020 Akamai Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
//
// Thanks to The Eclipse Paho project team
// Source code home: https://github.com/eclipse/paho.mqtt.python//getting-started

const MqttClient = require('./mqtt-client');
const SandboxConfigParser = require('./sandbox-config-parser');
const SandboxAuth = require('./sandbox-auth');
const Utils = require('./utils');
const {MQTT_CONNECTION_OPTIONS, getClientIdSuffix} = require("./consts");

const onMessage = function (topic, message, timeOfDelivery) {
    console.log('Received message on topic: %s, message: %s at %s', topic, message, timeOfDelivery);
};

(async function example() {
    const parser = new SandboxConfigParser();
    const config = parser.getConfig();

    const username = await Utils.getInput("Username: ");
    const password = await Utils.getInput("Password: ");
    const token = await SandboxAuth.requestForToken(config.mqttHost, username, password);

    const options = MQTT_CONNECTION_OPTIONS;
    options.host = config.mqttHost; // sandbox's host
    options.clientId = config.clientIdPrefix + getClientIdSuffix(5, 10); // clientId unique to avoid session takeover
    options.password = token; // obtained token is a password for the MQTT client
    options.username = username; // username is optional, can be any string

    const topic = await Utils.getInput("Topic path: ");
    const message = await Utils.getInput("Message to send: ");
    const qos = await Utils.getInput("QoS level: ");

    // connecting to the Broker
    const mqttClient = new MqttClient();
    mqttClient.connect(options).then((connectionTime) => {
        console.log('Connected in %sms', connectionTime);

        // subscribe
        mqttClient.subscribe(config.topicPrefix + topic, qos, onMessage).then((subscriptionTime) => {
            console.debug('Subscribed in %sms', subscriptionTime);

            // publish after >2s of bake time needed for the new subscription to be propagated globally
            Utils.wait(2000).then(() => {
                mqttClient.publish(config.topicPrefix + topic, message, qos).then((publishTime) => {
                    console.log('Published in %sms', publishTime);
                });
            });
        });
    });

})();


