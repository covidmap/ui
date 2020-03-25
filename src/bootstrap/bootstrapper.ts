import {DATA_QUERY_STRATEGY, iStore, iStoreState} from "../store/models/iStore";
import {iDispatcher} from "../dispatcher/models/iDispatcher";
import {Store} from "../store/store";
import {Dispatcher} from "../dispatcher/dispatcher";
import {StubStoreDataQuery} from "../store/dataQuery/stubDataQuery";
import {ViewRegistry} from "../view/viewRegistry/viewRegistry";
import {iViewRegistry} from "../view/models/iViewRegistry";
import {AppMain} from "../view/views/appMain";
import {iAddressFormatter} from "../common/models/iAddressFormatter";
import {AddressFormatter} from "../common/addressFormatter";
import {DISPATCHER_MESSAGES} from "../dispatcher/dispatcher.messages";
import {Logger} from "../logger/logger";
import {SubscriptionTracker} from "../common/subscriptionTracker";
import {LOG_LEVEL} from "../logger/models/iLog";

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

const initialStoreStateDev: iStoreState = {
    environment: ENVIRONMENTS.Dev,
    dataQueryStrategy: DATA_QUERY_STRATEGY.StubQuery,
    hospitalList: [],
    currentPage: "hospital-map",
    currentPageDisplayClass: "main",
    debugShowStoreState: false,
    isLoading: true,
    selectedMapApiName: "google-maps-render",
    mapReady: false,
    mapState: {
        zoom: 7,
        center: {
            lat: 0,
            lng: 0
        }
    },
    logEntries: [{
        message: "Bootstrap initialized",
        timestamp: +new Date(),
        level: LOG_LEVEL.Debug
    }],
    existingViews: {}
};

const initialStoreStateProduction: iStoreState = {
    environment: ENVIRONMENTS.Production,
    dataQueryStrategy: DATA_QUERY_STRATEGY.StubQuery,
    hospitalList: [],
    currentPage: "hospital-map",
    currentPageDisplayClass: "main",
    debugShowStoreState: false,
    isLoading: true,
    selectedMapApiName: "google-maps-render",
    mapReady: false,
    mapState: {
        zoom: 7,
        center: {
            lat: 0,
            lng: 0
        }
    },
    logEntries: [{
        message: "Bootstrap initialized",
        timestamp: +new Date(),
        level: LOG_LEVEL.Debug
    }],
    existingViews: {}
};

const environmentInitialStates = {
    Dev: initialStoreStateDev,
    Production: initialStoreStateProduction
};


var logger;

class Bootstrapper {

    static initApp(root?: string,environmentParam?: string): iDispatcher {
        const environment = environmentParam || ENVIRONMENTS.Production;
        const containerId = root || 'appContainer';
        const modules = Bootstrapper.resolveModules(environment);
        const placeholder = document.getElementById(containerId);
        if (!placeholder) {
            throw new Error("Error during app start: a div with id "+containerId+" must be set!");
        }
        placeholder.appendChild(modules.appView);

        Bootstrapper.tryGeoLocateUser(modules);

        modules.appView.init(modules);

        //@ts-ignore
        if (window.MAP_IS_READY) {
            //@ts-ignore
            window.__init_map.call(modules);
        } else {
            //@ts-ignore
            window.__init_map = window.__init_map.bind(modules);
        }

        return modules.dispatcher;

    }


    private static tryGeoLocateUser(modules: iBaseAppModules): void {
        navigator.geolocation.getCurrentPosition(function(pos) {
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.UpdateMapState,{
                center: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }
            });
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.ReloadMap);
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
                message: "Set map position based on user's geolocated coordinates",
                data: pos,
                level: LOG_LEVEL.Message
            });
        },function(err) {
            modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
                message: "Failed to obtain user's geo location",
                data: err,
                level: LOG_LEVEL.Warning
            });
        });
    }

    private static resolveModules(environment: string): iBaseAppModules {
        const dispatcher = new Dispatcher();

        const store = new Store({
            dispatcher,
        //@ts-ignore
        },environmentInitialStates[environment]);

        const viewRegistry = new ViewRegistry();

        const appView = <AppMain>document.createElement(viewRegistry.selectors.AppMain);
        const addressFormatter = new AddressFormatter();

        logger = new Logger({
            dispatcher,
            store,
            subscriptionTracker: new SubscriptionTracker("Bootstrap",{
                dispatcher
            })
        });

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

