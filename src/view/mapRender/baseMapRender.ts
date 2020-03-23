import {iMapAddMarkerParams, iMapLatLng, iMapRender} from "../models/iMapRender";

/**
 * Provides common functionality for map operations
 */
export abstract class BaseMapRender implements iMapRender {

    private originalDivEl: HTMLDivElement;
    private divEl: HTMLDivElement;
    private mapObj: any;

    protected markers: { [key: string]: any } = {};
    protected mapCenter: iMapLatLng = {
        lat: 0,
        lng: 0
    };

    async loadMap(div: string | HTMLDivElement): Promise<void> {
        let divEl;
        if (typeof div === 'string') {
            divEl = <HTMLDivElement>document.getElementById(div);
            if (!divEl) {
                throw new Error("Error in loadMap: div ID does not exist on document: " + div);
            }
        } else {
            divEl = div;
        }

        this.originalDivEl = <HTMLDivElement>divEl.cloneNode(true);
        this.mapObj = await this.doLoadMap(divEl);
    }

    addMarker(markerReferenceName: string, params: iMapAddMarkerParams): void {
        if (this.markers[markerReferenceName]) {
            this.removeMarker(markerReferenceName);
        }

        this.markers[markerReferenceName] = this.doAddMarker(params);
    }

    removeMarker(markerReferenceName: string): void {
        if (!this.markers[markerReferenceName]) {
            return;
        }

        this.doRemoveMarker(this.markers[markerReferenceName]);
        this.markers[markerReferenceName] = null;
    }

    removeAllMarkers(): void {
        Object.keys(this.markers).forEach(name => {
            this.removeMarker(name);
        });
    }

    removeMap(): void {
        this.removeAllMarkers();
        this.doRemoveMap();
        this.mapObj = null;

        //@ts-ignore
        this.divEl.parentNode.replaceChild(this.divEl,this.originalDivEl);
    }

    setCenterCoordinates(position: iMapLatLng): void {
        this.mapCenter = position;
        this.doSetCenterCoordinates(position);
    }

    protected abstract doSetCenterCoordinates(position: iMapLatLng): void;

    protected abstract doLoadMap(div: HTMLDivElement): Promise<any>;

    protected abstract doAddMarker(params: iMapAddMarkerParams): any;

    protected abstract doRemoveMarker(markerObj: any): void;

    protected abstract doRemoveMap(): void;
}
