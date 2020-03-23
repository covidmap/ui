import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapLatLng} from "../models/iMapRender";

export class StubMapRender extends BaseMapRender {

    private mapCenterId = "stubMapCenter";
    private markersCountId = "stubMapMarkersCount";

    protected doAddMarker(params: iMapAddMarkerParams): any {}

    protected doLoadMap(div: HTMLDivElement): Promise<any> {
        div.innerHTML = `
            <p>This is a stub map with meta information</p>.
            <ul>
                <li><b>Map Center:</b> <span id="${this.mapCenterId}"></span></li>
                <li><b>Number of markers:</b> <span id="${this.markersCountId}"></span></li>
            </ul>
        `;
        this.refreshMapState();
        return Promise.resolve();
    }

    protected doRemoveMap(): void {}

    protected doRemoveMarker(markerObj: any): void {}

    protected doSetCenterCoordinates(position: iMapLatLng): void {
        this.refreshMapState();
    }

    protected refreshMapState() {
        //@ts-ignore
        document.getElementById(this.mapCenterId).innerHTML = JSON.stringify(this.mapCenter);
        //@ts-ignore
        document.getElementById(this.markersCountId).innerHTML = Object.keys(this.markers).length;
    }

}