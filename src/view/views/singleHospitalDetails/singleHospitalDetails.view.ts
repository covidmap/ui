import { HtmlString } from "../../models/iView";
import { BaseView } from "../baseView";
import { iHospital } from "../../../store/models/iHospital";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {AddressFormatterOptions} from "../../../common/models/iAddressFormatter";
import {first} from "rxjs/operators";
import {iStore, iStoreState} from "../../../store/models/iStore";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {LOG_LEVEL} from "../../../logger/models/iLog";

export class SingleHospitalDetails extends BaseView {

    private spanNames = {
        hospitalNameSpan: "hospitalNameSpan",
        addressMultiLine: "addressMultiLine",
        statusColor: "statusColor"
    };

    setHospital(hospital: iHospital): void {
        this.updateHospitalView(hospital);
    }

    protected doInit(): HtmlString {
        const hospitalNameSpan = this.registerSpanInterpolator(this.spanNames.hospitalNameSpan);
        const addressMultiLineSpan = this.registerSpanInterpolator(this.spanNames.addressMultiLine);
        const statusColorSpan = this.registerSpanInterpolator(this.spanNames.statusColor);

        return `
            <h2>${hospitalNameSpan}</h2>
            ${statusColorSpan}
            </br>
            <p><b>Address:</b></br>
                ${addressMultiLineSpan}
            </p>
        `;
    }

    private updateHospitalView(hospital: iHospital): void {

        const statusColorDescription = this.getStatusColorContents(hospital);

        this.updateSpanHtml(this.spanNames.hospitalNameSpan, hospital.name);
        this.updateSpanHtml(this.spanNames.statusColor,statusColorDescription);
        this.updateSpanHtml(
            this.spanNames.addressMultiLine,
            `${this.modules.addressFormatter.format(hospital.address,AddressFormatterOptions.MULTI_LINE)}`
        );
    }

    private getStatusColorContents(hospital: iHospital): string {
        let color = hospital.pinColor;
        color = color.toLowerCase();
        switch (color) {
            case "green":
                return `
                    <p><b>Status:</b> <span class="highlight_${color}">${color}</span>
                    </br>
                    Green indicates that this hospital has received predominantly positive reports.</p>
                `;
            case "yellow":
                return `
                    <p><b>Status:</b> <span class="highlight_${color}">${color}</span>
                    </br>
                    Yellow indicates that this hospital has received a mix of positive and negative reports.</p>
                `;
            case "red":
                return `
                    <p><b>Status:</b> <span class="highlight_${color}">${color}</span>
                    </br>
                    Red indicates that this hospital has received primarily negative reports.</p>
                `;
            case "neutral":
                return `
                    <p><b>Status:</b> <span class="highlight_${color}">Neutral</span>
                    </br>
                    Neutral indicates that there is not enough information about this hospital to determine its status.</p>
                `;
            default:
                this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
                    message: "Unknown color provided for hospital: "+color,
                    level: LOG_LEVEL.Warning
                });
                return "";
        }

    }


    protected onPlacedInDocument(): void {
    }


    protected doDestroySelf(): void {}

}