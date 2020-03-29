import {DATA_QUERY_STRATEGY, iStore, iStoreState} from "../store/models/iStore";
import {iDispatcher} from "../dispatcher/models/iDispatcher";
import {Store} from "../store/store";
import {Dispatcher} from "../dispatcher/dispatcher";
import {ViewRegistry} from "../view/viewRegistry/viewRegistry";
import {iViewRegistry} from "../view/models/iViewRegistry";
import {AppMain} from "../view/views/appMain";
import {iAddressFormatter} from "../common/models/iAddressFormatter";
import {AddressFormatter} from "../common/addressFormatter";
import {DISPATCHER_MESSAGES} from "../dispatcher/dispatcher.messages";
import {Logger} from "../logger/logger";
import {SubscriptionTracker} from "../common/subscriptionTracker";
import {LOG_LEVEL} from "../logger/models/iLog";
import {iMapLatLng} from "../view/models/iMapRender";
import {CustomElementRegistry} from "../view/customElements/customElementsRegistry";

interface iBaseAppModules {
    store: iStore,
    dispatcher: iDispatcher,
    DISPATCHER_MESSAGES: {[key:string]: string},
    appView: AppMain,
    viewRegistry: iViewRegistry,
    addressFormatter: iAddressFormatter
}

export const ENVIRONMENTS = {
    Dev: "Dev",
    Production: "Production"
};

const DEFAULT_RESOURCE_NAMES = [{
    propName: "MASKS_N95",
    label: "Masks N95"
},{
    propName: "MASKS_SURGICAL",
    label: "Masks Surgical"
},{
    propName: "GLOVES",
    label: "Gloves"
},{
    propName: "GOWNS",
    label: "Gowns"
},{
    propName: "EYEWEAR",
    label: "Eye Wear"
},{
    propName: "BOOTIES",
    label: "Booties"
},{
    propName: "FACE_SHIELDS",
    label: "Face Shields"
},{
    propName: "CLEANING_SUPPLIES",
    label: "Cleaning Supplies"
},{
    propName: "SANITIZER",
    label: "Sanitizer"
},{
    propName: "SANITIZING_WIPES",
    label: "Sanitizing Wipes"
},{
    propName: "MEDICAL_EQUIPMENT",
    label: "Medical Equipment"
},{
    propName: "THERMOMETERS",
    label: "Thermometers"
},{
    propName: "VENTILATORS",
    label: "Ventilators"
},{
    propName: "PPE",
    label: "Other Personal Protective Equipment",
}];

const initialStoreStateDev: iStoreState = {
    environment: ENVIRONMENTS.Dev,
    dataQueryStrategy: DATA_QUERY_STRATEGY.StubQuery,
    hospitalList: [],
    currentPage: "hospital-map",
    currentPageDisplayClass: "main",
    debugShowStoreState: false,
    reportFormResourceNames: DEFAULT_RESOURCE_NAMES,
    isLoading: true,
    selectedMapApiName: "google-maps-render",
    mapReady: false,
    mapState: {
        zoom: 7,
        center:  {
            "lat": 38.75638408247721,
            "lng": -73.49122703786058
        },
    },
    logEntries: [{
        message: "Bootstrap initialized",
        timestamp: +new Date(),
        level: LOG_LEVEL.Debug
    }],
    existingViews: {},
    hospitalInContext: null,
    defaultMapCenterCoordinates: {
        lat: 0,
        lng: 0
    },
    reportFormInputState: {}
};

const initialStoreStateProduction: iStoreState = {
    environment: ENVIRONMENTS.Production,
    dataQueryStrategy: DATA_QUERY_STRATEGY.StubQuery,
    hospitalList: [],
    currentPage: "hospital-map",
    currentPageDisplayClass: "main",
    debugShowStoreState: false,
    reportFormResourceNames: DEFAULT_RESOURCE_NAMES,
    isLoading: true,
    selectedMapApiName: "google-maps-render",
    mapReady: false,
    mapState: {
        zoom: 7,
        center:  {
            "lat": 38.75638408247721,
            "lng": -73.49122703786058
        },
    },
    logEntries: [{
        message: "Bootstrap initialized",
        timestamp: +new Date(),
        level: LOG_LEVEL.Debug
    }],
    existingViews: {},
    hospitalInContext: null,
    defaultMapCenterCoordinates: {
        lat: 0,
        lng: 0
    },
    reportFormInputState: {}
};

