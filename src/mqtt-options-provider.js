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

const fs = require('fs');
const Utils = require("./utils");
const SandboxAuth = require("./sandbox-auth");
const {MQTT_CONNECTION_OPTIONS, getClientIdSuffix} = require('./consts');

module.exports = class MqttOptionsProvider {

    async sandboxOptionsProvider(config) {

        const username = await Utils.getInput('Username: ');
        const password = await Utils.getInput('Password: ');

        const clientId = config.clientIdPrefix + getClientIdSuffix(5, 10); // clientId unique to avoid session takeover
        const token = await SandboxAuth.requestForToken(config.mqttHost, clientId, username, password);

        const options = MQTT_CONNECTION_OPTIONS;
        options.host = config.mqttHost;
        options.clientId = clientId;
        options.password = token; // obtained token is a password for the MQTT client
        options.username = username; // username is optional, can be any string
        return options;
    }

    async staticConfigProvider(filename) {
        let buffer = fs.readFileSync(filename);
        return JSON.parse(String(buffer));
    }

}