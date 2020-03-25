import {iPhysicalAddress} from "../../common/models/iPhysicalAddress";

export interface iHospital {
    id: number,
    name: string,
    address: iPhysicalAddress,
    website: string,
    pinColor: string,
    reportCount: number,
    positiveReports: number,
    negativeReports: number,
    mostRecent: number
}