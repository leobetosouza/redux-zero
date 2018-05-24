/// <reference types="react" />
import * as React from "react";
export declare class Connect extends React.Component<any> {
    static contextTypes: {
        store: (props: object, propName: string, componentName: string) => Error;
    };
    unsubscribe: any;
    state: any;
    actions: {};
    componentWillMount(): void;
    componentWillUnmount(): void;
    getProps(): any;
    getActions(): {};
    update: () => void;
    render(): any;
}
export default function connect(mapToProps: any, actions?: {}): (Child: any) => {
    new (props: any, context?: any): {
        render(): JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: any) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => void): void;
        forceUpdate(callBack?: () => void): void;
        props: any;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentWillMount?(): void;
        componentDidMount?(): void;
        componentWillReceiveProps?(nextProps: any, nextContext: any): void;
        shouldComponentUpdate?(nextProps: any, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUpdate?(nextProps: any, nextState: Readonly<{}>, nextContext: any): void;
        componentDidUpdate?(prevProps: any, prevState: Readonly<{}>, prevContext: any): void;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
    };
};
