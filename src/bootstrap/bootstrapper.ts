import {iStore} from "../store/models/iStore";
import {iDispatcher} from "../dispatcher/models/iDispatcher";
import {Store} from "../store/store";
import {Dispatcher} from "../dispatcher/dispatcher";
import {StubStoreDataQuery} from "../store/dataQuery/stubDataQuery";
import {AppView} from "../view/views/appView";
import {SubscriptionTracker} from "../common/subscriptionTracker/subscriptionTracker";
import {ViewRegistry} from "../view/viewRegistry/viewRegistry";
import {iViewRegistry} from "../view/models/iViewRegistry";

interface iBaseAppModules {
    store: iStore,
    dispatcher: iDispatcher,
    appView: HTMLElement,
    viewRegistry: iViewRegistry
}

const placeholderId = "appContainer";

class Bootstrapper {

    static initApp(): void {
        const modules = Bootstrapper.resolveModules();
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            throw new Error("Error during app start: a div with id "+placeholderId+" must be set!");
        }
        placeholder.appendChild(modules.appView);
    }

    private static resolveModules(): iBaseAppModules {
        const dispatcher = new Dispatcher();

        const storeDataQuery = new StubStoreDataQuery();
        const store = new Store({
            dispatcher,
            dataQuery: storeDataQuery
        });

        const viewRegistry = new ViewRegistry();

        const subscriptionTracker = new SubscriptionTracker();
        const appView = new AppView({
            dispatcher,
            store,
            subscriptionTracker,
            viewRegistry
        });

        return {
            store,
            dispatcher,
            appView,
            viewRegistry
        };
    }
}
Bootstrapper.initApp();