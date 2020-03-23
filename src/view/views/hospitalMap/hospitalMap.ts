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
            <p>This is where the map will go</p>
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
        console.log(this.mapApi);
    }

    private updateMap(hospitalList: Array<iHospital>): void {
        console.log("Map update triggered!");
    }

    protected doDestroySelf(): void {}

}