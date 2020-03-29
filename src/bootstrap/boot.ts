
import {boot, ENVIRONMENTS} from "./bootstrapper";
import {iHospital} from "../store/models/iHospital";
import {generateRandomString} from "../common/uuid";
import {DISPATCHER_MESSAGES} from "../dispatcher/dispatcher.messages";

const dispatcher = boot({
    environment: ENVIRONMENTS.Dev,

});
setTimeout(async () => {
    const tests = await new StubStoreDataQuery().queryHospitalList();
    dispatcher.dispatch(DISPATCHER_MESSAGES.ProvideHospitalList,tests);
    dispatcher.dispatch(DISPATCHER_MESSAGES.SetLoadingFalse);
},500);


const NUM_TEST = 10000;
class StubStoreDataQuery {

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