const environmentInitialStates = {
    Dev: initialStoreStateDev,
    Production: initialStoreStateProduction
};

export interface iInitParameters {
    root?: string,
    environment?: string,
    onReportFormSubmit?: (formData: any) => Promise<void> | void, //todo: change type when available
    centerCoordinates?: iMapLatLng,
    resourceNames?: Array<{
        propName: string,
        label: string
    }>
}

var logger;

class Bootstrapper {

    static initApp(params: iInitParameters): iDispatcher {
        const environment = params.environment || ENVIRONMENTS.Production;
        const containerId = params.root || 'appContainer';
        const onFormSubmit = params.onReportFormSubmit || (function(){});
        //@ts-ignore
        const state: iStoreState = environmentInitialStates[environment];
        if (params.centerCoordinates && params.centerCoordinates.lat) {
            state.mapState.center = params.centerCoordinates;
        }
        if (params.resourceNames && params.resourceNames.length > 0) {
            state.reportFormResourceNames = params.resourceNames;
        }

        const modules = Bootstrapper.resolveModules(state);
        Bootstrapper.insertApp(containerId,modules);
        modules.appView.init(modules);

        if (!params.centerCoordinates || !params.centerCoordinates.lat) {
            Bootstrapper.tryGeoLocateUser(modules);
        } else {
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.UpdateDefaultMapCenterCoordinates,params.centerCoordinates);
        }

        Bootstrapper.sendMapReady(modules);
        Bootstrapper.listenToFormSubmit(modules,onFormSubmit);

        return modules.dispatcher;
    }

    private static sendMapReady(modules: iBaseAppModules) {
        //@ts-ignore
        if (window.MAP_IS_READY) {
            //@ts-ignore
            window.__init_map.call(modules);
        } else {
            //@ts-ignore
            window.__init_map = window.__init_map.bind(modules);
        }
    }

    private static listenToFormSubmit(modules: iBaseAppModules,func: Function): void {
        modules.dispatcher.registerToMessage(DISPATCHER_MESSAGES.HospitalReportSubmitted,(data) => {
            func(data);
        });
    }

    private static insertApp(containerId: string,modules: iBaseAppModules): void {
        const placeholder = document.getElementById(containerId);
        if (!placeholder) {
            throw new Error("Error during app start: a div with id "+containerId+" must be set!");
        }
        placeholder.appendChild(modules.appView);
    }


    private static tryGeoLocateUser(modules: iBaseAppModules): void {
        navigator.geolocation.getCurrentPosition(function (pos) {
            const coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.UpdateMapState, {
                center: coords
            });
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.UpdateDefaultMapCenterCoordinates,coords);
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog, {
                message: "Set map position based on user's geolocated coordinates => " + JSON.stringify(pos),
                data: pos,
                level: LOG_LEVEL.Message
            });
        }, function (err) {
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog, {
                message: "Failed to obtain user's geo location",
                data: err,
                level: LOG_LEVEL.Warning
            });
        });
    }

    private static resolveModules(initialState: iStoreState): iBaseAppModules {
        const viewRegistry = new ViewRegistry();
        const dispatcher = new Dispatcher();

        const store = new Store({
            dispatcher,
        //@ts-ignore
        },initialState);


        const appView = <AppMain>document.createElement(viewRegistry.selectors.AppMain);
        const addressFormatter = new AddressFormatter();

        logger = new Logger({
            dispatcher,
            store,
            subscriptionTracker: new SubscriptionTracker("Bootstrap",{
                dispatcher
            })
        });

        new CustomElementRegistry();

        return {
            store,
            dispatcher,
            appView,
            viewRegistry,
            addressFormatter,
            DISPATCHER_MESSAGES
        };
    }
}

// @ts-ignore
export const boot = window['__boot'] = Bootstrapper.initApp;

