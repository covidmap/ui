import {iMapAddMarkerParams, iMapLatLng, iMapRender} from "../models/iMapRender";

/**
 * Provides common functionality for map operations
 */
export abstract class BaseMapRender implements iMapRender {

    private mapObj: any;
    private markers: { [key: string]: any } = {};

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
    }

    abstract setCenterCoordinates(position: iMapLatLng): void;

    protected abstract doLoadMap(div: HTMLDivElement): Promise<any>;

    protected abstract doAddMarker(params: iMapAddMarkerParams): any;

    protected abstract doRemoveMarker(markerObj: any): void;

    protected abstract doRemoveMap(): void;
}
