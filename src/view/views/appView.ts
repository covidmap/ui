import {BaseView} from "./baseView";
import {HtmlString} from "../models/iView";
import {RawOutputView} from "./rawOutput/rawOutput.view";

export class AppView extends BaseView {

    protected doInit(): HtmlString {
        return `
            <h1>Main App</h1>
            <hospital-raw-output></hospital-raw-output>
        `;
    }

    get selector(): string {
        return "app-main";
    }

    protected onPlacedInDocument(): void {}

    get viewName(): string {
        return "MainApp";
    }

    protected doDestroySelf(): void {}


}