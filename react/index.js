'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

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

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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

function propsValidation(props, propName, componentName) {
    if (typeof props === "object") {
        return null;
    }
    return new Error("Invalid prop " + propName + " supplied to " + componentName);
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

var hoistNonReactStatics = require("hoist-non-react-statics");
var Connect = /** @class */ (function (_super) {
    __extends(Connect, _super);
    function Connect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = _this.getProps();
        _this.actions = _this.getActions();
        _this.update = function () {
            var mapped = _this.getProps();
            if (!shallowEqual(mapped, _this.state)) {
                _this.setState(mapped);
            }
        };
        return _this;
    }
    Connect.prototype.componentWillMount = function () {
        this.unsubscribe = this.context.store.subscribe(this.update);
    };
    Connect.prototype.componentWillUnmount = function () {
        this.unsubscribe(this.update);
    };
    Connect.prototype.getProps = function () {
        var mapToProps = this.props.mapToProps;
        var state = (this.context.store && this.context.store.getState()) || {};
        return mapToProps ? mapToProps(state, this.props) : state;
    };
    Connect.prototype.getActions = function () {
        var actions = this.props.actions;
        return bindActions(actions, this.context.store);
    };
    Connect.prototype.render = function () {
        return this.props.children(__assign({ store: this.context.store }, this.state, this.actions));
    };
    Connect.contextTypes = {
        store: propsValidation
    };
    return Connect;
}(React.Component));
function connect(mapToProps, actions) {
    if (actions === void 0) { actions = {}; }
    return function (Child) {
        var ConnectWrapper = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.render = function () {
                var props = this.props;
                return (React.createElement(Connect, __assign({}, props, { mapToProps: mapToProps, actions: actions }), function (mappedProps) { return React.createElement(Child, __assign({}, mappedProps, props)); }));
            };
            return class_1;
        }(React.Component));
        hoistNonReactStatics(ConnectWrapper, Child);
        return ConnectWrapper;
    };
}

var Provider = /** @class */ (function (_super) {
    __extends(Provider, _super);
    function Provider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Provider.prototype.getChildContext = function () {
        var store = this.props.store;
        return { store: store };
    };
    Provider.prototype.render = function () {
        var children = this.props.children;
        return React.Children.only(children);
    };
    Provider.childContextTypes = {
        store: propsValidation
    };
    return Provider;
}(React.Component));

exports.connect = connect;
exports.Provider = Provider;
exports.Connect = Connect;
