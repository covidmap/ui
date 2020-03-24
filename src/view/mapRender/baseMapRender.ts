import {iMapAddMarkerParams, iMapLatLng, iMapRender} from "../models/iMapRender";
import {BehaviorSubject, Subject} from "rxjs";

/**
 * Provides common functionality for map operations
 */
export abstract class BaseMapRender implements iMapRender {

    private _mapObj: any;
    protected divId: string;
    protected markerClicked: Subject<string> = new Subject<string>();

    protected markers: { [key: string]: any } = {};
    protected mapCenter: iMapLatLng = {
        lat: 0,
        lng: 0
    };

    protected get mapObj() {
        return this._mapObj;
    }

    get markerClicked$() {
        return this.markerClicked.asObservable();
    }

    async loadMap(divId: string): Promise<void> {
        const divEl = <HTMLDivElement>document.getElementById(divId);
        if (!divEl) {
            throw new Error("Error in loadMap: div ID does not exist on document: " + divId);
        }

        const newDiv = document.createElement('div');
        newDiv.id = divId+"_map";
        newDiv.style.width = "100%";
        newDiv.style.height = "100%";
        divEl.appendChild(newDiv);
        this.divId = newDiv.id;
        this._mapObj = await this.doLoadMap(newDiv.id);
        this.initCallbackListeners();
    }

    addMarker(markerReferenceName: string, params: iMapAddMarkerParams): void {
        this.addMarkerHelper(markerReferenceName,params);
        this.refreshMapState();
    }

    streamAddMarker(markerReferenceName: string, params: iMapAddMarkerParams, isLast: boolean): void {
        this.addMarkerHelper(markerReferenceName,params);
        if (isLast) {
            this.refreshMapState();
        }
    }

    addMarkers(markers: Array<{
        markerReferenceName: string,
        params: iMapAddMarkerParams
    }>): void {
        markers.forEach(marker => {
            this.addMarkerHelper(marker.markerReferenceName,marker.params)
        });
        this.refreshMapState();
    }

    private addMarkerHelper(markerReferenceName: string, params: iMapAddMarkerParams): void {
        this.markers[markerReferenceName] = this.doAddMarker(params);
    }

    removeMarker(markerReferenceName: string): void {
        this.removeMarkerHelper(markerReferenceName);
        this.refreshMapState();
    }

    removeAllMarkers(): void {
        Object.keys(this.markers).forEach(name => {
            this.removeMarkerHelper(name);
        });
        this.refreshMapState();
    }

    private removeMarkerHelper(markerReferenceName: string): void {
        if (!this.markers[markerReferenceName]) {
            return;
        }

        this.doRemoveMarker(this.markers[markerReferenceName]);
        this.markers[markerReferenceName] = null;
    }

    removeMap(): void {
        this.removeAllMarkers();
        this.doRemoveMap();
        this._mapObj = null;

        const div = document.getElementById(this.divId)!;
        div.removeChild(div.childNodes[0]);
    }

    setCenterCoordinates(position: iMapLatLng): void {
        this.mapCenter = position;
        this.doSetCenterCoordinates(position);
        this.refreshMapState();
    }

    protected abstract initCallbackListeners(): void;

    protected abstract doSetCenterCoordinates(position: iMapLatLng): void;

    protected abstract doLoadMap(divId: string): Promise<any>;

    protected abstract doAddMarker(params: iMapAddMarkerParams): any;

    protected abstract doRemoveMarker(markerObj: any): void;

    protected abstract doRemoveMap(): void;

    protected abstract refreshMapState(): void;

}
