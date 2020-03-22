import {iHospital} from "./iHospital";

export interface iStoreDataQuery {

    queryHospitalList(): Promise<Array<iHospital>>

}