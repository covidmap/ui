import {BehaviorSubject, Subject} from "rxjs";
import {BaseView} from "../baseView";
import {iMapAddMarkerParams, iMapLatLng, iMapRender} from "../../models/iMapRender";
import {HtmlString} from "../../models/iView";

/**
 * Provides common functionality for map operations
 */
export abstract class BaseMapRender extends BaseView implements iMapRender {

    private _mapObj: any = null;
    protected divId: string;
    protected markerClicked: Subject<string> = new Subject<string>();

    protected markers: { [key: string]: any } = {};
    protected mapCenter: iMapLatLng = {
        lat: 0,
        lng: 0
    };

    get isInitialized(): boolean {
        return !!this._mapObj;
    }

    protected doInit(): HtmlString {
        this.divId = this.getUniqueId();
        return `
            <div id="${this.divId}"></div>
        `;
    }

    protected get mapObj() {
        return this._mapObj;
    }

    get markerClicked$() {
        return this.markerClicked.asObservable();
    }

    async loadMap(): Promise<void> {
        const newDiv = document.getElementById(this.divId)!;
        newDiv.style.width = "100%";
        newDiv.style.height = "100%";

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
        //@ts-ignore
        div.parentNode.removeChild(div);
    }

    setCenterCoordinates(position: iMapLatLng): void {
        this.mapCenter = position;
        this.doSetCenterCoordinates(position);
        this.refreshMapState();
    }

    protected doDestroySelf(): void {
        this.removeMap();
    }

    protected onPlacedInDocument(): void {
    }

    protected abstract initCallbackListeners(): void;

    protected abstract doSetCenterCoordinates(position: iMapLatLng): void;

    protected abstract doLoadMap(divId: string): Promise<any>;

    protected abstract doAddMarker(params: iMapAddMarkerParams): any;

    protected abstract doRemoveMarker(markerObj: any): void;

    protected abstract doRemoveMap(): void;

    protected abstract refreshMapState(): void;

}
