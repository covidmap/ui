import {iStore, iStoreState} from "../store/models/iStore";
import {iDispatcher} from "../dispatcher/models/iDispatcher";
import {Store} from "../store/store";
import {Dispatcher} from "../dispatcher/dispatcher";
import {StubStoreDataQuery} from "../store/dataQuery/stubDataQuery";
import {ViewRegistry} from "../view/viewRegistry/viewRegistry";
import {iViewRegistry} from "../view/models/iViewRegistry";
import {AppMain} from "../view/views/appMain";
import {iAddressFormatter} from "../common/models/iAddressFormatter";
import {AddressFormatter} from "../common/addressFormatter";
import {MapRenderFactory} from "../view/mapRender/mapRenderFactory";
import {iMapRenderFactory} from "../view/models/iMapRender";

interface iBaseAppModules {
    store: iStore,
    dispatcher: iDispatcher,
    appView: AppMain,
    viewRegistry: iViewRegistry,
    addressFormatter: iAddressFormatter,
    mapRenderFactory: iMapRenderFactory
}

const initialStoreState: iStoreState = {
    hospitalList: [],
    currentPage: "index-main",
    debugShowStoreState: false,
    isLoading: false,
    selectedMapApiName: "StubMap"
};


const placeholderId = "appContainer";

class Bootstrapper {

    static initApp(): void {
        const modules = Bootstrapper.resolveModules();
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            throw new Error("Error during app start: a div with id "+placeholderId+" must be set!");
        }
        placeholder.appendChild(modules.appView);
        modules.appView.init(modules);
    }

    private static resolveModules(): iBaseAppModules {
        const dispatcher = new Dispatcher();

        const storeDataQuery = new StubStoreDataQuery();
        const store = new Store({
            dispatcher,
            dataQuery: storeDataQuery
        },initialStoreState);

        const viewRegistry = new ViewRegistry();

        const appView = <AppMain>document.createElement(viewRegistry.selectors.AppMain);
        const addressFormatter = new AddressFormatter();

        const mapRenderFactory = new MapRenderFactory();

        return {
            store,
            dispatcher,
            appView,
            viewRegistry,
            addressFormatter,
            mapRenderFactory
        };
    }
}
Bootstrapper.initApp();