import { HtmlString } from "../../models/iView";
import { BaseView } from "../baseView";
import { iHospital } from "../../../store/models/iHospital";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {AddressFormatterOptions} from "../../../common/models/iAddressFormatter";
import {first} from "rxjs/operators";
import {iStore, iStoreState} from "../../../store/models/iStore";

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

    private selectId: string;

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
        this.selectId = this.getUniqueId();

        const hospitalNameSpan = this.registerSpanInterpolator(this.spanNames.hospitalNameSpan);
        const addressSingleLineSpan = this.registerSpanInterpolator(this.spanNames.addressSingleLine);
        const addressMultiLineSpan = this.registerSpanInterpolator(this.spanNames.addressMultiLine);

        return `
            <h2>Hospital Details: ${hospitalNameSpan}</h2>
            <select id="${this.selectId}"></select>
            <ul>
                <li><b>Address Single Line</b>: ${addressSingleLineSpan}</li>
                <li><b>Address Multi Line</b>:<br>${addressMultiLineSpan}</li>
            </ul>
        `;
    }

    protected onPlacedInDocument(): void {
        this.listenToHospitalList();
    }

    private listenToHospitalList(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.HospitalList$,
            (newList: Array<iHospital>) => {
                this.updateSelectElement(newList);
            }
        )
    }

    private updateSelectElement(hospitalList: Array<iHospital>): void {
        const select = document.getElementById(this.selectId)!;
        select.innerHTML = "";

        let firstOption;
        hospitalList.forEach((hospital: iHospital,index) => {
            const option = document.createElement('option');
            option.value = hospital.name;
            option.innerHTML = hospital.name;
            select.appendChild(option);

            if (index === 0) {
                firstOption = option;
            }
        });

        let that = this;
        const onChange = function() {
            const hospitalSelected = hospitalList.find(item => item.name === this.value);
            if (!hospitalSelected) {
                return;
            }
            that.updateHospitalView(hospitalSelected);
        };
        select.removeEventListener('change',onChange);
        select.addEventListener('change',onChange);
        onChange.call(firstOption);
    }

    protected doDestroySelf(): void {}

}