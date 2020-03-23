import {iStore, iStoreState} from "./models/iStore";
import { iDispatcher } from "../dispatcher/models/iDispatcher";
import { iHospital } from "./models/iHospital";
import { DISPATCHER_MESSAGES } from "../dispatcher/dispatcher.messages";
import { iStoreDataQuery } from "./models/iStoreDataQuery";
import {BehaviorSubject, Observable, Subject} from "rxjs";

export interface iStoreDependencies {
    dispatcher: iDispatcher,
    dataQuery: iStoreDataQuery
}

export class Store implements iStore {

    state$: Subject<() => iStoreState>;

    HospitalList$: BehaviorSubject<Array<iHospital>>;
    CurrentPageSelector$: BehaviorSubject<string>;
    DebugShowStoreState$: BehaviorSubject<boolean>;
    IsLoading$: BehaviorSubject<boolean>;
    SelectedMapApiName$: BehaviorSubject<string>;

    private dependencies: iStoreDependencies;

    constructor(
        dependencies: iStoreDependencies,
        initialState: iStoreState
    ) {
        this.dependencies = dependencies;
        this.initDispatcher();
        this.initState(initialState);
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
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.UnloadHospitalList,this.unloadHospitalList.bind(this));
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.ChangeSelectedMapApi,(name: string) => {
            this.SelectedMapApiName$.next(name);
        })
    }

    private assembleState(): iStoreState {
        return {
            hospitalList: this.HospitalList$.value,
            currentPage: this.CurrentPageSelector$.value,
            debugShowStoreState: this.DebugShowStoreState$.value,
            isLoading: this.IsLoading$.value,
            selectedMapApiName: this.SelectedMapApiName$.value
        }
    }

    private initState(initialStoreState: iStoreState): void {
        this.HospitalList$ = new BehaviorSubject(initialStoreState.hospitalList);
        this.CurrentPageSelector$ = new BehaviorSubject(initialStoreState.currentPage);
        this.DebugShowStoreState$ = new BehaviorSubject(initialStoreState.debugShowStoreState);
        this.IsLoading$ = new BehaviorSubject(initialStoreState.isLoading);
        this.SelectedMapApiName$ = new BehaviorSubject(initialStoreState.selectedMapApiName);

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
        });
        this.SelectedMapApiName$.subscribe((data: string) => {
            this.state$.next(this.assembleState.bind(this));
        });
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

    private unloadHospitalList(): void {
        this.IsLoading$.next(true);
        this.HospitalList$.next([]);
        this.IsLoading$.next(false);
    }

}