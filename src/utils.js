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

const readline = require('readline');
const https = require('https');

module.exports = class Utils {

    static getInput(question, parse = arg => arg) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise(resolve => rl.question(question, answer => {
            resolve(parse(answer));
            rl.close();
        }));
    }

    static wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static doRequest(options, data) {
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let response = '';

                res.on('data', (chunk) => {
                    response += chunk;
                });

                res.on('end', () => {
                    console.log(`Request status code: ${res.statusCode}`);
                    resolve(JSON.parse(response));
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            req.write(data);
            req.end();
        });
    }

};
