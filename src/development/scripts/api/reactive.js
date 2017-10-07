import { Observable } from 'rxjs-es/Rx';



export const socket$ = Observable.create(function (obs) {
    console.log("Opening");

    function connect() {
        const socket = new WebSocket(`ws://${window.location.host}/api/ws`);

        socket.onopen = event => {
            console.log("Open");
            setTimeout(() => {
                console.log("Sending");
                socket.send(JSON.stringify({
                    bus: "test",
                    message: "Hello"
                }))
            }, 3000);
        };

        socket.onmessage = event => {
            console.log("Message");
            obs.next(event);
        };

        socket.onerror = event => {
            obs.error(event);
            console.error(event);
        };

        socket.onclose = event => {
            function reconnect() {
                console.log("Attemting to reconnect.");
                const s = connect();
                if (s == null) {
                    setTimeout(reconnect, 1000);
                }
            }

            reconnect();
        };

        return socket;
    }

    const socket = connect();

    return () => {
        console.log("Closing");
        socket.close();
    };
}).do(x => console.log(`source: ${x}`));