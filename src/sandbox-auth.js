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

const Utils = require('./utils');

module.exports = class SandboxAuth {

    static async requestForToken(host, clientId, username, password) {
        console.log(`Requesting for token on host: ${host}, username: ${username}, password: ${password}`);

        const data = JSON.stringify({
            username,
            password,
            clientId
        });

        const options = {
            hostname: host,
            path: '/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let response = await Utils.doRequest(options, data).catch(err => {
                throw new Error('Cannot get token, please try again. ' + err);
            });
            if (!response['token']) {
                console.error(response['message']);
                process.exit(1);
            }
            return response['token'];
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

};
