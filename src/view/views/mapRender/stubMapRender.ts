import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapLatLng} from "../../models/iMapRender";

export class StubMapRender extends BaseMapRender {

    private mapCenterId: string;
    private markersCountId: string;
    private mapZoomId: string;
    private buttonMarkerClickedId: string;

    protected doAddMarker(markerReferenceName: string, params: iMapAddMarkerParams): any {}

    protected doLoadMap(divId: string): Promise<any> {
        this.mapCenterId = this.getUniqueId();
        this.markersCountId = this.getUniqueId();
        this.mapZoomId = this.getUniqueId();
        this.buttonMarkerClickedId = this.getUniqueId();

        const div = document.getElementById(divId)!;
        div.innerHTML = `
            <p>This is a stub map with meta information.  To load data, visit debug screen and click "reload", then come back here for updates.</p>
            <ul>
                <li><b>Map Center:</b> <span id="${this.mapCenterId}"></span></li>
                <li><b>Map Zoom:</b> <span id="${this.mapZoomId}"></span></li>
                <li><b>Number of markers:</b> <span id="${this.markersCountId}"></span></li>
            </ul>
            <button id="${this.buttonMarkerClickedId}">Click to Simulate Marker Click</button>
        `;

        this.doSetCenterCoordinates(this.mapState.center);
        this.doSetZoom(this.mapState.zoom);

        this.refreshMapState();
        return Promise.resolve();
    }

    protected doRemoveMap(): void {}

    protected doRemoveMarker(markerObj: any): void {}

    protected doSetCenterCoordinates(position: iMapLatLng): void {
        console.log("new center: "+position);
        this.refreshMapState();
    }

    protected doSetZoom(zoom: number): void {
        console.log("new zoom: "+zoom);
        this.refreshMapState();
    }

    protected refreshMapState() {
        //@ts-ignore
        document.getElementById(this.mapCenterId).innerHTML = JSON.stringify(this.mapState.center);
        //@ts-ignore
        document.getElementById(this.markersCountId).innerHTML = Object.keys(this.markers).length;
        //@ts-ignore
        document.getElementById(this.mapZoomId).innerHTML = JSON.stringify(this.mapState.zoom)
    }

    protected initCallbackListeners(): void {
        const that = this;
        //@ts-ignore
        document.getElementById(this.buttonMarkerClickedId).addEventListener('click',function() {
            if (Object.keys(that.markers).length !== 0) {
                that.markerClicked.next(Object.keys(that.markers)[0])
            }
        });
    }

}