import {DATA_QUERY_STRATEGY, iStore, iStoreState} from "./models/iStore";
import { iDispatcher } from "../dispatcher/models/iDispatcher";
import { iHospital } from "./models/iHospital";
import { DISPATCHER_MESSAGES } from "../dispatcher/dispatcher.messages";
// import { iStoreDataQuery } from "./models/iStoreDataQuery";
import {BehaviorSubject, Observable, ReplaySubject, Subject} from "rxjs";
import {iMapLatLng, iMapState} from "../view/models/iMapRender";
import {iLog, iTimeLog, LOG_LEVEL} from "../logger/models/iLog";
import {map} from "rxjs/operators";
// import {StubStoreDataQuery} from "./dataQuery/stubDataQuery";

export interface iStoreDependencies {
    dispatcher: iDispatcher
}

export class Store implements iStore {

    HospitalList$: Observable<Array<iHospital>>;
    CurrentPageSelector$: Observable<string>;
    CurrentPageDisplayClass$: Observable<string>;
    DebugShowStoreState$: Observable<boolean>;
    IsLoading$: Observable<boolean>;
    SelectedMapApiName$: Observable<string>;
    MapReady$: Observable<boolean>;
    MapState$: Observable<iMapState>;
    LogEntries$: Observable<iTimeLog>;
    ExistingViews$: Observable<{[key: string]: number}>;
    ReloadMap$: Observable<null>;
    DataQueryStrategy$: Observable<string>;
    HospitalInContext$: Observable<iHospital | null>;
    MapDefaultCenterCoordinates$: Observable<iMapLatLng | null>

    state$: Observable<() => iStoreState>;

    private _state: BehaviorSubject<() => iStoreState>;
    private HospitalList: BehaviorSubject<Array<iHospital>>;
    private CurrentPageSelector: BehaviorSubject<string>;
    private CurrentPageDisplayClass: BehaviorSubject<string>;
    private DebugShowStoreState: BehaviorSubject<boolean>;
    private IsLoading: BehaviorSubject<boolean>;
    private SelectedMapApiName: BehaviorSubject<string>;
    private MapReady: BehaviorSubject<boolean>;
    private MapState: BehaviorSubject<iMapState>;
    private LogEntries: BehaviorSubject<Array<iTimeLog>>;
    private ExistingViews: BehaviorSubject<{[key: string]: number}>;
    private ReloadMap: BehaviorSubject<null>;
    private DataQueryStrategy: BehaviorSubject<string>;
    private HospitalInContext: BehaviorSubject<iHospital | null>;
    private MapDefaultCenterCoordinates: BehaviorSubject<iMapLatLng | null>;

    private environmentPermanentValue: string;
    private reportFormResourceNamesPermanentValue: Array<{
        propName: string,
        label: string
    }>;

    private dependencies: iStoreDependencies;
    private unloadedHospitalList: Array<iHospital> = [];

