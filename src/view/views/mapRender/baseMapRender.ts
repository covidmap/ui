import {BehaviorSubject, Subject} from "rxjs";
import {BaseView} from "../baseView";
import {iMapAddMarkerParams, iMapBounds, iMapLatLng, iMapRender, iMapState} from "../../models/iMapRender";
import {HtmlString} from "../../models/iView";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {LOG_LEVEL} from "../../../logger/models/iLog";

/**
 * Provides common functionality for map operations
 */
export abstract class BaseMapRender extends BaseView implements iMapRender {

    protected mapState: iMapState;

    private _mapObj: any = null;
    protected divId: string;
    protected markerClicked: Subject<string> = new Subject<string>();

    static readonly isMapView = true;

    protected markers: { [key: string]: any } = {};


    get isInitialized(): boolean {
        return !!this._mapObj;
    }
    
    protected dispatchMapState(): void {
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.UpdateMapState,this.mapState);
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

        try {
            this.mapState = this.modules.store.state.mapState;
            this._mapObj = await this.doLoadMap(newDiv.id);
            this.initCallbackListeners();
            this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
                level: LOG_LEVEL.Debug,
                message: "Created map obj "+this.constructor.name
            });
        } catch (err) {
            this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
                level: LOG_LEVEL.Error,
                message: "Error creating map obj "+this.constructor.name,
                data: err
            });
            throw err;
        }
    }

    addMarker(markerReferenceName: string, params: iMapAddMarkerParams): void {
        this.addMarkerHelper(markerReferenceName,params);
        this.refreshMapState();
    }

    streamAddMarker(markerReferenceName: string, params: iMapAddMarkerParams, isLast: boolean): void {
        /*setTimeout(() => {
            this.addMarkerHelper(markerReferenceName,params);
        },10)*/

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
        const marker = this.doAddMarker(markerReferenceName,params);
        if (marker) {
            this.markers[markerReferenceName] = marker;
        }
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

        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    }

    setCenterCoordinates(position: iMapLatLng,doDispatch=true,doUpdateMap=true): void {
        this.mapState.center = position;
        doUpdateMap && this.doSetCenterCoordinates(position);
        doUpdateMap && this.refreshMapState();
        doDispatch && this.dispatchMapState();
    }

    setZoom(zoom: number,doDispatch=true,doUpdateMap=true): void {
        this.mapState.zoom = zoom;
        doUpdateMap && this.doSetZoom(zoom);
        doUpdateMap && this.refreshMapState();
        doDispatch && this.dispatchMapState();
    }

    setBounds(bounds: iMapBounds,doDispatch=true,doUpdateMap=true): void {
        this.mapState.bounds = bounds;
        doUpdateMap && this.doSetBounds(bounds);
        doUpdateMap && this.refreshMapState();
        doDispatch && this.dispatchMapState();
    }

    coordinateWithinBounds(bounds: iMapBounds,position: iMapLatLng): boolean {
        return position.lat > bounds.southWest.lat
            && position.lat < bounds.northEast.lat
            && position.lng < bounds.northEast.lng
            && position.lng > bounds.southWest.lng;
    }

    protected doDestroySelf(): void {
        this.removeMap();
    }

    protected onPlacedInDocument(): void {
    }

    protected abstract initCallbackListeners(): void;

    protected abstract doSetCenterCoordinates(position: iMapLatLng): void;

    protected abstract doLoadMap(divId: string): Promise<any>;

    protected abstract doAddMarker(markerReferenceName: string, params: iMapAddMarkerParams): any;

    protected abstract doRemoveMarker(markerObj: any): void;

    protected abstract doRemoveMap(): void;

    protected abstract refreshMapState(): void;

    protected abstract doSetZoom(zoom: number): void;

    protected abstract doSetBounds(bounds: iMapBounds): void;

}
