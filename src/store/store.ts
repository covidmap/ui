import {iStore, iStoreState} from "./models/iStore";
import { iDispatcher } from "../dispatcher/models/iDispatcher";
import { iHospital } from "./models/iHospital";
import { DISPATCHER_MESSAGES } from "../dispatcher/dispatcher.messages";
import { iStoreDataQuery } from "./models/iStoreDataQuery";
import {BehaviorSubject, Observable} from "rxjs";

const initialStoreState: iStoreState = {
    hospitalList: [],
    currentPage: "index-main"
};

export interface iStoreDependencies {
    dispatcher: iDispatcher,
    dataQuery: iStoreDataQuery
}

export class Store implements iStore {

    state$: BehaviorSubject<iStoreState> = new BehaviorSubject(initialStoreState);

    HospitalList$: BehaviorSubject<Array<iHospital>> = new BehaviorSubject(initialStoreState.hospitalList);
    CurrentPageSelector$: BehaviorSubject<string> = new BehaviorSubject(initialStoreState.currentPage);

    private dependencies: iStoreDependencies;

    constructor(
        dependencies: iStoreDependencies
    ) {
        this.dependencies = dependencies;
        this.initDispatcher();
        this.initState();
    }

    /**
     * Initialize listeners for dispatcher events
     */
    private initDispatcher(): void {
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.QueryHospitalList,this.fetchHospitalList.bind(this));
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.CurrentPageChanged,(sel: string) => {
            this.CurrentPageSelector$.next(sel);
        });
    }

    //TODO: this causes the state to be duplicated, remove duplication (or this functionality if not needed)
    private initState(): void {
        this.HospitalList$.subscribe((data: Array<iHospital>) => {
            this.state$.next({
                ...this.state$.value,
                hospitalList: data
            });
        });
        this.CurrentPageSelector$.subscribe((data: string) => {
            this.state$.next({
                ...this.state$.value,
                currentPage: data
            });
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