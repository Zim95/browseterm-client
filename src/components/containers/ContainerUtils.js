/*
    This is the ContainerUtils file. All utility methods that are common
    within container operations are stored here.

    Author: Namah Shrestha
*/

// module imports
import config from "../../config";
import { RequestMaker } from "../../appUtils";


class ContainerManager {
    /*
        Create, Start, Stop, Delete Containers by making requests to the Backend API.

        Author: Namah Shrestha
    */
    constructor() {
        /*
            Initialize the parameters as per container API.
            - Initialize: create, start, stop, delete, beacon URLs.
            - Initialize: method.
            - Initialize: headers. Load token from localStorage and put it in headers.
        
            Author: Namah Shrestha
        */

        // urls
        this.baseUrl = config.containerAPI.urls.baseURL;
        this.createUrl = this.baseUrl + config.containerAPI.urls.createContainerOffset;
        this.startUrl = this.baseUrl + config.containerAPI.urls.startContainerOffset;
        this.stopUrl = this.baseUrl + config.containerAPI.urls.stopContainerOffset;
        this.deleteUrl = this.baseUrl + config.containerAPI.urls.deleteContainerOffset;
        this.beaconUrl = this.baseUrl + config.containerAPI.urls.beaconOffset;

        // methods
        this.method = "POST";

        //headers
        this.headers = config.containerAPI.headers;
        /*
            TODO: Get the token from localStorage and put it in headers.
        */
    }

    createContainer = async(
        imageName,
        containerName,
        containerNetwork,
        publishInformation=null,
        environment=null
    ) => {
        /*
            The createContainer method. Makes a POST request to rest container deployment.
            :params:
                imageName: String: Name of the image to use.
                containerName: String: Name of the container being created.
                containerNetwork: String: Name of the network in which the container
                                          will be created.
                publishInformation: JSON | null: Port mapping for the container.
                                                 Eg: {'8000/tcp': 8000}.
                environment: JSON | null: Environment Variables.
                                          Eg: {'SSH_PASSWORD': '1234'}

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
            this.method, this.createUrl, body=createContainerBody, headers=this.headers
        );

        try{
            const response = createRequestMaker.callOnce();
            return response;
        } catch(error) {
            throw new Error("Create Container Error", error);
        }
    };
}


export const containerManager = new ContainerManager();
