import {BehaviorSubject, Subject} from "rxjs";
import {iHospital} from "./iHospital";
import {BaseView} from "../../view/views/baseView";


/**
 * Base Store operations
 */
export interface iStoreBase {}

export interface iStoreState {
    hospitalList: Array<iHospital>,
    currentPage: string
}

/**
 * Base + logic relevant to this application
 */
export interface iStore extends iStoreBase {
    HospitalList$: BehaviorSubject<Array<iHospital>>,
    CurrentPageSelector$: BehaviorSubject<string>

    state$: Subject<() => iStoreState>
}