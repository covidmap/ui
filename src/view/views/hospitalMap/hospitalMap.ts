import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";
import {iHospital} from "../../../store/models/iHospital";
import {iMapRender} from "../../models/iMapRender";

export class HospitalMap extends BaseView {

    private mapContainerId: string;
    private mapApi: iMapRender;

    protected doInit(): HtmlString {
        this.mapContainerId = this.getUniqueId();

        return `
            <div id="${this.mapContainerId}" class="hospitalMapContainer"></div>
        `;
    }

    protected onPlacedInDocument(): void {
        this.listenToSelectedMapApi();
        this.listenToHospitalList();
    }

    private listenToSelectedMapApi(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.SelectedMapApiName$,
            (mapName: string) => {
                this.initMap(mapName);
            }
        );
    }

    private listenToHospitalList(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.HospitalList$,
            (newList: Array<iHospital>) => {
                this.updateMap(newList);
            }
        );
    }

    private initMap(apiName: string): void {
        if (this.mapApi) {
            this.mapApi.removeMap();
        }
        this.mapApi = this.modules.mapRenderFactory.getMap(apiName);
        this.mapApi.loadMap(this.mapContainerId);
    }

    private updateMap(hospitalList: Array<iHospital>): void {
        this.mapApi.removeAllMarkers();
        hospitalList.forEach((hospital: iHospital) => {
            this.mapApi.addMarker(hospital.name,{
                markerTitle: hospital.name,
                position: hospital.address.coordinates
            });
        });
    }

    protected doDestroySelf(): void {}

}