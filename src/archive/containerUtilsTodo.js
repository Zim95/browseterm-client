export const chooseSocketSSHContainer = function() {
    // Learn about consistent hashing
}


const dockerSocketSSHHandler = async function() {
    try {
        if(this.socketSSHContainers.length === 0) {
            const createSocketSSHContainerResponse = await createSocketSSHContainer();
            await startSocketSSHContainer(createSocketSSHContainerResponse);
        }
    } catch (error) {
        throw new Error("Docker Socket SSH Handler", error);
    }   
}


export const addSocketSSHContainer = async function() {
    /*
        This function will be triggered everytime a new container is created
        by the form.
        If runtime is docker:
            if length of socketSSHContainers is 0:
                createSocketSSHContainer, startSocketSSHContainer
        If runtime is kubernetes:
            number_of_SSHContainers = length(number of containers)
            threshold = 5
            number_of_SSHSockets = (number_of_SSHContainers // threshold) + 1
            if length(SSHSockets) < number_of_SSHSockets:
                required_SSHSockets = number_of_SSHSockets - length(SSHSockets)
                for i in range(required_SSHSockets):
                    createSocketSSHContainer, startSocketSSHContainer
    */
    // get runtime: Not actual
    const socketSSHHandler = {
        "docker": dockerSocketSSHHandler,
        "kubernetes": kubernetesSocketSSHHandler 
    }
    const pingResponse = await this.containerUtils.ping();
    const runtime = pingResponse["runtime"];

}