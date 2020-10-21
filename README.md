# IoT Edge Connect
Java Script MQTT client example.

* [Overview](#overview)

* [Get started](#get-started)

* [Publish and Subscribe](#publish-and-subscribe)
	
* [Notice](#notice)

# Overview 

This is where some sample MQTT.js client (https://www.npmjs.com/package/mqtt/) program shows how to connect to IoT Edge Connect.

# Get started 

In order to start using `java-script-simple-mqtt-device` MQTT client, add `configuration.txt` file to `/dev` folder.
It should have the following syntax: 

```
mqtt.host = <your-domain-name>
topic.prefix = <topic-prefix>
client.id.prefix = <client-id-prefix>
```

**Note:** You should receive a configuration file from [IoTDevelopers@akamai.com](mailto:IoTDevelopers@akamai.com), after requesting a Sandbox.

# Publish and Subscribe

You need NodeJS 12.x or newer to run the example. The recommended way to run this project is using command line:
```bash
npm install
node src/app.js
```

Upon running, you will be prompted to provide `username` and `password` to your Sandbox. 
Look for the details in the email received from [IoTDevelopers@akamai.com](mailto:IoTDevelopers@akamai.com), after requesting a Sandbox.

Sample users received in an email:
```
Device users: user_1, user1_2, user1_3, user1_4
User's default password: secret
```

**Note:** Default password is the same for all the device users.

# Notice
Copyright © 2020 Akamai Technologies, Inc.

Your use of Akamai's products and services is subject to the terms and provisions outlined in [Akamai's legal policies](https://www.akamai.com/us/en/privacy-policies/).
