'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */



var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function shallowEqual(a, b) {
    for (var i in a)
        if (a[i] !== b[i])
            return false;
    for (var i in b)
        if (!(i in a))
            return false;
    return true;
}

function differs(a, b) {
    if (a !== b) {
        return true;
    }
    else if (a && typeof a === "object") {
        return !shallowEqual(a, b);
    }
    return false;
}
function getDiff(newData, oldData) {
    var diff = {};
    var changed = false;
    for (var key in newData) {
        var val = newData[key];
        if (differs(oldData[key], val)) {
            changed = true;
            if (typeof val === "object" && typeof val.getMonth !== "function") {
                diff[key] = val.constructor === Array ? val.slice(0) : __assign({}, val);
            }
            else {
                diff[key] = val;
            }
        }
    }
    return { diff: diff, changed: changed };
}

function set(store, ret) {
    if (ret != null) {
        if (ret.then)
            return ret.then(store.setState);
        store.setState(ret);
    }
}

function bindActions(actions, store) {
    actions = typeof actions === "function" ? actions(store) : actions;
    var bound = {};
    var _loop_1 = function (name_1) {
        bound[name_1] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var action = actions[name_1];
            if (typeof store.middleware === "function") {
                return store.middleware(store, action, args);
            }
            return set(store, action.apply(void 0, [store.getState()].concat(args)));
        };
    };
    for (var name_1 in actions) {
        _loop_1(name_1);
    }
    return bound;
}

function getActions(store, actions) {
    return bindActions(actions, store);
}
function connect(component, store, mapToProps) {
    update();
    component.on("destroy", store.subscribe(update));
    function update() {
        var _a = getDiff(mapToProps(store.getState()), component.get()), diff = _a.diff, changed = _a.changed;
        if (changed) {
            component.set(diff);
        }
    }
}

exports.connect = connect;
exports.getActions = getActions;
