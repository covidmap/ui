import { iStore } from "./models/iStore";
import { iDispatcher } from "../dispatcher/models/iDispatcher";
import { iHospital } from "./models/iHospital";
import { DISPATCHER_MESSAGES } from "../dispatcher/dispatcher.messages";
import { iStoreDataQuery } from "./models/iStoreDataQuery";
import {BehaviorSubject } from "rxjs";

interface iStoreState {
    hospitalList: Array<iHospital>,
    currentPage: string
}

const initialStoreState: iStoreState = {
    hospitalList: [],
    currentPage: "index-main"
};

export interface iStoreDependencies {
    dispatcher: iDispatcher,
    dataQuery: iStoreDataQuery
}

export class Store implements iStore {

    HospitalList$: BehaviorSubject<Array<iHospital>> = new BehaviorSubject(initialStoreState.hospitalList);
    CurrentPageSelector$: BehaviorSubject<string> = new BehaviorSubject(initialStoreState.currentPage);

    private dependencies: iStoreDependencies;

    constructor(
        dependencies: iStoreDependencies
    ) {
        this.dependencies = dependencies;
        this.initDispatcher();
    }


    /**
     * Initialize listeners for dispatcher events
     */
    private initDispatcher() {
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.QueryHospitalList,this.fetchHospitalList.bind(this));
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.CurrentPageChanged,(sel: string) => {
            this.CurrentPageSelector$.next(sel);
        });
    }

    /**
     * Fetch the hospital list
     */
    private async fetchHospitalList(): Promise<void> {
        const newList: Array<iHospital> = await this.dependencies.dataQuery.queryHospitalList();
        this.HospitalList$.next(newList);
    }

}