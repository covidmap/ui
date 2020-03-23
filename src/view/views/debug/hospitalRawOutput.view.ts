import { BaseView } from "../baseView";
import { HtmlString } from "../../models/iView";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {iHospital} from "../../../store/models/iHospital";
import {iStore, iStoreState} from "../../../store/models/iStore";


export class HospitalRawOutput extends BaseView {

    private summaryUlId: string;
    private singleHospitalId: string;
    private refreshButtonId: string;
    private dataStoreId: string;

    private spanNames = {
        SummaryNumHospitals: "SummaryNumHospitals"
    };

    protected doInit(): HtmlString {
        this.summaryUlId = this.getUniqueId();
        this.refreshButtonId = this.getUniqueId();
        this.singleHospitalId = this.getUniqueId();
        this.dataStoreId = this.getUniqueId();

        const singleHospitalSelector = this.modules.viewRegistry.selectors.SingleHospitalDetails;
        const numSpan = this.registerSpanInterpolator(this.spanNames.SummaryNumHospitals);

        return `
            <button id="${this.refreshButtonId}">Refresh Data</button>
            </br>
            </br>
            <h2>Hospitals Summary</h2>
            <p><b>Note:</b> this view is for debug purposes only.  Click refresh below to load the data for this and other view pages.</p>
            <ul id="${this.summaryUlId}">
                <li><b>Number of Hospitals</b>: ${numSpan}</li>
            </ul>
            </br>
            </br>
            <${singleHospitalSelector} id="${this.singleHospitalId}"></${singleHospitalSelector}>
            </br>
            </br>
            <h2>Store Contents</h2>
            <p>The current contents of the datastore:</p>
            <textarea id="${this.dataStoreId}"></textarea>
        `;
    }

    protected onPlacedInDocument(): void {
        const button = document.getElementById(this.refreshButtonId)!;
        button.addEventListener('click',() => {
            this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.QueryHospitalList);
        });

        const singleHospital = <BaseView>document.getElementById(this.singleHospitalId)!;
        singleHospital.init(this.modules);

        this.listenToHospitalList();
        this.listenToStoreState();
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

    private listenToStoreState(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.state$,
            (state: iStoreState) => {
                this.updateStateElement(state);
            }
        )
    }

    private updateStateElement(state: iStoreState): void {
        const textarea = document.getElementById(this.dataStoreId)!;
        textarea.innerHTML = JSON.stringify(state,null,4);
    }

}