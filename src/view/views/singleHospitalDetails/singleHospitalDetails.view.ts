import { HtmlString } from "../../models/iView";
import { BaseView } from "../baseView";
import { iHospital } from "../../../store/models/iHospital";

export class SingleHospitalDetails extends BaseView {

    private hospital: iHospital;

    setHospital(hospital: iHospital): void {
        this.hospital = hospital;
        if (this.modules) {
            this.init(this.modules);
        }
    }

    protected doInit(): HtmlString {
        if (!this.hospital) {
            return "";
        }

        return `
            <h2>Hospital Details: ${this.hospital.name}</h2>
            <p>Stub: todo: add details</p>
        `;
    }

    protected onPlacedInDocument(): void {}

    get viewName(): string {
        return "SingleHospitalDetails";
    }

    protected doDestroySelf(): void {}

}