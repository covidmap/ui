import {AddressFormatterOptions, iAddressFormatter} from "./models/iAddressFormatter";
import {iPhysicalAddress} from "./models/iPhysicalAddress";

export class AddressFormatter implements iAddressFormatter {

    format(address: iPhysicalAddress, format: string): string {
        switch (format) {
            case AddressFormatterOptions.MULTI_LINE:
                return this.formatMultiLine(address);
            default:
                return this.formatSingleLine(address);
        }
    }

    private formatSingleLine(address: iPhysicalAddress): string {
        return address.streetLineOne
            + (address.streetLineTwo ? ", "+address.streetLineTwo:"")
            + ", "+address.cityTown
            + ", "+address.stateRegion
            + ", "+address.zipcode
            + ", "+address.country

    }

    private formatMultiLine(address: iPhysicalAddress): string {
        return address.streetLineOne
            + (address.streetLineTwo ? "<br>"+address.streetLineTwo:"")
            + "<br>"+address.cityTown
            + address.stateRegion
            + ", "+address.zipcode
            + "<br>"+address.country
    }

}