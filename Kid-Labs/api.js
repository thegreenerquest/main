async function saveQuizResponse(payload) {

    try {

        const body = new URLSearchParams();

        body.append("payload", JSON.stringify(payload));

        fetch(CONFIG.API_URL, {

            method: "POST",

            body: body,

            mode: "no-cors"

        });

        console.log("Payload Sent");

        return true;

    }

    catch (error) {

        console.error(error);

        return false;

    }

}

function fetchQuizResponse(responseId) {
    if (!responseId) return Promise.resolve(null);

    return new Promise((resolve, reject) => {
        const callbackName = "mccQuizResponse_" + Date.now() + "_" + Math.random().toString(36).slice(2);
        const script = document.createElement("script");
        const timeout = window.setTimeout(() => {
            cleanup();
            reject(new Error("Timed out while fetching saved quiz response."));
        }, 12000);

        function cleanup() {
            window.clearTimeout(timeout);
            delete window[callbackName];
            script.remove();
        }

        window[callbackName] = (data) => {
            cleanup();
            resolve(data);
        };

        script.onerror = () => {
            cleanup();
            reject(new Error("Unable to fetch saved quiz response."));
        };

        const url = new URL(CONFIG.API_URL);
        url.searchParams.set("action", "getResponse");
        url.searchParams.set("Response_ID", responseId);
        url.searchParams.set("callback", callbackName);
        script.src = url.toString();
        document.body.appendChild(script);
    });
}
