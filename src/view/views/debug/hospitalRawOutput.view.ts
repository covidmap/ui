import { BaseView } from "../baseView";
import { HtmlString } from "../../models/iView";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {iHospital} from "../../../store/models/iHospital";
import {iStore, iStoreState} from "../../../store/models/iStore";
import {SingleHospitalDetails} from "../singleHospitalDetails/singleHospitalDetails.view";


export class HospitalRawOutput extends BaseView {

    private summaryUlId: string;
    private singleHospitalId: string;
    private singleHospitalContainerId: string;
    private refreshButtonId: string;
    private dataStoreId: string;
    private showDataStoreId: string;
    private unloadButtonId: string;
    private mapTypeSelectId: string;

    private showDebugStore: boolean = false;
    private storeGetState: () => iStoreState;

    private selectedMapApi: string;

    private spanNames = {
        SummaryNumHospitals: "SummaryNumHospitals"
    };

    protected doInit(): HtmlString {
        this.summaryUlId = this.getUniqueId();
        this.refreshButtonId = this.getUniqueId();
        this.singleHospitalId = this.getUniqueId();
        this.dataStoreId = this.getUniqueId();
        this.showDataStoreId = this.getUniqueId();
        this.unloadButtonId = this.getUniqueId();
        this.mapTypeSelectId = this.getUniqueId();

        const singleHospitalSelector = this.modules.viewRegistry.selectors.SingleHospitalDetails;
        const numSpan = this.registerSpanInterpolator(this.spanNames.SummaryNumHospitals);

        return `
            <span class="loadButtons">
                <button id="${this.refreshButtonId}">Refresh Data</button>
                <button id="${this.unloadButtonId}">Unload Data</button>
            </span>
            </br>
            </br>
            <h2>Choose Map Type</h2>
            <select id="${this.mapTypeSelectId}" style="width:400px;"></select>
            </br>
            </br>
            <h2>Hospitals Summary</h2>
            <p><b>Note:</b> this view is for debug purposes only.  Click refresh below to load the data for this and other view pages.</p>
            <ul id="${this.summaryUlId}">
                <li><b>Number of Hospitals</b>: ${numSpan}</li>
            </ul>
            </br>
            </br>
            <div id="${this.singleHospitalContainerId}">
                <${singleHospitalSelector} id="${this.singleHospitalId}"></${singleHospitalSelector}>
                </br>
                </br>
            </div>
            <h2>Store Contents</h2>
            <p>The current contents of the datastore:</p>
            <span style="display:inline-block">
                <label for="showState">Show Store State (may slow down application):</label>
                <input type="checkbox" id="${this.showDataStoreId}"></inputcheckbox>
            </span>
            <textarea id="${this.dataStoreId}"></textarea>
        `;
    }

    protected onPlacedInDocument(): void {
        const button = document.getElementById(this.refreshButtonId)!;
        button.addEventListener('click',() => {
            this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.QueryHospitalList);
        });
        const unloadButton = document.getElementById(this.unloadButtonId)!;
        unloadButton.addEventListener('click',() => {
            this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.UnloadHospitalList);
        });

        const singleHospital = <BaseView>document.getElementById(this.singleHospitalId)!;
        singleHospital.init(this.modules);

        this.listenToMapApi();

        this.listenToHospitalList();
        this.listenToDebugShowStore();
        this.listenToStoreState();
        this.listenToStoreCheckboxToggle();
    }

    protected doDestroySelf(): void {}

    private listenToMapApi() {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.SelectedMapApiName$,
            (name: string) => {
                this.selectedMapApi = name;
                this.initMapSelect();
            }
        )
    }

    private initMapSelect(): void {
        const mapSelect = document.getElementById(this.mapTypeSelectId)!;
        mapSelect.innerHTML = '';
        Object.values(this.modules.viewRegistry.mapSelectors).forEach(selector => {
            const newOption = document.createElement('option');
            newOption.value = selector;
            newOption.innerHTML = selector;
            mapSelect.appendChild(newOption);
        });

        const that = this;
        const updateMap = function() {
            const value = this.value;
            that.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.ChangeSelectedMapApi,value);
        };

        //@ts-ignore
        mapSelect.value = this.selectedMapApi;

        mapSelect.removeEventListener('click',updateMap);
        mapSelect.addEventListener('click',updateMap);
    }

    private listenToHospitalList(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.HospitalList$,
            (newList: Array<iHospital>) => {
                if (newList.length > 0) {
                    document.getElementById(this.singleHospitalContainerId)!.style.display = "block";
                    const singleHospital = <SingleHospitalDetails>document.getElementById(this.singleHospitalId)!;
                    singleHospital.setHospital(newList[0]);
                } else {
                    document.getElementById(this.singleHospitalContainerId)!.style.display = "none";
                }
                this.updateSpanHtml(this.spanNames.SummaryNumHospitals, newList.length);
            }
        )
    }

    private listenToStoreState(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.state$,
            (state: () => iStoreState) => {
                this.storeGetState = state;
                this.updateStateElement();
            }
        );
    }

    private listenToDebugShowStore(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.DebugShowStoreState$,
            (state: boolean) => {
                this.showDebugStore = state;
                const el = <HTMLInputElement>document.getElementById(this.showDataStoreId)!;
                el.checked = state;
                this.updateStateElement();
            }
        );
    }

    private listenToStoreCheckboxToggle(): void {
        const el = <HTMLInputElement>document.getElementById(this.showDataStoreId)!;
        const that = this;
        el.addEventListener('click',function() {
            that.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.DebugToggleShowStoreState);
        });
    }

    private updateStateElement(): void {
        const textarea = document.getElementById(this.dataStoreId)!;
        if (this.showDebugStore && this.storeGetState) {
            textarea.innerHTML = JSON.stringify(this.storeGetState(), null, 4);
        } else {
            textarea.innerHTML = "Showing state is currently disabled.";
        }
    }

}