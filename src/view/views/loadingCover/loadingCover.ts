import {BaseView} from "../baseView";
import {HtmlString} from "../../models/iView";

export class LoadingCover extends BaseView {

    protected doInit(): HtmlString {
        //no inner html at this point
        return `
            <h2>Loading...</h2>
        `;
    }

    protected onPlacedInDocument(): void {
        this.subscribeToLoadingState();
    }

    private subscribeToLoadingState(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.IsLoading$,
            (isLoading: boolean) => {
                if (isLoading) {
                    this.classList.add("loadingActive");
                    this.classList.remove("loadingInactive");
                } else {
                    this.classList.remove("loadingActive");
                    this.classList.add("loadingInactive");
                }
            }
        );
    }

    protected doDestroySelf(): void {}

}