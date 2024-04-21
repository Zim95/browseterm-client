import React, { useEffect } from "react";


function TestApi() {
    useEffect(() => {
        const makeRequest = async () => {
            const response  = await fetch(
                "",
                {
                    method: "POST"
                }
            );
            const jr = await response.json();
            console.log(jr);
        };
        makeRequest();
    }, []);
    return <div>Test Api</div>
}

export default TestApi;