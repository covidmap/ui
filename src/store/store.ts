import {iStore, iStoreState} from "./models/iStore";
import { iDispatcher } from "../dispatcher/models/iDispatcher";
import { iHospital } from "./models/iHospital";
import { DISPATCHER_MESSAGES } from "../dispatcher/dispatcher.messages";
import { iStoreDataQuery } from "./models/iStoreDataQuery";
import {BehaviorSubject, Observable, Subject} from "rxjs";

const initialStoreState: iStoreState = {
    hospitalList: [],
    currentPage: "index-main",
    debugShowStoreState: false,
    isLoading: false
};

export interface iStoreDependencies {
    dispatcher: iDispatcher,
    dataQuery: iStoreDataQuery
}

export class Store implements iStore {

    state$: Subject<() => iStoreState>;

    HospitalList$: BehaviorSubject<Array<iHospital>> = new BehaviorSubject(initialStoreState.hospitalList);
    CurrentPageSelector$: BehaviorSubject<string> = new BehaviorSubject(initialStoreState.currentPage);
    DebugShowStoreState$: BehaviorSubject<boolean> = new BehaviorSubject(initialStoreState.debugShowStoreState);
    IsLoading$: BehaviorSubject<boolean> = new BehaviorSubject(initialStoreState.isLoading);

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
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.DebugToggleShowStoreState,() => {
            this.DebugShowStoreState$.next(!this.DebugShowStoreState$.value)
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.SetLoadingTrue,() => {
            this.IsLoading$.next(true);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.SetLoadingFalse,() => {
            this.IsLoading$.next(false);
        });
    }

    private assembleState(): iStoreState {
        return {
            hospitalList: this.HospitalList$.value,
            currentPage: this.CurrentPageSelector$.value,
            debugShowStoreState: this.DebugShowStoreState$.value,
            isLoading: this.IsLoading$.value
        }
    }

    private initState(): void {
        this.state$ = new BehaviorSubject(this.assembleState.bind(this));
        this.HospitalList$.subscribe((data: Array<iHospital>) => {
            this.state$.next(this.assembleState.bind(this));
        });
        this.CurrentPageSelector$.subscribe((data: string) => {
            this.state$.next(this.assembleState.bind(this));
        });
        this.DebugShowStoreState$.subscribe((data: boolean) => {
            this.state$.next(this.assembleState.bind(this));
        });
        this.IsLoading$.subscribe((data: boolean) => {
            this.state$.next(this.assembleState.bind(this));
        })
    }

    /**
     * Fetch the hospital list
     */
    private async fetchHospitalList(): Promise<void> {
        this.IsLoading$.next(true);
        const newList: Array<iHospital> = await this.dependencies.dataQuery.queryHospitalList();
        this.HospitalList$.next(newList);
        this.IsLoading$.next(false);
    }

}