export interface iMapLatLng {
    lat: number,
    lng: number
}

export interface iMapAddMarkerParams {
    markerTitle: string,
    position: iMapLatLng
}

/**
 * Facade over map implementation api
 * Views will use this as buffer to communicate with a map api
 */
export interface iMapRender {

    loadMap(div: string | HTMLDivElement): Promise<void>;

    setCenterCoordinates(position: iMapLatLng): void;

    addMarker(markerReferenceName: string, params: iMapAddMarkerParams): void;

    removeMarker(markerReferenceName: string): void;

    removeAllMarkers(): void;

    removeMap(): void;

}

/**
 * Get the appropriate map based on API name (google docs vs other implementation if relevant)
 */
export interface iMapRenderFactory {

    mapNames: {[key: string]: string};

    getMap(apiName: string): iMapRender

}