    constructor(
        dependencies: iStoreDependencies,
        initialState: iStoreState
    ) {
        this.dependencies = dependencies;
        this.initDispatcher();
        this.initState(initialState);
        this.fetchHospitalList();
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
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.UpdateMapState,(state: iMapState) => {
            const currentState = this.MapState.value;
            this.MapState.next({
                ...currentState,
                ...state
            });
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.NewLog,(log: iLog) => {
            const timeLog: iTimeLog = {
                timestamp: +new Date(),
                ...log
            };
            this.LogEntries.next(this.LogEntries.value.concat([timeLog]));
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.ViewInitialized,this.incrementSelectorCount.bind(this));
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.ViewDestroyed,this.decrementSelectorCount.bind(this));
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.CurrentPageDisplayClass,(data: string) => {
            this.CurrentPageDisplayClass.next(data);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.ReloadMap,() => {
            this.ReloadMap.next(null);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.ChangeDataQueryStrategy,(strategyName: string) => {
            this.DataQueryStrategy.next(strategyName);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.ProvideHospitalList,(list: Array<iHospital>) => {
            this.HospitalList.next(list);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.HospitalInContextUpdated, (item: iHospital) => {
            this.HospitalInContext.next(item);
        });
        this.dependencies.dispatcher.registerToMessage(DISPATCHER_MESSAGES.UpdateDefaultMapCenterCoordinates,(pos: iMapLatLng) => {
            this.MapDefaultCenterCoordinates.next(pos);
            this.dependencies.dispatcher.dispatch(DISPATCHER_MESSAGES.ReloadMap);
        });
    }

    get state(): iStoreState {
        return this.assembleState();
    }

    private assembleState(): iStoreState {
        return {
            isLoading: this.IsLoading.value,
            environment: this.environmentPermanentValue,
            dataQueryStrategy: this.DataQueryStrategy.value,
            currentPage: this.CurrentPageSelector.value,
            currentPageDisplayClass: this.CurrentPageDisplayClass.value,
            reportFormResourceNames: this.reportFormResourceNamesPermanentValue,
            debugShowStoreState: this.DebugShowStoreState.value,
            selectedMapApiName: this.SelectedMapApiName.value,
            mapReady: this.MapReady.value,
            mapState: this.MapState.value,
            existingViews: this.ExistingViews.value,
            hospitalInContext: this.HospitalInContext.value,
            defaultMapCenterCoordinates: this.MapDefaultCenterCoordinates.value,
            logEntries: this.LogEntries.value,
            hospitalList: this.HospitalList.value,
        }
    }

    private initState(initialStoreState: iStoreState): void {
        this.initSubjects(initialStoreState);

        this.HospitalList$.subscribe((data: Array<iHospital>) => {
            this._state.next(this.assembleState.bind(this));
        });
        this.CurrentPageSelector$.subscribe((data: string) => {
            this._state.next(this.assembleState.bind(this));
        });
        this.CurrentPageDisplayClass$.subscribe(() => {
            this._state.next(this.assembleState.bind(this));
        });
        this.DebugShowStoreState$.subscribe((data: boolean) => {
            this._state.next(this.assembleState.bind(this));
        });
        this.IsLoading$.subscribe((data: boolean) => {
            this._state.next(this.assembleState.bind(this));
        });
        this.SelectedMapApiName$.subscribe((data: string) => {
            this._state.next(this.assembleState.bind(this));
        });
        this.MapReady$.subscribe(() => {
            this._state.next(this.assembleState.bind(this));
        });
        this.MapState$.subscribe(() => {
            this._state.next(this.assembleState.bind(this));
        });
        this.LogEntries.subscribe(() => {
            this._state.next(this.assembleState.bind(this));
        });
        this.ExistingViews.subscribe(() => {
            this._state.next(this.assembleState.bind(this));
        });
        this.DataQueryStrategy.subscribe(() => {
            this._state.next(this.assembleState.bind(this));
        });
        this.HospitalInContext$.subscribe(() => {
            this._state.next(this.assembleState.bind(this));
        });
        this.MapDefaultCenterCoordinates.subscribe(() => {
            this._state.next(this.assembleState.bind(this));
        });
    }

    private initSubjects(initialStoreState: iStoreState): void {
        this.HospitalList = new BehaviorSubject(initialStoreState.hospitalList);
        this.CurrentPageSelector = new BehaviorSubject(initialStoreState.currentPage);
        this.CurrentPageDisplayClass = new BehaviorSubject(initialStoreState.currentPageDisplayClass);
        this.DebugShowStoreState = new BehaviorSubject(initialStoreState.debugShowStoreState);
        this.IsLoading = new BehaviorSubject(initialStoreState.isLoading);
        this.SelectedMapApiName = new BehaviorSubject(initialStoreState.selectedMapApiName);
        this._state = new BehaviorSubject(this.assembleState.bind(this));
        this.MapReady = new BehaviorSubject(initialStoreState.mapReady);
        this.MapState = new BehaviorSubject(initialStoreState.mapState);
        this.LogEntries = new BehaviorSubject(initialStoreState.logEntries);
        this.ExistingViews = new BehaviorSubject(initialStoreState.existingViews);
        this.ReloadMap = new BehaviorSubject(null);
        this.DataQueryStrategy = new BehaviorSubject(initialStoreState.dataQueryStrategy);
        this.HospitalInContext = new BehaviorSubject(initialStoreState.hospitalInContext);
        this.MapDefaultCenterCoordinates = new BehaviorSubject(initialStoreState.defaultMapCenterCoordinates);

        this.HospitalList$ = this.HospitalList.asObservable();
        this.CurrentPageSelector$ = this.CurrentPageSelector.asObservable();
        this.CurrentPageDisplayClass$ = this.CurrentPageDisplayClass.asObservable();
        this.DebugShowStoreState$ = this.DebugShowStoreState.asObservable();
        this.IsLoading$ = this.IsLoading.asObservable();
        this.SelectedMapApiName$ = this.SelectedMapApiName.asObservable();
        this.state$ = this._state.asObservable();
        this.MapReady$ = this.MapReady.asObservable();
        this.MapState$ = this.MapState.asObservable();
        this.LogEntries$ = this.LogEntries.asObservable().pipe(map((ar: Array<iTimeLog>) => {
            return <iTimeLog>ar[ar.length - 1];
        }));
        this.ExistingViews$ = this.ExistingViews.asObservable();
        this.ReloadMap$ = this.ReloadMap.asObservable();
        this.DataQueryStrategy$ = this.DataQueryStrategy.asObservable();
        this.HospitalInContext$ = this.HospitalInContext.asObservable();
        this.MapDefaultCenterCoordinates$ = this.MapDefaultCenterCoordinates.asObservable();


        this.environmentPermanentValue = initialStoreState.environment;
        this.reportFormResourceNamesPermanentValue = initialStoreState.reportFormResourceNames;
    }

    /**
     * Fetch the hospital list
     */
    private async fetchHospitalList(): Promise<void> {
        const newList = this.unloadedHospitalList.length > 0?this.unloadedHospitalList:this.HospitalList.value;
        this.HospitalList.next(newList);
    }

    private unloadHospitalList(): void {
        if (this.HospitalList.value.length > 0) {
            this.unloadedHospitalList = this.HospitalList.value;
        }
        this.HospitalList.next([]);
    }

    private incrementSelectorCount(selector: string): void {
        let current = this.ExistingViews.value;
        if (current[selector]) {
            current[selector] ++;
        } else {
            current[selector] = 1;
        }
        this.ExistingViews.next(current);
    }

    private decrementSelectorCount(selector: string): void {
        let current = this.ExistingViews.value;
        current[selector] --;
        this.ExistingViews.next(current);
    }

}