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
        this.listenToHospitalList();
        this.mapApi = this.modules.mapRenderFactory.getMap(
            this.modules.mapRenderFactory.mapNames.GoogleMaps
        );
        console.log(this.mapApi);
    }

    private listenToHospitalList(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.HospitalList$,
            (newList: Array<iHospital>) => {
                this.updateMap(newList);
            }
        )
    }

    private updateMap(hospitalList: Array<iHospital>): void {
        console.log("Map update triggered!");
    }

    protected doDestroySelf(): void {}

}