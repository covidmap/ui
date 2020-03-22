import { HtmlString } from "../../models/iView";
import { BaseView } from "../baseView";
import { iHospital } from "../../../store/models/iHospital";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {AddressFormatterOptions} from "../../../common/models/iAddressFormatter";

interface iSingleHospitalSpanNames {
    hospitalNameSpan: string,
    addressSingleLine: string,
    addressMultiLine: string
};

export class SingleHospitalDetails extends BaseView {

    private spanNames: iSingleHospitalSpanNames = {
        hospitalNameSpan: "hospitalNameSpan",
        addressSingleLine: "addressSingleLine",
        addressMultiLine: "addressMultiLine"
    };

    setHospital(hospital: iHospital): void {
        this.updateHospitalView(hospital);
    }

    protected doInit(): HtmlString {
        return this.renderTemplate();
    }

    private updateHospitalView(hospital: iHospital): void {

        this.updateSpanHtml(
            this.spanNames.hospitalNameSpan,
            hospital.name
        );
        this.updateSpanHtml(
            this.spanNames.addressSingleLine,
            this.modules.addressFormatter.format(hospital.address,AddressFormatterOptions.SINGLE_LINE)
        );
        this.updateSpanHtml(
            this.spanNames.addressMultiLine,
            this.modules.addressFormatter.format(hospital.address,AddressFormatterOptions.MULTI_LINE)
        );
    }

    private renderTemplate(): HtmlString {
        const hospitalNameSpan = this.registerSpanInterpolator(this.spanNames.hospitalNameSpan);
        const addressSingleLineSpan = this.registerSpanInterpolator(this.spanNames.addressSingleLine);
        const addressMultiLineSpan = this.registerSpanInterpolator(this.spanNames.addressMultiLine);

        return `
            <h2>Hospital Details: ${hospitalNameSpan}</h2>
            <ul>
                <li><b>Address Single Line</b>: ${addressSingleLineSpan}</li>
                <li><b>Address Multi Line</b>:<br>${addressMultiLineSpan}</li>
            </ul>
        `;
    }

    protected onPlacedInDocument(): void {}

    get viewName(): string {
        return "SingleHospitalDetails";
    }

    protected doDestroySelf(): void {}

}