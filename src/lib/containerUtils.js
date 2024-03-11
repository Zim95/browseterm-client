import { Authorizer } from "./authUtils";
import { RequestMaker, getRandomNumberString } from "./appUtils";


export class ContainerUtils {
    /*
        Container Utility functions.

        Author: Namah Shrestha
    */

    constructor(config) {
        /*
            Initialize the parameters.
            :params:
                :config: The configuration -> dev/prod.
            :returns: null

            Author: Namah Shrestha
        */ 

        // URLS
        this.baseURL = config.containerAPI.urls.baseURL;
        this.createUrl = this.baseURL + config.containerAPI.urls.createContainerOffset;
        this.startUrl = this.baseURL + config.containerAPI.urls.startContainerOffset;
        this.stopUrl = this.baseURL + config.containerAPI.urls.stopContainerOffset;
        this.deleteUrl = this.baseURL + config.containerAPI.urls.deleteContainerOffset;
        this.beaconUrl = this.baseURL + config.containerAPI.urls.beaconOffset;
        this.pingUrl = this.baseURL + config.containerAPI.urls.pingOffset;

        // headers
        this.headers = config.containerAPI.headers;
    }

    addHeader = (headerKey, headerValue) => {
        this.headers[headerKey] = headerValue;
    };

    overwriteHeaders = (headers) => {
        this.headers = headers;
    }

    ping = async () => {
        const pingRequestMaker = new RequestMaker(
            "GET", this.pingUrl, null, this.headers
        );
        try {
            const response = await pingRequestMaker.callOnce();
            return response;
        } catch(error) {
            throw new Error("Ping Error", error);
        }
    }

    createContainer = async (
        imageName,
        containerName,
        containerNetwork,
        publishInformation=null,
        environment=null
    ) => {
        /*
        Will create container based on container options.
        :params:
            imageName: String: Name of the image to use.
            containerName: String: Name of the container being created.
            containerNetwork: String: Name of the network in which the container
                                        will be created.
            publishInformation: JSON | null: Port mapping for the container.
                                                Eg: {'8000/tcp': 8000}.
            environment: JSON | null: Environment Variables.
                                        Eg: {'SSH_PASSWORD': '1234'}

        :returns: object: Response of the container creation request.

        Author: Namah Shrestha
        */
        let createContainerBody = {
            "image_name": imageName,
            "container_name": containerName,
            "container_network": containerNetwork
        };
        if(publishInformation !==  null) {
            createContainerBody["publish_information"] = publishInformation;
        }
        if(environment !== null) {
            createContainerBody["environment"] = environment;
        }

        const createRequestMaker = new RequestMaker(
            "POST", this.createUrl, createContainerBody, this.headers
        );
        try{
            const response = await createRequestMaker.callOnce();
            return response;
        } catch(error) {
            throw new Error("Create Container Error", error);
        }
    }

    startContainer = async(
        containerIds,
        containerNetwork,
        containerName = null
    ) => {
        /*
        Starts container by making a request.
        :params:
            containerIds: List of Ids of the container that we want to start.
                NOTE: A single container may have multiple ids.
                      In k8s, a single container may have many services.
                      In such cases we will have multiple ids.
                      They all belong to a single container.
            containerNetwork: Network of these containers.
            containerName: Name of the container. Can be left null for start.
        :returns: null

        Author: Namah Shrestha
        */
        let startContainerBody = {
            "container_ids": containerIds,
            "container_network": containerNetwork
        };
        if(containerName !== null) {
            startContainerBody["container_name"] = containerName;
        }
        const startRequestMaker = new RequestMaker(
            "POST", this.startUrl, startContainerBody, this.headers
        );

        try{
            const response = await startRequestMaker.callOnce();
            return response;
        } catch(error) {
            throw new Error("Start Container Error", error);
        }
    }

    startContainerUntilSucess = async (
        containerIds,
        containerNetwork,
        containerName = null,
        maxAttempts = 10,
        timeout = 2000
    ) => {
        /*
        Starts container by making a request.
        :params:
            containerIds: List of Ids of the container that we want to start.
                NOTE: A single container may have multiple ids.
                      In k8s, a single container may have many services.
                      In such cases we will have multiple ids.
                      They all belong to a single container.
            containerNetwork: Network of these containers.
            containerName: Name of the container. Can be left null.
            maxAttempts: Max number of times the success attempts are made. Default 10.
            timeout: Timeout between attempts in milliseconds. Default 2000.
        :returns: null

        Author: Namah Shrestha
        */
        let startContainerBody = {
            "container_ids": containerIds,
            "container_network": containerNetwork
        };
        if(containerName !== null) {
            startContainerBody["container_name"] = containerName;
        }
        const startRequestMaker = new RequestMaker(
            "POST", this.startUrl, startContainerBody, this.headers
        );

        try{
            const response = await startRequestMaker.callUntilSuccess(maxAttempts, timeout);
            return response;
        } catch(error) {
            throw new Error("Start Container Error", error);
        }
    }

    stopContainer() {
        /*
        Stops container by making a request.
        :params:
        :returns:

        Author: Namah Shrestha
        */
    }

