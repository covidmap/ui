import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapLatLng} from "../../models/iMapRender";

export class GoogleMapsRender extends BaseMapRender {

    private minZoom = 6;
    private maxZoom = 20;

    protected doLoadMap(divId: string): Promise<any> {
        const mapDiv = document.getElementById(divId)!;
        //@ts-ignore
        const map = new google.maps.Map(mapDiv,{
            center: this.mapState.center,
            zoom: this.mapState.zoom
        });
        return Promise.resolve(map);
    }

    protected initCallbackListeners(): void {
        const map = this.mapObj;
        //@ts-ignore
        google.maps.event.addListener(map, 'bounds_changed', () =>{
            let currentZoom = map.getZoom();
            if (currentZoom > this.maxZoom) {
                map.setZoom(this.maxZoom);
                currentZoom = this.maxZoom;
            } else if (currentZoom < this.minZoom) {
                map.setZoom(this.minZoom);
                currentZoom = this.minZoom;
            }
            const center = map.getCenter();
            this.mapState.zoom = currentZoom;
            this.mapState.center = {
                lat: center.lat(),
                lng: center.lng()
            };
        });
    }

    protected doSetZoom(zoom: number): void {
        this.mapObj.setZoom(zoom);
    }

    protected doAddMarker(markerReferenceName: string,params: iMapAddMarkerParams): any {
        let color = (params.color || "gray").toLowerCase();
        if (color === "neutral") {
            color = "gray";
        }

        //@ts-ignore
        const marker = new google.maps.Marker({
            position: this.getGoogleLatLng(params.position),
            title: params.markerTitle,
            icon: {
                url: `img/mapMarkers/32/${color}-min.png`,
            }
        });
        marker.setMap(this.mapObj);

        marker.addListener('click',() => {
             this.markerClicked.next(markerReferenceName);
        });
        return marker;
    }

    protected doSetCenterCoordinates(position: iMapLatLng): void {
        this.mapObj.setCenter(this.getGoogleLatLng(position));
    }

    protected doRemoveMap(): void {
    }

    protected doRemoveMarker(markerObj: any): void {
    }


    protected refreshMapState(): void {
        //@ts-ignore
        //google.maps.event.trigger(this.mapObj,'resize')
    }

    private getGoogleLatLng(latLng: iMapLatLng): any {
        //@ts-ignore
        return new google.maps.LatLng(latLng.lat,latLng.lng);
    }

}