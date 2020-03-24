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

    HospitalList$: Observable<Array<iHospital>>;
    CurrentPageSelector$: Observable<string>;
    DebugShowStoreState$: Observable<boolean>;
    IsLoading$: Observable<boolean>;
    SelectedMapApiName$: Observable<string>;
    MapReady$: Observable<boolean>;

    state$: Observable<() => iStoreState>;

    private state: BehaviorSubject<() => iStoreState>;
    private HospitalList: BehaviorSubject<Array<iHospital>>;
    private CurrentPageSelector: BehaviorSubject<string>;
    private DebugShowStoreState: BehaviorSubject<boolean>;
    private IsLoading: BehaviorSubject<boolean>;
    private SelectedMapApiName: BehaviorSubject<string>;
    private MapReady: BehaviorSubject<boolean>;

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
            this.CurrentPageSelector.next(sel);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.DebugToggleShowStoreState,() => {
            this.DebugShowStoreState.next(!this.DebugShowStoreState.value)
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.SetLoadingTrue,() => {
            this.IsLoading.next(true);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.SetLoadingFalse,() => {
            this.IsLoading.next(false);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.UnloadHospitalList,this.unloadHospitalList.bind(this));
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.ChangeSelectedMapApi,(name: string) => {
            this.SelectedMapApiName.next(name);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.MapReady,(isReady: boolean) => {
            this.MapReady.next(isReady);
        })
    }

    private assembleState(): iStoreState {
        return {
            hospitalList: this.HospitalList.value,
            currentPage: this.CurrentPageSelector.value,
            debugShowStoreState: this.DebugShowStoreState.value,
            isLoading: this.IsLoading.value,
            selectedMapApiName: this.SelectedMapApiName.value,
            mapReady: this.MapReady.value
        }
    }

    private initState(initialStoreState: iStoreState): void {
        this.initSubjects(initialStoreState);

        this.HospitalList$.subscribe((data: Array<iHospital>) => {
            this.state.next(this.assembleState.bind(this));
        });
        this.CurrentPageSelector$.subscribe((data: string) => {
            this.state.next(this.assembleState.bind(this));
        });
        this.DebugShowStoreState$.subscribe((data: boolean) => {
            this.state.next(this.assembleState.bind(this));
        });
        this.IsLoading$.subscribe((data: boolean) => {
            this.state.next(this.assembleState.bind(this));
        });
        this.SelectedMapApiName$.subscribe((data: string) => {
            this.state.next(this.assembleState.bind(this));
        });
        this.MapReady$.subscribe(() => {
            this.state.next(this.assembleState.bind(this));
        });
    }

    private initSubjects(initialStoreState: iStoreState): void {
        this.HospitalList = new BehaviorSubject(initialStoreState.hospitalList);
        this.CurrentPageSelector = new BehaviorSubject(initialStoreState.currentPage);
        this.DebugShowStoreState = new BehaviorSubject(initialStoreState.debugShowStoreState);
        this.IsLoading = new BehaviorSubject(initialStoreState.isLoading);
        this.SelectedMapApiName = new BehaviorSubject(initialStoreState.selectedMapApiName);
        this.state = new BehaviorSubject(this.assembleState.bind(this));
        this.MapReady = new BehaviorSubject(initialStoreState.mapReady);

        this.HospitalList$ = this.HospitalList.asObservable();
        this.CurrentPageSelector$ = this.CurrentPageSelector.asObservable();
        this.DebugShowStoreState$ = this.DebugShowStoreState.asObservable();
        this.IsLoading$ = this.IsLoading.asObservable();
        this.SelectedMapApiName$ = this.SelectedMapApiName.asObservable();
        this.state$ = this.state.asObservable();
        this.MapReady$ = this.MapReady.asObservable();
    }

    /**
     * Fetch the hospital list
     */
    private async fetchHospitalList(): Promise<void> {
        this.IsLoading.next(true);
        const newList: Array<iHospital> = await this.dependencies.dataQuery.queryHospitalList();
        this.HospitalList.next(newList);
        this.IsLoading.next(false);
    }

    private unloadHospitalList(): void {
        this.IsLoading.next(true);
        this.HospitalList.next([]);
        this.IsLoading.next(false);
    }

}