import {BehaviorSubject} from "rxjs";
import {iHospital} from "./iHospital";


/**
 * Base Store operations
 */
export interface iStoreBase {}

/**
 * Base + logic relevant to this application
 */
export interface iStore extends iStoreBase {
    HospitalList$: BehaviorSubject<Array<iHospital>>
}