import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";
import {iHospital} from "../../../store/models/iHospital";
import {iMapRender} from "../../models/iMapRender";
import {BaseMapRender} from "../mapRender/baseMapRender";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {LOG_LEVEL} from "../../../logger/models/iLog";
import {SingleHospitalDetails} from "../singleHospitalDetails/singleHospitalDetails.view";
import {map} from "rxjs/operators";
import {AddressFormatterOptions} from "../../../common/models/iAddressFormatter";

export class HospitalMap extends BaseView {

    private mapContainerId: string;
    private mapApi: BaseMapRender;
    private mapReady = false;
    private mapSelectedApi: string;
    private hospitalSingleViewContainerId: string;
    private hospitalSingleViewId: string;
    private backToMapId: string;
    private openInMapsId: string;
    private openHospitalWebsiteId: string;

    private currentHospitals: Array<iHospital> = [];
    private selectedHospital: iHospital;

    protected doInit(): HtmlString {
        this.mapContainerId = this.getUniqueId();
        this.hospitalSingleViewContainerId = this.getUniqueId();
        this.hospitalSingleViewId = this.getUniqueId();
        this.backToMapId = this.getUniqueId();
        this.openInMapsId = this.getUniqueId();
        this.openHospitalWebsiteId = this.getUniqueId();

        const singleHospitalSelector = this.modules.viewRegistry.selectors.SingleHospitalDetails;

        return `
            <div id="${this.mapContainerId}" class="hospitalMapContainer"></div>
            <div id="${this.hospitalSingleViewContainerId}" class="singleHospitalContainer" class="hidden">
                <${singleHospitalSelector} id="${this.hospitalSingleViewId}"></${singleHospitalSelector}>
                </br>
                </br>
                <span class="hospitalMapButtonsRow">
                    <button id="${this.openHospitalWebsiteId}" class="singleHospitalButton">Open Hospital Website</button> 
                    <button id="${this.openInMapsId}" class="singleHospitalButton">Open in Google Maps</button> 
                    <button id="${this.backToMapId}" class="singleHospitalButton">Back to Main Map</button>
                </span> 
            </div>
        `;
    }

    protected onPlacedInDocument(): void {
        this.initSingleView();
        this.listenToMapReady();
        this.listenToSelectedMapApi();
        this.listenToReloadMap();
        this.listenToHospitalList();
    }

    private listenToReloadMap(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.ReloadMap$,
            async () => {
                if (this.mapReady && this.mapSelectedApi) {
                    await this.initMap(this.mapSelectedApi);
                }
            }
        );
    }

    private initSingleView(): void {
        const singleView = <SingleHospitalDetails>document.getElementById(this.hospitalSingleViewId)!;
        singleView.init(this.modules);

        const backButton = document.getElementById(this.backToMapId)!;
        const closeButton = document.getElementById("closeButton")!; // TODO(jen) inconsistent to use literal id here; kludge b/c it's created in singleHospitalDetails, not here.
        this.modules.subscriptionTracker.addEventListenerTo(
            backButton,'click',
            () => {
                this.backToMap();
            }
        );
        this.modules.subscriptionTracker.addEventListenerTo(
            closeButton,'click',
            () => {
                this.backToMap();
            }
        );
        const openInMapsButton = document.getElementById(this.openInMapsId)!;
        this.modules.subscriptionTracker.addEventListenerTo(
            openInMapsButton,'click',
            () => {
                const adrSearch = this.selectedHospital.name+", "+this.modules.addressFormatter.format(this.selectedHospital.address,AddressFormatterOptions.SINGLE_LINE);
                window.open(`https://www.google.com/maps/search/${adrSearch}`,'_blank')
            }
        );
        const openWebsiteButton = document.getElementById(this.openHospitalWebsiteId)!;

        this.modules.subscriptionTracker.addEventListenerTo(
            openWebsiteButton,'click',
            () => {
                window.open(this.selectedHospital.website,'_blank')
            }
        );
    }

    /**
     * Callback when the user takes action to return to the map
     */
    private backToMap(): void {
        const container = document.getElementById(this.hospitalSingleViewContainerId)!;
        container.classList.add('hidden');
        container.classList.remove('force-block');

        const map = document.getElementById(this.mapContainerId)!;
        map.classList.add('force-block');
        map.classList.remove('hidden');

        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.CurrentPageDisplayClass,"main");
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
        container.classList.add('force-block');
        container.classList.remove('hidden');

        const map = document.getElementById(this.mapContainerId)!;
        map.classList.add('hidden');
        map.classList.remove('force-block');

        this.selectedHospital = hospital;
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.CurrentPageDisplayClass,"margin");

        const openWebsiteButton = document.getElementById(this.openHospitalWebsiteId)!;
        if (!this.selectedHospital.website) {
            openWebsiteButton.style.display = "none";
        } else {
            openWebsiteButton.style.display = "block";
        }
    }

    private async initMap(apiSelector: string): Promise<void> {

        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: "Initializing map in HospitalMap view",
            data: {map: apiSelector},
            level: LOG_LEVEL.Debug
        });
        this.mapApi = <BaseMapRender>document.createElement(apiSelector);
        this.mapApi.init(this.modules);

        const mapContainer = document.getElementById(this.mapContainerId)!;
        mapContainer.childNodes[0] && mapContainer.removeChild(mapContainer.childNodes[0]);
        mapContainer.appendChild(this.mapApi);

        await this.mapApi.loadMap();
        this.listenToMarkerClick();
    }

    private async updateMap(hospitalList: Array<iHospital>): Promise<void> {
        if (!this.mapApi || !this.mapApi.isInitialized) {
            await this.initMap(this.mapSelectedApi);
        } else {
            this.mapApi.removeAllMarkers();
        }
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: "Adding markers based on new hospital list in HospitalMap view",
            data: {length: hospitalList.length},
            level: LOG_LEVEL.Debug
        });

        const lenMinus = hospitalList.length - 1;
        hospitalList.forEach((hospital,index) => {
            this.mapApi.streamAddMarker(hospital.name,{
                markerTitle: hospital.name,
                position: hospital.address.coordinates,
                color: hospital.pinColor
            },index === lenMinus )
        });
    }

    protected doDestroySelf(): void {}

}
