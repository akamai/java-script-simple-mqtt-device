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

const fs = require('fs');
const {DEVREL_CONFIG_LOCATION} = require('./consts');

module.exports = class SandboxConfigParser {

    getConfig() {
        const file = fs.readFileSync(DEVREL_CONFIG_LOCATION);
        return this.parseContentToJson(String(file));
    }

    parseContentToJson(content) {
        const lines = content.toLowerCase().split('\n');
        const res = {
            mqttHost: '',
            topicPrefix: '',
            clientIdPrefix: ''
        };
        for (let line of lines) {
            let split = line.replace(/\s/g, '').split('=');
            switch (split[0]) {
                case 'mqtt.host':
                    res.mqttHost = split[1];
                    break;
                case 'topic.prefix':
                    res.topicPrefix = split[1];
                    break;
                case 'client.id.prefix':
                    res.clientIdPrefix = split[1];
                    break;
                default:
                    break;
            }
        }
        return res;
    }

};


