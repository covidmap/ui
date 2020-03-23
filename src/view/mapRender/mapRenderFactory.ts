import {iMapRender, iMapRenderFactory} from "../models/iMapRender";
import {GoogleMapsRender} from "./googleMapsRender";

export class MapRenderFactory implements iMapRenderFactory {

    private mapObjects: {[key: string]: new() => iMapRender} = {
        GoogleMaps: GoogleMapsRender
    };

    readonly mapNames = {
        GoogleMaps: "GoogleMaps"
    };

    getMap(apiName: string): iMapRender {
        if (!this.mapObjects[apiName]) {
            throw new Error("Invalid map render object: "+apiName);
        }
        return new this.mapObjects[apiName]();
    }

}