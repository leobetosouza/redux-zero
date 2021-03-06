'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var devTools = { instance: null };
var nextActions = [];
var REPLAY_INTERVAL = 10;
function getOrAddAction(action, fn) {
    var found = nextActions.find(function (x) { return action.name === x.key; });
    if (!found) {
        found = { key: action.name, fn: fn };
        nextActions.push(found);
    }
    return found;
}
function replay(store, message) {
    var state = JSON.parse(message.state);
    var runAction = function (action) {
        if (action.type === "initialState") {
            store.setState(state.computedStates[0].state);
        }
        else {
            var found = nextActions.find(function (x) { return action.type === x.key; });
            if (found) {
                found.fn();
            }
        }
    };
    var keys = Object.keys(state.actionsById).filter(function (x) { return parseInt(x, 10) <= message.payload.id; });
    var i = 0;
    setTimeout(function run() {
        runAction(state.actionsById[keys[i]].action);
        if (++i >= keys.length)
            return;
        setTimeout(run, REPLAY_INTERVAL);
    }, 0);
}
function update(message) {
    if (message.type === "DISPATCH") {
        if (message.payload.type === "JUMP_TO_ACTION" ||
            message.payload.type === "JUMP_TO_STATE") {
            this.setState(JSON.parse(message.state));
        }
        else if (message.payload.type === "TOGGLE_ACTION") {
            replay(this, message);
        }
    }
}
function subscribe(store, middleware) {
    if (!middleware.initialized) {
        var storeUpdate = update.bind(store);
        devTools.instance.subscribe(storeUpdate);
        middleware.initialized = true;
    }
}
var devtoolsMiddleware = function (store) { return function (next, args) { return function (action) {
    var result = next(action);
    subscribe(store, devtoolsMiddleware);
    getOrAddAction(action, function () { return next(action); });
    var reduxAction = { type: action.name, args: args };
    if (result && result.then) {
        return result.then(function () {
            return devTools.instance.send(reduxAction, store.getState());
        });
    }
    devTools.instance.send(reduxAction, store.getState());
    return result;
}; }; };
if (window !== undefined && window.__REDUX_DEVTOOLS_EXTENSION__) {
    exports.connect = function (initialState) {
        devTools.instance = window.__REDUX_DEVTOOLS_EXTENSION__.connect();
        devTools.instance.send("initialState", initialState);
        return devtoolsMiddleware;
    };
}
