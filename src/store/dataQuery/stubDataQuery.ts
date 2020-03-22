import {iStoreDataQuery} from "../models/iStoreDataQuery";
import {iHospital} from "../models/iHospital";

export class StubStoreDataQuery implements iStoreDataQuery {

    async queryHospitalList(): Promise<Array<iHospital>> {
        return [{
            name: "test_one",
            address: {
                street: "adr1"
            }
        },{
            name: "test_two",
            address: {
                street: "adr2"
            }
        }]
    }

}