import {BehaviorSubject, Observable, Subject} from "rxjs";
import {iHospital} from "./iHospital";
import {BaseView} from "../../view/views/baseView";
import {iMapLatLng, iMapState} from "../../view/models/iMapRender";
import {iLog, iTimeLog} from "../../logger/models/iLog";


/**
 * Base Store operations
 */
export interface iStoreBase {}

export const DATA_QUERY_STRATEGY = {
    StubQuery: "stubQuery"
};

export interface iStoreState {
    environment: string,
    dataQueryStrategy: string,
    hospitalList: Array<iHospital>,
    currentPage: string,
    currentPageDisplayClass: string,
    debugShowStoreState: boolean,
    isLoading: boolean,
    selectedMapApiName: string,
    mapReady: boolean,
    mapState: iMapState,
    reportFormResourceNames: Array<{
        propName: string,
        label: string
    }>,
    logEntries: Array<iTimeLog>,
    existingViews: {[key: string]: number},
    hospitalInContext: iHospital | null,
    defaultMapCenterCoordinates: iMapLatLng | null
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
    ReloadMap$: Observable<null>,
    DataQueryStrategy$: Observable<string>,
    HospitalInContext$: Observable<iHospital | null>,
    MapDefaultCenterCoordinates$: Observable<iMapLatLng>,

    state$: Observable<() => iStoreState>
    state: iStoreState;
}