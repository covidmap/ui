import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";
import {DISPATCHER_MESSAGES} from "../../../dispatcher/dispatcher.messages";
import {iReportForm} from "../../models/iReportForm";
import {LOG_LEVEL} from "../../../logger/models/iLog";
import {iHospital} from "../../../store/models/iHospital";

export class ReportForm extends BaseView {

    private formId: string;
    private sourceAdditionalDetailsId: string;
    private resourcesIds: {[key: string]: {accordionId: string,checkboxId: string}} = {};

    private spanSubmit: string = "formSubmit";
    private spanAdditionalDetails: string = "additionalDetails";

    protected doInit(): HtmlString {
        this.formId = this.getUniqueId();
        this.sourceAdditionalDetailsId = this.getUniqueId();

        const submitSpan = this.registerSpanInterpolator(this.spanSubmit);
        const additionalDetailsSpan = this.registerSpanInterpolator(this.spanAdditionalDetails);

        //variable selection based on input parameters at bootstrap
        let accordionCheckboxes = "";
        this.modules.store.state.reportFormResourceNames.forEach((obj) => {
            this.resourcesIds[obj.propName] = {
                accordionId: this.getUniqueId(),
                checkboxId: this.getUniqueId()
            };

            const name = obj.propName;
            const labelName = obj.label;

            accordionCheckboxes += `
                <div>
                    <input type="checkbox" name="${this.resourcesIds[obj.propName].checkboxId}" id="${this.resourcesIds[obj.propName].checkboxId}" data-accordion-element-id="${this.resourcesIds[obj.propName].accordionId}" />
                    <label for="${this.resourcesIds[obj.propName].checkboxId}"  class="force-inline-block">${labelName}</label>
                    <div id="${this.resourcesIds[obj.propName].accordionId}" class="hidden">
                        <div class="reportItemContent">
                            <label for="shortage_${name}">Is there a shortage of ${labelName}?</label>
                            <select name="shortage_${name}">
                                <option value="">Please make a selection...</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                            <label for="pressure_${name}">Is demand for ${labelName} increasing?</label>
                            <select name="pressure_${name}">
                                <option value="">Please make a selection...</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                            <label for="availableMs_${name}">How much longer will this resource be available:</label>
                            <input-duration name="availableMs_${name}" minUnit="day"></input-duration>
                        </div>
                    </div>
                </div>
            `;
        });


        //full form
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
                <label for="waitTimeMs">Patient Wait Time (if known):</label>
                <input-duration name="waitTimeMs"></input-duration>
                
                <label>Resources Availability:</label>
                <p>Please provide information for all fields which apply:</p>
                ${accordionCheckboxes}

                
                </br>
                <input type="submit" value="Submit" class="blueButton"/>
            </form>
            
        `;
    }

    /**
     * Initialize the form event listeners
     */
    protected onPlacedInDocument(): void {
        //@ts-ignore
        document.getElementById(this.sourceAdditionalDetailsId).style.display = "none";

        const currentContextHospital = this.modules.store.state.hospitalInContext;
        if (currentContextHospital) {
            this.updateFormWithHospitalData(currentContextHospital);
            //remove stored hospital necessary to stop same hospital name appearing next time form is opened
            this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.HospitalInContextUpdated, null);
        }

        this.listenToFormActions();
    }

    private updateFormWithHospitalData(hospital: iHospital): void {
        const form = <HTMLFormElement>document.getElementById(this.formId)!;
        const hospitalInput = <HTMLInputElement>form.querySelector('input[name="hospital"]');
        
        if (hospital.name) hospitalInput.value = hospital.name;
        console.error("Hospital form updated!",hospital);
    }

    /**
     * Attach form listeners for events: input form changes, form submission
     */
    private listenToFormActions(): void {
        const form = <HTMLFormElement>document.getElementById(this.formId)!;
        const formSource = <HTMLSelectElement>form.querySelector("select[name=source]")!;

        //sourceOptionChanged
        this.modules.subscriptionTracker.addEventListenerTo(
            formSource,
            'change',
            this.handleSourceChange.bind(this,form,formSource)
        );

        //accordion checkbox click
        //@ts-ignore
        Array.from(document.querySelectorAll("input[type=checkbox][data-accordion-element-id]")).forEach((element: HTMLInputElement) => {
            this.modules.subscriptionTracker.addEventListenerTo(
                element,'click',
                () => {
                    //@ts-ignore
                    const accordionElement = document.getElementById(element.dataset.accordionElementId)!;
                    if (element.checked) {
                        accordionElement.classList.remove("hidden");
                    } else {
                        accordionElement.classList.add("hidden");
                    }
                }
            );
        });

        //form submit
        this.modules.subscriptionTracker.addEventListenerTo(
            form,
            'submit',
            this.handleFormSubmit.bind(this,form)
        )
    }

    /**
     * When the user changes the select option for source, handle related form controls
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

    /**
     * When form is submitted, validate input, submit if valid
     * @param form
     * @param event
     */
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

        document.getElementsByTagName("main")[0].scrollTo(0, 0);
    }

    /**
     * Ensure that all form data is valid
     * @param form
     * @param formData
     */
    private validateForm(form: HTMLFormElement, formData: {[key: string]: any}): boolean {
        if (formData.source === 'noChoice') {
            return false;
        }
        return true;
    }

    /**
     * Process form data and dispatch
     * @param formData
     */
    private submitFormData(formData: {[key: string]: any}): void {
        const processedFormData: iReportForm = this.processFormData(formData);
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: "Report Form Submitted",
            data: {
                input: formData,
                processed: processedFormData
            },
            level: LOG_LEVEL.Message
        });
        //dispatch
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.HospitalReportSubmitted,processedFormData);
    }

    /**
     * Convert the form data to a model that the dispatcher can work with to send data to the backend
     * @param formData
     */
    private processFormData(formData: {[key: string]: any}): iReportForm {
        const resources: Array<any> = Object.keys(formData).reduce((ar: Array<any>,key) => {
            let keyPrefix;
            if (key.indexOf("shortage_") === 0) {
                keyPrefix = "shortage_";
            } else if (key.indexOf("pressure_") === 0) {
                keyPrefix = "pressure_";
            } else if (key.indexOf("availableMs_") === 0) {
                keyPrefix = "availableMs_";
            }

            if (!keyPrefix) {
                return ar;
            }

            const resourceName = key.substring(keyPrefix.length);
            const fieldName = key.substring(0,keyPrefix.length-1);
            let value = formData[key];
            switch (value) {
                case "true":
                    value = true;
                    break;
                case "false":
                    value = false;
                    break;
                case "":
                    value = null;
                    break;
            }

            let arIndex = ar.findIndex(item => item.knownResource === resourceName);
            if (arIndex === -1) {
                ar.push({
                    knownResource: resourceName,
                    shortage: null,
                    pressure: null,
                    suppliesFor: {
                        seconds: null
                    }
                });
                arIndex = ar.length - 1;
            }

            if (fieldName === "availableMs") {
                console.log(value);
                ar[arIndex].suppliesFor.seconds = Math.floor(parseFloat(value+"")/1000);
            } else {
                ar[arIndex][fieldName] = value;
            }

            return ar;
        },[]).filter(item => {
            return item.shortage !== null || item.pressure !== null || item.suppliesFor.seconds !== null
        });

        return {
            email: formData.emailAddress,
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
                waitTime: {
                    seconds: Math.ceil(parseInt(formData.waitTimeMs)/1000)
                },
                resource: resources
            },
            notes: ""
        }
    }

    protected doDestroySelf(): void {
    }

}