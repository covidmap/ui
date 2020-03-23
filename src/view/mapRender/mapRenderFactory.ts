import {iMapRender, iMapRenderFactory} from "../models/iMapRender";
import {GoogleMapsRender} from "./googleMapsRender";
import {StubMapRender} from "./stubMapRender";

export class MapRenderFactory implements iMapRenderFactory {

    private mapObjects: {[key: string]: new() => iMapRender} = {
        GoogleMaps: GoogleMapsRender,
        StubMap: StubMapRender
    };

    readonly mapNames = {
        GoogleMaps: "GoogleMaps",
        StubMap: "StubMap"
    };

    getMap(apiName: string): iMapRender {
        if (!this.mapObjects[apiName]) {
            throw new Error("Invalid map render object: "+apiName);
        }
        return new this.mapObjects[apiName]();
    }

}