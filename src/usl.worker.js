const uslWorkerCode = () => {
    function uslRequest() {
        fetch(
            "http://localhost:8004/usl",
            {
                method: "GET",
                credentials: 'include',
                headers: {"Content-Type": "application/json"}
            }
        ).then(
            (res) => {
                console.log(res);
            }
        ).catch(
            (err) => {
                console.error(err);
            }
        );
    }

    self.onmessage = (e) => {
        let intervalId;
        switch(e.data) {
            case "start":
                intervalId = setInterval(uslRequest, 29 * 60 * 1000);
                console.log("Started Usl Interval");
                break;
            case "stop":
                clearInterval(intervalId);
                console.log("Stopped USL");
                break;
            default:
                console.log("Invalid data for uslWorker");
        }
    }
};


const createWorkerScript = (workercode) => {
    let code = workercode.toString();
    code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

    const blob = new Blob([code], {type: "application/javascript"});
    return URL.createObjectURL(blob);
}


const uslWorkerScript = createWorkerScript(uslWorkerCode);

export default uslWorkerScript;
