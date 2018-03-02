import { Observable } from "rxjs-es/Observable";
import "rxjs-es/add/operator/map";
import "rxjs-es/add/operator/retryWhen";
import "rxjs-es/add/operator/do";
import "rxjs-es/add/operator/share";
import "rxjs-es/add/operator/filter";
import "rxjs-es/add/operator/finally";
import "rxjs-es/add/observable/defer";
import { QueueingSubject } from "../helpers/queueing-subject";
import { memoize } from "../helpers/fp";

const retrySeconds = 5;

function webSocketObservable(url, input, replay) {
    return Observable.create(obs => {
        const socket = new WebSocket(url);
        let inputSubscription;

        socket.onopen = () => {
            for (const msg of replay) {
                socket.send(JSON.stringify(msg));
            }

            inputSubscription = input.subscribe(data => {
                socket.send(JSON.stringify(data));
            });
        };

        socket.onmessage = message => {
            obs.next(message.data);
        };

        socket.onerror = obs.error;

        socket.onclose = event => {
            if (event.wasClean) {
                obs.complete();
            } else {
                obs.error(event);
            }
        };

        return () => {
            if (inputSubscription) {
                inputSubscription.unsubscribe();
            }

            if (socket) {
                socket.close();
            }
        };
    });
}

const input = new QueueingSubject();
const replayMessages = new Set();

function replay(msg) {
    replayMessages.add(msg);
    input.next(msg);
}

export const socket$ = webSocketObservable(
    `ws://${window.location.host}/api/v1/socket`,
    input,
    replayMessages
)
    .retryWhen(errors =>
        errors
            .do(event => {
                console.error(`Got error on socket restarting in ${retrySeconds}.`);
                console.error(event);
            })
            .delay(retrySeconds * 1000)
    )
    .do(x => console.debug(`WebSocket source: ${x}`))
    .share();

export const changefeed = memoize(table => {
    const tableChannel = `changefeed-${table}`;

    const subscribe = {
        channel: "subscribe",
        message: table
    };

    return Observable.defer(() => {
        replay(subscribe);

        return socket$;
    })
        .map(JSON.parse)
        .filter(data => data.channel === tableChannel)
        .map(data => {
            if (data.type === "error") {
                throw data.message;
            } else if (data.type === "next") {
                return data.message;
            }
        })
        .finally(() => {
            replayMessages.delete(subscribe);
            input.next({
                channel: "unsubscribe",
                message: table
            });
        })
        .share();
});
