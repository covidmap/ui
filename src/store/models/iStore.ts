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
    hospitalList: Array<iHospital>,
    currentPage: string,
    debugShowStoreState: boolean,
    isLoading: boolean,
    selectedMapApiName: string,
    mapReady: boolean,
    mapState: iMapState,
    logEntries: Array<iTimeLog>
}

/**
 * Base + logic relevant to this application
 */
export interface iStore extends iStoreBase {
    HospitalList$: Observable<Array<iHospital>>,
    CurrentPageSelector$: Observable<string>,
    DebugShowStoreState$: Observable<boolean>
    IsLoading$: Observable<boolean>,
    SelectedMapApiName$: Observable<string>
    MapReady$: Observable<boolean>;
    MapState$: Observable<iMapState>,
    LogEntries$: Observable<iTimeLog>

    state$: Observable<() => iStoreState>
    state: iStoreState;
}