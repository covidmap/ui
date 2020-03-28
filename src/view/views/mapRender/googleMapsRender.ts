import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapBounds, iMapLatLng} from "../../models/iMapRender";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";

export class GoogleMapsRender extends BaseMapRender {

    private minZoom = 6;
    private maxZoom = 20;

    private outOfBounds: Array<{
        name: string,
        params: iMapAddMarkerParams
    }> = [];

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

        if (this.mapState.bounds) {
            this.setBounds(this.mapState.bounds,false,true);
        } else {
            //@ts-ignore
            const bounds = this.getMapBounds(this.mapObj);
            if (bounds) {
                this.setBounds(bounds, true, false);
            }
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
            const mapBounds = this.getMapBounds(map);
            this.mapState.bounds = mapBounds;

            this.outOfBounds.forEach((item,index) => {
                if (this.coordinateWithinBounds(mapBounds,item.params.position)) {
                    this.addMarker(item.name,item.params);
                    this.outOfBounds.splice(index,1);
                }
            });

            this.dispatchMapState();
        });

        this.initCenterMap();
    }

    private getMapBounds(map: any): iMapBounds {
        const bounds = map.getBounds();
        if (!bounds) {
            //@ts-ignore
            return null;
        }
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        return {
            northEast: {
                lat: ne.lat(),
                lng: ne.lng()
            },
            southWest: {
                lat: sw.lat(),
                lng: sw.lng()
            }
        };
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

        const currentBounds = this.mapState.bounds!;
        if (currentBounds && this.coordinateWithinBounds(currentBounds,params.position)) {
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
        } else {
            this.outOfBounds.push({
                name: markerReferenceName,
                params
            });
            return null;
        }
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

    private initCenterMap(): void {
        const initialPosition = this.modules.store.state.defaultMapCenterCoordinates;
        if (!initialPosition || (initialPosition.lat === 0 && initialPosition.lng === 0)) {
            return; //don't add this if there is no initial state
        }

        let CenterControl = function(controlDiv: any,map: any) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.style.borderRadius = '3px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '22px';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '16px';
            controlText.style.lineHeight = '38px';
            controlText.style.paddingLeft = '5px';
            controlText.style.paddingRight = '5px';
            controlText.innerHTML = 'Center Map';
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to Chicago.
            controlUI.addEventListener('click', function() {
                map.setCenter(initialPosition);
            });
        };

        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        let centerControlDiv = document.createElement('div');
        //@ts-ignore
        let centerControl: any = new CenterControl(centerControlDiv, this.mapObj);
        //@ts-ignore
        centerControlDiv.index = 1;
        //@ts-ignore
        this.mapObj.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
    }

    private getGoogleLatLng(latLng: iMapLatLng): any {
        //@ts-ignore
        return new google.maps.LatLng(latLng.lat,latLng.lng);
    }

}