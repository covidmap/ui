
import {generateRandomString} from "../../common/uuid";
import {iStoreDataQuery} from "../models/iStoreDataQuery";
import {iHospital} from "../models/iHospital";

const NUM_TEST = 10000;
export class StubStoreDataQuery implements iStoreDataQuery {

    async queryHospitalList(): Promise<Array<iHospital>> {
        await new Promise((resolve) => setTimeout(resolve,40));
        let ar = [];
        for (let i=0; i<NUM_TEST; i++) {
            ar.push(this.generateTestCase());
        }
        return ar;
    }

    private generateTestCase(): iHospital {
        return {
            id: Math.floor(Math.random()*1234567),
            name: "hospital_"+generateRandomString(8),
            address: {
                streetLineOne: "street_one",
                streetLineTwo: "street_two",
                cityTown: "city_of_"+generateRandomString(5),
                stateRegion: "state",
                zipcode: "12345",
                country: "USA",
                coordinates: {
                    lat: Math.random()*200 - 100,
                    lng: Math.random()*200 - 100
                }
            },
            pinColor: ["GREEN","YELLOW","RED","NEUTRAL"][Math.floor(Math.random()*4)],
            website: Math.round(Math.random())===0?"":"https://github.com/covidmap",
            reportCount: Math.floor(Math.random()*2000),
            positiveReports: Math.floor(Math.random()*1000),
            negativeReports: Math.floor(Math.random()*1000),
            mostRecent: +new Date()
        }
    }

}
