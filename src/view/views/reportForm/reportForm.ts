import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {iReportForm} from "../../models/iReportForm";

export class ReportForm extends BaseView {

    private formId: string;
    private sourceAdditionalDetailsId: string;

    private spanSubmit: string = "formSubmit";
    private spanAdditionalDetails: string = "additionalDetails";

    protected doInit(): HtmlString {
        this.formId = this.getUniqueId();
        this.sourceAdditionalDetailsId = this.getUniqueId();

        const submitSpan = this.registerSpanInterpolator(this.spanSubmit);
        const additionalDetailsSpan = this.registerSpanInterpolator(this.spanAdditionalDetails);

        const accordianElements = this.modules.store.state.reportFormResourceNames.reduce((html,obj) => {
            const name = obj.propName;
            const labelName = obj.label;
            return html + `
                <accordion-element header="${name}">
                    <label for="${name}_shortage">Is there a shortage of ${labelName}</label>
                    <select name="${name}_shortage">
                        <option value="true">Yes</option>
                        <option value="false">Mo</option>
                    </select>
                    <label for="${name}_pressure">Is there pressure for ${labelName}</label>
                    <select name="${name}_pressure">
                        <option value="true">Yes</option>
                        <option value="false">Mo</option>
                    </select>
                    <label for="${name}_available">How much longer will this resource be available:</label>
                    <input-duration name="${name}_available"></input-duration>
                </accordion-element>
            `;
        },"");


        return `
            <h2>Submit a Report</h2>
            <p><b>Note:</b> your email address is used for internal purposes only and will not be shared with anyone.</p>
            ${submitSpan}
            <form id="${this.formId}" class="reportForm">
            
                <label for="emailAddress">Email Address:</label>
                <input type="email" name="emailAddress" required />

                <label for="hospital">Hospital (todo: implement search helper)</label>
                <input type="text" name="hospital" required />
                
                <label for="source">Source:</label>
                <select name="source" required>
                    <option value="noChoice">Please select choice...</option>
                    <option value="firstHand">First Hand: I am experiencing this</option>
                    <option value="secondHand">Second Hand: I was told by a First Hand Observer</option>
                    <option value="socialMedia" data-moreDetails="true" data-moreDetailsLabel="Please provide link below:">Social Media</option>
                    <option value="other" data-moreDetails="true" data-moreDetailsLabel="Please specify:">Other</option>
                </select>
                <div id="${this.sourceAdditionalDetailsId}">
                    <label for="sourceAdditionalDetails">${additionalDetailsSpan}</label>
                    <input type="text" name="sourceAdditionalDetails" />
                </div>
                <label for="waitTimeMs">Wait Time:</label>
                <input-duration name="waitTimeMs"></input-duration>
                
                <label>Resources Availability</label>
                <accordion-container>
                    ${accordianElements}
                </accordion-container>
                
                </br>
                <input type="submit" value="Submit" />
            </form>
            
        `;
    }

    protected onPlacedInDocument(): void {
        //@ts-ignore
        document.getElementById(this.sourceAdditionalDetailsId).style.display = "none";
        this.listenToFormActions();
    }

    private listenToFormActions(): void {
        const form = <HTMLFormElement>document.getElementById(this.formId)!;
        const formSource = <HTMLSelectElement>form.querySelector("select[name=source]")!;

        //sourceOptionChanged
        this.modules.subscriptionTracker.addEventListenerTo(
            formSource,
            'change',
            this.handleSourceChange.bind(this,form,formSource)
        );

        //form submit
        this.modules.subscriptionTracker.addEventListenerTo(
            form,
            'submit',
            this.handleFormSubmit.bind(this,form)
        )
    }

    /**
     * When the user changes the select option, handle
     * @param form
     * @param formSource
     */
    private handleSourceChange(form: HTMLFormElement, formSource: HTMLSelectElement): void {
        formSource.classList.remove('formBadInput');

        const value = formSource.value;
        if (value === 'noChoice') {
            formSource.classList.add('formBadInput');
        }

        const additionalDetailsContainer = document.getElementById(this.sourceAdditionalDetailsId)!;
        const additionalDetails = additionalDetailsContainer.querySelector("input")!;
        if (value === "other" || value === "socialMedia") {
            additionalDetails.required = true;
            additionalDetailsContainer.style.display = "block";

            if (value === 'other') {
                this.updateSpanHtml(this.spanAdditionalDetails,"Please specify:");
            } else {
                this.updateSpanHtml(this.spanAdditionalDetails,"Please paste url or describe source:");
            }

        } else {
            additionalDetails.required = false;
            additionalDetailsContainer.style.display = "none";
        }
    }

    private handleFormSubmit(form: HTMLFormElement, event: any): void {
        event.preventDefault();
        //@ts-ignore
        const data = Object.fromEntries(new FormData(form));

        if (this.validateForm(form,data)) {
            this.submitFormData(data);
            form.reset();
            this.updateSpanHtml(this.spanSubmit,`<p style='color:green'>Your report has been submitted!  Thank you.</p>`);
        } else {
            this.updateSpanHtml(this.spanSubmit,`<p style='color:red'>There was an error with your form submission.  Please ensure everything is filled out and try again.</p>`);
        }
    }

    private validateForm(form: HTMLFormElement, formData: {[key: string]: any}): boolean {
        if (formData.source === 'noChoice') {
            return false;
        }
        return true;
    }

    private submitFormData(formData: {[key: string]: any}): void {
        const processedFormData: iReportForm = this.processFormData(formData);
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: "Report Form Submitted",
            data: formData,
            type: "message"
        });
    }

    private processFormData(formData: {[key: string]: any}): iReportForm {
        return {
            email: formData.email,
            report: {
                source: {
                    firstHand: formData.source === 'firstHand',
                    secondHand: formData.source === 'secondHand',
                    socialMedia: formData.source === 'socialMedia',
                    uri: formData.source === 'socialMedia' ? formData.sourceAdditionalDetails : "",
                    description: formData.source === 'other' ? formData.sourceAdditionalDetails : ""
                }
            },
            survey: {

            }
        }
    }

    protected doDestroySelf(): void {
    }

}