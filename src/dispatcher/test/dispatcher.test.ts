import { Dispatcher as DispatcherSingleton } from "../dispatcher";

const Dispatcher = new DispatcherSingleton();

describe('dispatcher tests',() => {

    it('should register to message, then receive callback',() => {
        let sideEffectCapture = null;

        const listener = (data: any) => sideEffectCapture = data;
        const messageName = "testForMessage";
        const testValue = 174;

        Dispatcher.registerToMessage(messageName,listener);
        Dispatcher.dispatch(messageName,testValue);

        expect(sideEffectCapture).toEqual(testValue);
    });

    it('should register to all, then receive callback on appropriate message',() => {
        let sideEffectCapture = null;
        let sideEffectCounter = null;

        const messageName: string = "testForAll";
        const listener = (message: string,data: any) => {
            if (message === messageName) {
                sideEffectCapture = data
            } else {
                sideEffectCapture = data;
            }
        };
        const testValue = 174;

        Dispatcher.registerToAll(listener);
        Dispatcher.dispatch(messageName,testValue);

        expect(sideEffectCapture).toEqual(testValue);
        expect(sideEffectCounter).not.toEqual(testValue);
    });

    it('should not throw error if event is dispatched with no listeners',() => {

        const messageName = "message_"+(+new Date());
        Dispatcher.dispatch(messageName,false);
        expect(true).toEqual(true); //error will have already been thrown if previous line failed

    })

});