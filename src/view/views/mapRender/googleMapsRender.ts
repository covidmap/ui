import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapBounds, iMapLatLng} from "../../models/iMapRender";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";

export class GoogleMapsRender extends BaseMapRender {

    private minZoom = 6;
    private maxZoom = 20;

    protected doLoadMap(divId: string): Promise<any> {
        const mapDiv = document.getElementById(divId)!;
        const creationParams = {
            center: this.mapState.center,
            zoom: this.mapState.zoom
        };
        //@ts-ignore
        const map = new google.maps.Map(mapDiv,{
            center: this.mapState.center,
            zoom: this.mapState.zoom
        });
        return Promise.resolve(map);
    }

    protected initCallbackListeners(): void {

        if (this.mapState.bounds) {
            this.setBounds(this.mapState.bounds,false,true);
        } else {
            const bounds = this.mapObj.getBounds();
            bounds && this.setBounds({
                northEast: bounds.getNorthEast(),
                southWest: bounds.getSouthWest()
            },true,false);
        }

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
            const bounds = map.getBounds();
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            this.mapState.bounds = {
                northEast: {
                    lat: ne.lat(),
                    lng: ne.lng()
                },
                southWest: {
                    lat: sw.lat(),
                    lng: sw.lng()
                }
            };

            this.dispatchMapState();
        });
    }

    protected doSetBounds(bounds: iMapBounds): void {
        //@ts-ignore
        this.mapObj.fitBounds(new google.maps.LatLngBounds(bounds.southWest,bounds.northEast));
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