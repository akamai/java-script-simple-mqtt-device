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

const mqtt = require('mqtt');

module.exports = class MqttClient {

    constructor() {
        this._client = null;
    }

    connect(config) {
        const start_time = new Date();

        // connection string
        const URL = `${config.protocol}://${config.host}:${config.port}`;

        // connect
        const options = {
            clientId: config.clientId, // must be the same as provided in token
            servername: config.host, // ! for SNI connections we need to provide a servername in the options,
            username: config.username, // passing username is not required by Akamai Broker
            password: config.password, // sending JWT token as password for authentication
            rejectUnauthorized: true
        };

        return new Promise((resolve, reject) => {
            try {
                this._client = mqtt.connect(URL, options);
                this._client.on('connect', () => {
                    resolve(new Date() - start_time);
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    publish(topic, message, qos) {
        const start_time = new Date();

        return new Promise((resolve, reject) => {
            this._client.publish(topic, message, {qos}, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(new Date() - start_time);
            });
        });
    }

    subscribe(topic, qos, onMessage = () => {}) {
        const start_time = new Date();

        this._client.on('message', (topic, message) => {
            onMessage(topic, message, new Date().toLocaleString());
        });

        return new Promise((resolve, reject) => {
            this._client.subscribe(topic, {qos}, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(new Date() - start_time);
            });
        });
    }

    disconnect() {
        this._client.end(true, false);
        return this._client.disconnecting;
    }
};
