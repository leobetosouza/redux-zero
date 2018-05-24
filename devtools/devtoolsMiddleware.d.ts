declare let devTools: {
    instance: any;
};
declare let connect: any;
declare function getOrAddAction(action: any, fn: any): any;
declare function update(message: any): void;
declare const devtoolsMiddleware: (store: any) => (next: any, args: any) => (action: any) => any;
export { devtoolsMiddleware, connect, update, devTools, getOrAddAction };
