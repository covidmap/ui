import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapLatLng} from "../models/iMapRender";

export class GoogleMapsRender extends BaseMapRender {

    protected doLoadMap(divId: string): Promise<any> {
        const latLng = this.getGoogleLatLng(this.mapCenter);
        const mapDiv = document.getElementById(divId)!;
        //@ts-ignore
        const map = new google.maps.Map(mapDiv,{
            center: latLng,
            zoom: 8
        });
        return Promise.resolve(map);
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

    private getGoogleLatLng(latLng: iMapLatLng): any {
        //@ts-ignore
        return new google.maps.LatLng(latLng.lat,latLng.lng);
    }

}