interface iSuppliesFor {
    seconds: number
}

interface iResource {
    shortage: boolean,
    pressure: boolean,
    suppliesFor: iSuppliesFor
}

export interface iKnownResource extends iResource {
    knownResource: string
}

export interface iUnknownResource extends iResource {
    otherResource: string
}

export interface iReportForm_Report_Source {
    firstHand: boolean,
    secondHand: boolean,
    socialMedia: boolean,
    uri: string,
    description: string
}

export interface iReportForm_Report_Survey {
    waitTime: number,
    shortage: boolean,
    pressure: boolean,
    better: boolean,
    worse: boolean,
    resource: Array<iKnownResource | iUnknownResource>
}

export interface iReportForm_Report {
    source: iReportForm_Report_Source,
    survey: iReportForm_Report_Survey,
    notes: string
}

export interface iReportForm {
    email: string,
    report: iReportForm_Report
}