const config = {
    "DevAPIRequestsConfig": {
        "containerAPI": {
            "urls": {
                "baseURL": "http://localhost:8002/",
                "createContainerOffset": "create",
                "startContainerOffset": "start",
                "stopContainerOffset": "stop",
                "deleteContainerOffset": "delete"
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
    "ENVConfig": {
        "containerEnv": {
            "supportedImages": {
                "ubuntu": "zim95/ubuntu:latest"
            }
        }
    }
}

export default config;