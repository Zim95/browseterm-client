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
                "pingOffset": "ping"
            },
            "headers": {
                "Content-Type": "application/json"
            }
        },
        "dataApi": {
            "urls": {
                "baseURL": "http://localhost:8004/",
                "imageOptions": "image_options",
                "me": "@me"
            },
            "headers": {
                "Content-Type": "application/json"
            }
        },
        "authAPI": {
            "authServerBaseURL": "http://localhost:9001/",
            "authEndpointOffset": "authorize",
            "tokenEndpointOffset": "token",
        },
        "clientInformation": {
            "clientId": "oauth-client-1",
            "clientSecret": "oauth-client-secret-1",
            "redirectURIs": ["http://localhost:8001/"],
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
                "pingOffset": "ping"
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
        "authAPI": {
            "authServerBaseURL": "http://localhost:9001/",
            "authEndpointOffset": "authorize",
            "tokenEndpointOffset": "token",
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
