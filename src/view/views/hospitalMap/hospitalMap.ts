import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";
import {iHospital} from "../../../store/models/iHospital";
import {iMapRender} from "../../models/iMapRender";
import {BaseMapRender} from "../mapRender/baseMapRender";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {LOG_LEVEL} from "../../../logger/models/iLog";
import {SingleHospitalDetails} from "../singleHospitalDetails/singleHospitalDetails.view";

export class HospitalMap extends BaseView {

    private mapContainerId: string;
    private mapApi: BaseMapRender;
    private mapReady = false;
    private mapSelectedApi: string;
    private hospitalSingleViewContainerId: string;
    private hospitalSingleViewId: string;
    private backToMapId: string;

    private currentHospitals: Array<iHospital> = [];

    protected doInit(): HtmlString {
        this.mapContainerId = this.getUniqueId();
        this.hospitalSingleViewContainerId = this.getUniqueId();
        this.hospitalSingleViewId = this.getUniqueId();
        this.backToMapId = this.getUniqueId();

        const singleHospitalSelector = this.modules.viewRegistry.selectors.SingleHospitalDetails;

        return `
            <div id="${this.mapContainerId}" class="hospitalMapContainer"></div>
            <div id="${this.hospitalSingleViewContainerId}" style="display:none">
                <${singleHospitalSelector} id="${this.hospitalSingleViewId}"></${singleHospitalSelector}>
                </br>
                </br>
                <button id="${this.backToMapId}">Back to Map</button> 
            </div>
        `;
    }

    protected onPlacedInDocument(): void {
        this.initSingleView();
        this.listenToMapReady();
        this.listenToSelectedMapApi();
        this.listenToHospitalList();
    }

    private initSingleView(): void {
        const singleView = <SingleHospitalDetails>document.getElementById(this.hospitalSingleViewId)!;
        singleView.init(this.modules);


        const backButton = document.getElementById(this.backToMapId)!;
        this.modules.subscriptionTracker.addEventListenerTo(
            backButton,'click',
            () => {
                const container = document.getElementById(this.hospitalSingleViewContainerId)!;
                container.style.display = "none";

                const map = document.getElementById(this.mapContainerId)!;
                map.style.display = "block";
            }
        );
    }

    private listenToMarkerClick(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.mapApi.markerClicked$,
            (hospitalName: string) => {
                this.handleMarkerClick(hospitalName);
            }
        );
    }

    private listenToMapReady(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.MapReady$,
            async (isReady: boolean) => {
                this.mapReady = isReady;
                if (this.mapReady && this.mapSelectedApi) {
                    await this.initMap(this.mapSelectedApi);
                }
            }
        );
    }

    private listenToSelectedMapApi(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.SelectedMapApiName$,
            async (mapName: string) => {
                this.mapSelectedApi = mapName;
                if (this.mapReady) {
                    await this.initMap(mapName);
                }
            }
        );
    }

    private listenToHospitalList(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.HospitalList$,
            async (newList: Array<iHospital>) => {
                this.currentHospitals = newList;
                if (this.mapReady) {
                    await this.updateMap(newList);
                }
            }
        );
    }

    private handleMarkerClick(hospitalName: string) {
        const hospital = this.currentHospitals.find(item => item.name === hospitalName)!;
        const singleView = <SingleHospitalDetails>document.getElementById(this.hospitalSingleViewId)!;
        singleView.setHospital(hospital);
        const container = document.getElementById(this.hospitalSingleViewContainerId)!;
        container.style.display = "block";

        const map = document.getElementById(this.mapContainerId)!;
        map.style.display = "none";
    }

    private async initMap(apiSelector: string): Promise<void> {
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: "Initializing map in HospitalMap view",
            data: {map: apiSelector},
            level: LOG_LEVEL.Debug
        });
        if (this.mapApi) {
            this.mapApi.destroy();
        }
        this.mapApi = <BaseMapRender>document.createElement(apiSelector);
        this.mapApi.init(this.modules);

        //@ts-ignore
        document.getElementById(this.mapContainerId).appendChild(this.mapApi);

        await this.mapApi.loadMap();
        this.listenToMarkerClick();
    }

    private async updateMap(hospitalList: Array<iHospital>): Promise<void> {
        if (!this.mapApi || !this.mapApi.isInitialized) {
            await this.initMap(this.mapSelectedApi);
        } else {
            this.mapApi.removeAllMarkers();
        }

        const lenMinus = hospitalList.length - 1;
        hospitalList.forEach((hospital,index) => {
            this.mapApi.streamAddMarker(hospital.name,{
                markerTitle: hospital.name,
                position: hospital.address.coordinates
            },index === lenMinus )
        });
    }

    protected doDestroySelf(): void {
        if (this.mapApi) {
            this.mapApi.destroy();
            //@ts-ignore
            this.mapApi = null;
        }
    }

}