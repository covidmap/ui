import { BaseView } from "../baseView";
import { HtmlString } from "../../models/iView";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {iHospital} from "../../../store/models/iHospital";


export class HospitalRawOutput extends BaseView {

    private summaryUlId: string;
    private refreshButtonId: string;

    private spanNames = {
        SummaryNumHospitals: "SummaryNumHospitals"
    };

    protected doInit(): HtmlString {
        this.summaryUlId = this.getUniqueId();
        this.refreshButtonId = this.getUniqueId();

        const numSpan = this.registerSpanInterpolator(this.spanNames.SummaryNumHospitals);

        return `
            <h2>Hospitals Summary</h2>
            <p><b>Note:</b> this view is for debug purposes only.  Click refresh below to load the data for this and other view pages.</p>
            <ul id="${this.summaryUlId}">
                <li><b>Number of Hospitals</b>: ${numSpan}</li>
            </ul>
            <button id="${this.refreshButtonId}">Refresh Data</button>
        `;
    }

    protected onPlacedInDocument(): void {
        const button = document.getElementById(this.refreshButtonId)!;
        button.addEventListener('click',() => {
            this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.QueryHospitalList);
        });
        this.listenToHospitalList();
    }

    protected doDestroySelf(): void {}

    private listenToHospitalList(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.HospitalList$,
            (newList: Array<iHospital>) => {
                this.updateSpanHtml(this.spanNames.SummaryNumHospitals,newList.length)
            }
        )
    }

}