    deleteContainer() {
        /*
        Deletes container by making a request.
        :params:
        :returns:

        Author: Namah Shrestha
        */
    }
}


// ================================= Container Creation Forms ================================
const addContainerToContainerDataMap = function(containerResponse) {
    /*
        Add container to the containerDataMap state.
        Which stores all the active containers created by the user.
        :params:
            :containerResponse: object: the container response from create container.
        :returns: null

        This needs to be used with a call function.

        Author: Namah Shrestha
    */
    containerResponse.map((container) => {
        if(
            this.containerDataMap.hasOwnProperty(container["container_name"])
        ) {
            this.containerDataMap[container["container_name"]]["ids"].push(
                container["container_id"].slice(0, 4));
            this.containerDataMap[container["container_name"]]["full_ids"].push(
                container["container_id"]);
        } else {
            this.containerDataMap[container["container_name"]] = {
                'name': container["container_name"],
                'image': container["container_image"],
                'ips': [],
                'ids': [container["container_id"].slice(0, 4)],
                'full_ids': [container["container_id"]],
                'network': container["container_network"]
            }
        }
    });
}


const addContainerUserInfoMapping = function(
    containerName,
    containerUsername,
    containerPassword
) {
    /*
        Add container username password to 
        containerUserInfoMapping.
        We will pick these information later.

        :params:
            :containerName: Name of the container.
            :containerUsername: Username of the container.
            :containerPassword: Password of the container.
        :returns: Null

        Author: Namah Shrestha
    */
    this.containerUserInfoMapping[containerName] = {
        "username": containerUsername,
        "password": containerPassword
    };
}


export const createContainerBasedOnFormData = async function(containerFormData) {
    /*
        Create container from container form data.
        :params:
            :containerFormData: Container Form Data from the container form.
        :returns: null.

        This needs to be used with a call function.

        Author: Namah Shrestha
    */
    const userName = this.authorizer.getUser()["userName"];
    const containerName = userName + "_" + containerFormData["container-name"];
    const containerNetwork = userName + "_network";
    try {
        const createContainerResponse = await this.containerUtils.createContainer(
            containerFormData["image-name"],
            containerName,
            containerNetwork,
            null,
            {
                "SSH_PASSWORD": containerFormData["container-password"],
            }
        );
        addContainerToContainerDataMap.call(this, createContainerResponse);
        addContainerUserInfoMapping.call(
            this,
            containerName,
            userName,
            containerFormData["container-password"]
        );
    } catch(error) {
        throw new Error("Create Container Error", error);
    }
}
// ================================= Container Creation Forms ================================


// ================================= SSH Socket Containers ====================================

/*
    In docker, only one of these containers can run on port 8000.
    On k8s, multiple of these can run. So in k8s, we can select which pod we connect to.
    We will need to build that logic here.
    We do not want to use load balancing as it adds an additional layers.
*/


const startSocketSSHContainer = async function(container) {
    try {
        const startContainerResponse = await this.containerUtils.startContainerUntilSucess(
            [container["container_id"]],
            container["container_network"],
            container["container_name"]
        );
        const ssContainer = {
          ...startContainerResponse[0],
          ...{
            "container_network": container["container_network"],
            "container_port": 8000,
          }
        };
        // only one for now.
        this.socketSSHContainer = ssContainer;
    } catch (error) {
      console.error("Error while starting container", error);
    }
}


const createSocketSSHContainer = async function() {
    /*
        Creates SocketSSHContainer.
        The container which will serve as websocket interface for our SSH containers.
        :params: None
        :returns: None

        Needs to be called by a call method.

        Author: Namah Shrestha
    */
    const userName = this.authorizer.getUser()["userName"];
    const containerName = userName + "_socket_ssh_container" + getRandomNumberString();
    const containerNetwork = userName + "_network";
    try {
        const createContainerResponse = await this.containerUtils.createContainer(
            "zim95/socket-ssh:latest",
            containerName,
            containerNetwork,
            {
                "8000/tcp": 8000
            },
            null
        );
        // there will only be one container for socketSSH.
        // If we want to create multiple, we will just keep repeating this step.
        // So always a single container.
        return createContainerResponse[0];
    } catch (error) {
        console.error("Error create socket ssh", error);
    }
}


export const addSocketSSHContainer = async function() {
    try {
        const createSocketSSHContainerResponse = await createSocketSSHContainer.call(this);
        await startSocketSSHContainer.call(this, createSocketSSHContainerResponse);
    } catch (error) {
        throw new Error("Add Socket SSH Handler", error);
    }   
}

// ================================= SSH Socket Containers ====================================


// ================================= Container Manager ========================================
export class ContainerManager {
    constructor(config) {
        this.containerUtils = new ContainerUtils(config);
        this.authorizer = new Authorizer(config); // The authorizer utils.
        this.containerDataMap = {}; // Stores active containers created by the user.
        this.containerUserInfoMapping = {}; // Stores the user info mapping for containers.

        // socket ssh containers
        this.socketSSHContainer = null;
        this.socketSSHContainers = [];
    }
}
// ================================= Container Manager ========================================