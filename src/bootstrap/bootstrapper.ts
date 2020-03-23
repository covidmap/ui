import {iStore} from "../store/models/iStore";
import {iDispatcher} from "../dispatcher/models/iDispatcher";
import {Store} from "../store/store";
import {Dispatcher} from "../dispatcher/dispatcher";
import {StubStoreDataQuery} from "../store/dataQuery/stubDataQuery";
import {ViewRegistry} from "../view/viewRegistry/viewRegistry";
import {iViewRegistry} from "../view/models/iViewRegistry";
import {AppMain} from "../view/views/appMain";
import {iAddressFormatter} from "../common/models/iAddressFormatter";
import {AddressFormatter} from "../common/addressFormatter";

interface iBaseAppModules {
    store: iStore,
    dispatcher: iDispatcher,
    appView: AppMain,
    viewRegistry: iViewRegistry,
    addressFormatter: iAddressFormatter
}

class Bootstrapper {

    static initApp(root: string): void {
        const modules = Bootstrapper.resolveModules();
        const placeholder = document.getElementById(root);
        if (!placeholder) {
            throw new Error("Error during app start: a div with id "+root+" must be set!");
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
        });

        const viewRegistry = new ViewRegistry();

        const appView = <AppMain>document.createElement(viewRegistry.selectors.AppMain);

        const addressFormatter = new AddressFormatter();

        return {
            store,
            dispatcher,
            appView,
            viewRegistry,
            addressFormatter
        };
    }
}

// @ts-ignore
export const boot = window['__boot'] = function(id: string) {
    Bootstrapper.initApp(id);
};
