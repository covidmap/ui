import {BaseMapRender} from "./baseMapRender";
import {iMapAddMarkerParams, iMapLatLng} from "../models/iMapRender";

export class GoogleMapsRender extends BaseMapRender {

    protected doLoadMap(div: HTMLDivElement): Promise<void> {
        throw new Error("not implemented");
    }

    protected doAddMarker(params: iMapAddMarkerParams): any {
        throw new Error("not implemented");
    }

    protected doRemoveMarker(markerObj: any): void {
        throw new Error("not implemented");
    }

    setCenterCoordinates(position: iMapLatLng): void {
        throw new Error("not implemented");
    }

    protected doRemoveMap(): void {
        throw new Error("not implemented");
    }

}