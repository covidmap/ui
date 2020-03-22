import {iStoreDataQuery} from "../models/iStoreDataQuery";
import {iHospital} from "../models/iHospital";

export class StubStoreDataQuery implements iStoreDataQuery {

    async queryHospitalList(): Promise<Array<iHospital>> {
        return [{
            name: "hospital_one_test",
            address: {
                streetLineOne: "street_one",
                streetLineTwo: "street_two",
                cityTown: "city",
                stateRegion: "state",
                zipcode: "12345",
                country: "USA",
                coordinates: {
                    lat: 0,
                    lng: 1
                }
            }
        },{
            name: "hospital_two_test",
            address: {
                streetLineOne: "street_one",
                streetLineTwo: "street_two",
                cityTown: "city",
                stateRegion: "state",
                zipcode: "12345",
                country: "USA",
                coordinates: {
                    lat: 0,
                    lng: 1
                }
            }
        }]
    }

}