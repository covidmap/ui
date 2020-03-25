import {iStoreDataQuery} from "../models/iStoreDataQuery";
import {StubStoreDataQuery} from "../dataQuery/stubDataQuery";
import {iDispatcher} from "../../dispatcher/models/iDispatcher";
import {Dispatcher} from "../../dispatcher/dispatcher";
import {iStore} from "../models/iStore";
import {Store} from "../store";
import {DISPATCHER_MESSAGES} from "../../dispatcher/dispatcher.messages";
import {iHospital} from "../models/iHospital";

const dispatcher: iDispatcher = new Dispatcher();
const dataQuery: iStoreDataQuery = new StubStoreDataQuery();
const store: iStore = new Store({
    dispatcher,
    dataQuery
});

describe('store tests',() => {

    it('should subscribe to store list and get updates from dispatcher',() => {
        return new Promise((resolve,reject) => {
            store.HospitalList$.subscribe((data: Array<iHospital>) => {
                if (data === null || data.length === 0) { return; } //ignore default case

                expect(data).toBeTruthy();
                resolve();
            });

            dispatcher.dispatch(DISPATCHER_MESSAGES.QueryHospitalList);
        });

    });

});