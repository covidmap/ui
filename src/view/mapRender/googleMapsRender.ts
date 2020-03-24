import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapLatLng} from "../models/iMapRender";

export class GoogleMapsRender extends BaseMapRender {

    protected doLoadMap(divId: string): Promise<any> {
        const latLng = this.getGoogleLatLng(this.mapCenter);
        const mapDiv = document.getElementById(divId)!;
        //@ts-ignore
        const map = new google.maps.Map(mapDiv,{
            center: latLng,
            zoom: 2
        });
        return Promise.resolve(map);
    }

    protected doAddMarker(params: iMapAddMarkerParams): any {
        //@ts-ignore
        const marker = new google.maps.Marker({
            position: this.getGoogleLatLng(params.position),
            title: params.markerTitle
        });
        marker.setMap(this.mapObj);
        return marker;
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
        //console.log(Object.keys(this.markers).length,this.markers[Object.keys(this.markers)[0]]);
    }

    private getGoogleLatLng(latLng: iMapLatLng): any {
        //@ts-ignore
        return new google.maps.LatLng(latLng.lat,latLng.lng);
    }

}