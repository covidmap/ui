import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapLatLng} from "../models/iMapRender";

export class GoogleMapsRender extends BaseMapRender {

    private minZoom = 4;
    private maxZoom = 20;

    protected doLoadMap(divId: string): Promise<any> {
        const latLng = this.getGoogleLatLng(this.mapCenter);
        const mapDiv = document.getElementById(divId)!;
        //@ts-ignore
        const map = new google.maps.Map(mapDiv,{
            center: latLng,
            zoom: this.minZoom
        });
        this.setMapProperties(map);
        return Promise.resolve(map);
    }

    private setMapProperties(map: any): void {
        //@ts-ignore
        google.maps.event.addListener(map, 'bounds_changed', () =>{
            const currentZoom = map.getZoom();
            if (currentZoom > this.maxZoom) {
                map.setZoom(this.maxZoom);
                this.refreshMapState();
            } else if (currentZoom < this.minZoom) {
                map.setZoom(this.minZoom);
                this.refreshMapState();
            }
        });
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
        //@ts-ignore
        google.maps.event.trigger(this.mapObj,'resize')
    }

    private getGoogleLatLng(latLng: iMapLatLng): any {
        //@ts-ignore
        return new google.maps.LatLng(latLng.lat,latLng.lng);
    }

}