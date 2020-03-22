import {iStore} from "../store/models/iStore";
import {iDispatcher} from "../dispatcher/models/iDispatcher";
import {Store} from "../store/store";
import {Dispatcher} from "../dispatcher/dispatcher";
import {StubStoreDataQuery} from "../store/dataQuery/stubDataQuery";
import {SubscriptionTracker} from "../common/subscriptionTracker/subscriptionTracker";
import {ViewRegistry} from "../view/viewRegistry/viewRegistry";
import {iViewRegistry} from "../view/models/iViewRegistry";
import {AppMain} from "../view/views/appMain";
import {iSubscriptionTracker} from "../common/models/iSubscriptionTracker";

interface iBaseAppModules {
    store: iStore,
    dispatcher: iDispatcher,
    appView: HTMLElement,
    viewRegistry: iViewRegistry,
    subscriptionTracker: iSubscriptionTracker
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

        const subscriptionTracker = new SubscriptionTracker();
        const appView = <AppMain>document.createElement(viewRegistry.selectors.AppMain);

        return {
            store,
            dispatcher,
            appView,
            viewRegistry,
            subscriptionTracker
        };
    }
}
Bootstrapper.initApp();