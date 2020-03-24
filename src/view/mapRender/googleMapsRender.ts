import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapLatLng} from "../models/iMapRender";

export class GoogleMapsRender extends BaseMapRender {

    protected doLoadMap(div: HTMLDivElement): Promise<any> {
        const map = new google.maps.Map(div,{
            center: this.mapCenter,
            zoom: 8
        });
    }

    protected doAddMarker(params: iMapAddMarkerParams): any {
    }

    protected doRemoveMap(): void {
    }

    protected doRemoveMarker(markerObj: any): void {
    }

    protected doSetCenterCoordinates(position: iMapLatLng): void {
    }

    protected initCallbackListeners(): void {
    }

    protected refreshMapState(): void {
    }



}