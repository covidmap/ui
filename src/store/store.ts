import { iStore } from "./models/iStore";
import { iDispatcher } from "../dispatcher/models/iDispatcher";
import { ObservableStore } from "@codewithdan/observable-store";
import { iHospital } from "./models/iHospital";
import { DISPATCHER_MESSAGES } from "../dispatcher/dispatcher.messages";
import { iStoreDataQuery } from "./models/iStoreDataQuery";
import {BehaviorSubject, Observable, Subscribable} from "rxjs";

interface iStoreState {
    hospitalList: Array<iHospital>
}

const initialStoreState: iStoreState = {
    hospitalList: []
};

export interface iStoreDependencies {
    dispatcher: iDispatcher,
    dataQuery: iStoreDataQuery
}

export class Store extends ObservableStore<iStoreState> implements iStore {

    HospitalList$: BehaviorSubject<Array<iHospital>> = new BehaviorSubject(initialStoreState.hospitalList);
    private dependencies: iStoreDependencies;

    constructor(
        dependencies: iStoreDependencies
    ) {
        super({
            trackStateHistory: true
        });
        this.dependencies = dependencies;
        super.setState(initialStoreState);
        this.initDispatcher();
    }


    /**
     * Initialize listeners for dispatcher events
     */
    private initDispatcher() {
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.QueryHospitalList,this.fetchHospitalList.bind(this));
    }

    /**
     * Fetch the hospital list
     */
    private async fetchHospitalList(): Promise<void> {
        const newList: Array<iHospital> = await this.dependencies.dataQuery.queryHospitalList();
        const newPartialState: Partial<iStoreState> = {
            hospitalList: newList
        };
        const newState = Object.assign(
            super.getState(),
            newPartialState
        );
        super.setState(newState);
        this.HospitalList$.next(newList);
    }

}