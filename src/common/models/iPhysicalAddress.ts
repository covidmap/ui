export interface iPhysicalAddress {
    coordinates: {
        lat: number,
        lng: number
    },
    streetLineOne: string,
    streetLineTwo: string,
    cityTown: string,
    stateRegion: string,
    country: string,
    zipcode: string
}