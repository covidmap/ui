import { EventEmitter as EventEmitterSingleton } from "../eventEmitter";

const EventEmitter = new EventEmitterSingleton();

describe('EventEmitter tests',() => {

    test('it should receive emitted event',() => {
        let sideEffectVar = null;
        const expectedVal = 154;

        let callbackCalled = false;
        const eventName = "test_"+(+new Date());
        const listener = (data: any) => {

            callbackCalled = true;
            sideEffectVar = data;
        };

        EventEmitter.on(eventName,listener);
        EventEmitter.emit(eventName,expectedVal);

        expect(callbackCalled).toBe(true);
        expect(sideEffectVar).toEqual(expectedVal);
    });

});