import {Observable} from 'rxjs-es/Rx';

const retrySeconds = 5;

export const socket$ = Observable.webSocket(`ws://${window.location.host}/api/v1/socket`)
    .map(message => {
        return message;
    })
    .retryWhen(errors => errors
               .do(event => {
                   console.log(`Got error on socket restarting in ${retrySeconds}.`);
                   console.error(event);
               }).delay(retrySeconds * 1000))
    .do(x => console.log(`source: ${x}`))
    .share();