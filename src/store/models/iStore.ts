import {BehaviorSubject, Observable, Subject} from "rxjs";
import {iHospital} from "./iHospital";
import {BaseView} from "../../view/views/baseView";
import {iMapState} from "../../view/models/iMapRender";
import {iLog, iTimeLog} from "../../logger/models/iLog";


/**
 * Base Store operations
 */
export interface iStoreBase {}


export interface iStoreState {
    environment: string,
    hospitalList: Array<iHospital>,
    currentPage: string,
    currentPageDisplayClass: string,
    debugShowStoreState: boolean,
    isLoading: boolean,
    selectedMapApiName: string,
    mapReady: boolean,
    mapState: iMapState,
    logEntries: Array<iTimeLog>,
    existingViews: {[key: string]: number}
}

/**
 * Base + logic relevant to this application
 */
export interface iStore extends iStoreBase {
    HospitalList$: Observable<Array<iHospital>>,
    CurrentPageSelector$: Observable<string>,
    CurrentPageDisplayClass$: Observable<string>,
    DebugShowStoreState$: Observable<boolean>
    IsLoading$: Observable<boolean>,
    SelectedMapApiName$: Observable<string>
    MapReady$: Observable<boolean>;
    MapState$: Observable<iMapState>,
    LogEntries$: Observable<iTimeLog>,
    ExistingViews$: Observable<{[key: string]: number}>,
    ReloadMap$: Observable<null>

    state$: Observable<() => iStoreState>
    state: iStoreState;
}