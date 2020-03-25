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
        statusColor: "statusColor",
        website: "website"
    };

    setHospital(hospital: iHospital): void {
        this.updateHospitalView(hospital);
    }

    protected doInit(): HtmlString {
        const hospitalNameSpan = this.registerSpanInterpolator(this.spanNames.hospitalNameSpan);
        const addressMultiLineSpan = this.registerSpanInterpolator(this.spanNames.addressMultiLine);
        const statusColorSpan = this.registerSpanInterpolator(this.spanNames.statusColor);
        const websiteSpan = this.registerSpanInterpolator(this.spanNames.website);

        return `
            <h2>${hospitalNameSpan}</h2>
                ${statusColorSpan}
            </br>
            <p><h4>Address:</h4></br>
                ${addressMultiLineSpan}
            </p>
            <p><h4>Contact Info:</h4></br>
                ${websiteSpan}
            </p>
        `;
    }

    private updateHospitalView(hospital: iHospital): void {

        const statusColorDescription = this.getStatusColorContents(hospital);

        this.updateSpanHtml(this.spanNames.hospitalNameSpan, hospital.name);
        this.updateSpanHtml(this.spanNames.statusColor, statusColorDescription);
        this.updateSpanHtml(
            this.spanNames.addressMultiLine,
            `${this.modules.addressFormatter.format(hospital.address, AddressFormatterOptions.MULTI_LINE)}`
        );
        const website = hospital.website ? `<a href='${hospital.website}' target='_blank'>${hospital.website}</a>` : "";
        this.updateSpanHtml(this.spanNames.website, website);
    }

    private getStatusColorContents(hospital: iHospital): string {
        let color = hospital.pinColor;
        color = color.toLowerCase();
        switch (color) {
            case "green":
                return `
                    <h4>Status</h4><br><span class="status_${color}"></span><br><span class="statusInfo">Green indicates that this hospital has received predominantly positive reports.</span>
                `;
            case "yellow":
                return `
                    <h4>Status</h4><br><span class="status_${color}"></span><br><span class="statusInfo">Yellow indicates that this hospital has received a mix of positive and negative reports.</span>
                `;
            case "red":
                return `
                    <h4>Status</h4><br><span class="status_${color}"></span><br><span class="statusInfo">Red indicates that this hospital has received primarily negative reports.</span>
                `;
            case "neutral":
                return `
                    <h4>Status</h4><br><span class="status_${color}"></span><br><span class="statusInfo">Neutral indicates that there is not enough information about this hospital to determine its status.</span>
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