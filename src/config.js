const configuration = {
    "development": {
        "containerAPI": {
            "urls": {
                "baseURL": "http://localhost:8003/",
                "createContainerOffset": "create",
                "startContainerOffset": "start",
                "stopContainerOffset": "stop",
                "deleteContainerOffset": "delete",
                "beaconOffset": "beacon",
            },
            "headers": {
                "Content-Type": "application/json"
            }
        },
        "dataApi": {
            "urls": {
                "baseURL": "http://localhost:8004/",
                "imageOptions": "image_options"
            },
            "headers": {
                "Content-Type": "application/json"
            }
        },
    },
    "production": {
        "containerAPI": {
            "urls": {
                "baseURL": "http://localhost:8003/",
                "createContainerOffset": "create",
                "startContainerOffset": "start",
                "stopContainerOffset": "stop",
                "deleteContainerOffset": "delete",
                "beaconOffset": "beacon",
            },
            "headers": {
                "Content-Type": "application/json"
            }
        },
        "dataApi": {
            "urls": {
                "baseURL": "http://localhost:8004/",
                "imageOptions": "image_options"
            },
            "headers": {
                "Content-Type": "application/json"
            }
        },
    }
}

const loadConfig = () => {
    const env_configuration = process.env.NODE_ENV;
    if(configuration.hasOwnProperty(env_configuration)) {
        return configuration[env_configuration];
    }
    return configuration["development"];
};
const config = loadConfig();

export default config;
