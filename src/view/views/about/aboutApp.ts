import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";

export class AboutApp extends BaseView {
    protected doDestroySelf(): void {
    }

    protected doInit(): HtmlString {
        return `
            <h2>About this App</h2>
            <p>Placeholder...</p>
            <img src="https://media0.giphy.com/media/L3bj6t3opdeNddYCyl/source.gif"/>
        `;
    }

    protected onPlacedInDocument(): void {
    }


}