import { Subject } from "rxjs-es/Subject";

export function QueueingSubject() {
    const _this = new Subject();
    _this._queuedValues = [];
    return _this;
}

QueueingSubject.prototype = Object.create(Subject.prototype);
QueueingSubject.prototype.constructor = QueueingSubject;

QueueingSubject.prototype.next = function(value) {
    if (this.closed || this.observers.length) {
        Subject.prototype.next.call(this, value);
    } else {
        this._queuedValues.push(value);
    }
};

QueueingSubject.prototype._subscribe = function(subscriber) {
    const _this = this;
    const ret = Subject.prototype._subscribe.call(this, subscriber);
    if (this._queuedValues.length) {
        this._queuedValues.forEach(function(value) {
            return _super.prototype.next.call(_this, value);
        });
        this._queuedValues.splice(0);
    }
    return ret;
};
