import {iPhysicalAddress} from "../../common/models/iPhysicalAddress";

export interface iHospital {
    id: number,
    name: string,
    address: iPhysicalAddress,
    pinColor: string,
    reportCount: number,
    positiveReports: number,
    negativeReports: number,
    mostRecent: number
}