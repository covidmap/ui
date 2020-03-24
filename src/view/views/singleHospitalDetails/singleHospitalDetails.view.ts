import { HtmlString } from "../../models/iView";
import { BaseView } from "../baseView";
import { iHospital } from "../../../store/models/iHospital";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {AddressFormatterOptions} from "../../../common/models/iAddressFormatter";
import {first} from "rxjs/operators";
import {iStore, iStoreState} from "../../../store/models/iStore";

export class SingleHospitalDetails extends BaseView {

    private spanNames = {
        hospitalNameSpan: "hospitalNameSpan",
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
            this.spanNames.addressMultiLine,
            this.modules.addressFormatter.format(hospital.address,AddressFormatterOptions.MULTI_LINE)
        );
    }

    private renderTemplate(): HtmlString {

        const hospitalNameSpan = this.registerSpanInterpolator(this.spanNames.hospitalNameSpan);
        const addressMultiLineSpan = this.registerSpanInterpolator(this.spanNames.addressMultiLine);

        return `
            <h2>${hospitalNameSpan}</h2>
            ${addressMultiLineSpan}
        `;
    }

    protected onPlacedInDocument(): void {
    }


    protected doDestroySelf(): void {}

}