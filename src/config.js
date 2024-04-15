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
        "clientInformation": {
            "google": {
                "clientId": "885997680869-p7e8e3vhgi68k766hstdd845ot6g0ccc.apps.googleusercontent.com",
                "authBaseURL": "https://accounts.google.com/o/oauth2/v2/auth",
                "scope": "openid profile email https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read",
                "redirectUriBase": "http://localhost:8001/",
                "redirectUriOffset": "google-signin-redirect",
                "tokenExchangeUriBase": "http://localhost:8004/",
                "tokenExchangeUriOffset": "google-token-exchange"
            },
            "github": {
                "clientId": "de7c0a9270d9da772472",
                "authBaseURL": "https://github.com/login/oauth/authorize",
                "scope": "user:email",
                "redirectUriBase": "http://localhost:8001/",
                "redirectUriOffset": "github-signin-redirect",
                "tokenExchangeUriBase": "http://localhost:8004/",
                "tokenExchangeUriOffset": "github-token-exchange" 
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
