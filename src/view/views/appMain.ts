import {BaseView} from "./baseView";
import {HtmlString} from "../models/iView";
import {HospitalRawOutput} from "./rawOutput/hospitalRawOutput.view";
import {SingleHospitalDetails} from "./singleHospitalDetails/singleHospitalDetails.view";
import {iHospital} from "../../store/models/iHospital";

export class AppMain extends BaseView {

    private hospitalRawId: string;
    private singleHospitalDetailsId: string;

    protected doInit(): HtmlString {
        const debugSelector = this.modules.viewRegistry.selectors.HospitalRawOutput;
        const singleSelector = this.modules.viewRegistry.selectors.SingleHospitalDetails;
        this.hospitalRawId = this.getUniqueId();

        return `
            <h1>Main App</h1>
            <${debugSelector} id="${this.hospitalRawId}"></${debugSelector}>
            
            <p>Test single view:</p>
            <${singleSelector} id="${this.singleHospitalDetailsId}"></${singleSelector}>
        `;
    }

    get selector(): string {
        return "app-main";
    }

    protected onPlacedInDocument(): void {
        const hospitalRaw = <HospitalRawOutput>document.getElementById(this.hospitalRawId)!;
        hospitalRaw.init(this.modules);

        const singleViewRaw = this.getSingleViewElement();
        singleViewRaw.init(this.modules);

        this.listenToHospitalList();
    }

    private getSingleViewElement(): SingleHospitalDetails {
        return <SingleHospitalDetails>document.getElementById(this.singleHospitalDetailsId);
    }

    private listenToHospitalList(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.HospitalList$,
            (newList: Array<iHospital>) => {
                this.getSingleViewElement().setHospital(newList[0])
            }
        )
    }

    get viewName(): string {
        return "MainApp";
    }

    protected doDestroySelf(): void {}


}