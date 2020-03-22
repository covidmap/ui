import {iPhysicalAddress} from "./iPhysicalAddress";

export const AddressFormatterOptions = {
    SINGLE_LINE: "singleLine",
    MULTI_LINE: "multiLine"
};

export interface iAddressFormatter {

    format(address: iPhysicalAddress,format: string): string;

}