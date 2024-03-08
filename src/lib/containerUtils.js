import { Authorizer } from "./authUtils";
import { RequestMaker } from "./appUtils";
// import config from "../config";


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

        // headers
        this.headers = config.containerAPI.headers;
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

    startContainer() {
        /*
        Starts container by making a request.
        :params:
        :returns:

        Author: Namah Shrestha
        */
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



export const addContainerToContainerDataMap = function(containerResponse) {
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


export const addSocketSSHUserMapping = function(
    containerName,
    containerUsername,
    containerPassword
) {
    /*
        Add container username password to 
        socketSSHUserMapping.
        We will pick these information later.

        :params:
            :containerName: Name of the container.
            :containerUsername: Username of the container.
            :containerPassword: Password of the container.
        :returns: Null

        Author: Namah Shrestha
    */
    this.socketSSHUserMapping[containerName] = {
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
        addSocketSSHUserMapping.call(
            this,
            containerName,
            userName,
            containerFormData["container-password"]
        );
    } catch(error) {
        throw new Error("Create Container Error", error);
    }
}


export class ContainerManager {
    constructor(config) {
        this.containerUtils = new ContainerUtils(config);
        this.authorizer = new Authorizer(config); // The authorizer utils.
        this.containerDataMap = {}; // Stores active containers created by the user.
        this.socketSSHUserMapping = {}; // Stores the socket ssh user mapping.
    }
}
