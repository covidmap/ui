const cryptoRandomString = require('crypto-random-string');

import {iStoreDataQuery} from "../models/iStoreDataQuery";
import {iHospital} from "../models/iHospital";

const NUM_TEST = 60000;
export class StubStoreDataQuery implements iStoreDataQuery {

    async queryHospitalList(): Promise<Array<iHospital>> {
        await new Promise((resolve) => setTimeout(resolve,100));
        let ar = [];
        for (let i=0; i<NUM_TEST; i++) {
            ar.push(this.generateTestCase());
        }
        return ar;
    }

    private generateTestCase(): iHospital {
        return {
            name: "hospital_"+cryptoRandomString({length:10}),
            address: {
                streetLineOne: "street_one",
                streetLineTwo: "street_two",
                cityTown: "city_of_"+cryptoRandomString({length:5}),
                stateRegion: "state",
                zipcode: "12345",
                country: "USA",
                coordinates: {
                    lat: Math.random()*2000 - 1000,
                    lng: Math.random()*2000 - 1000
                }
            }
        }
    }

}