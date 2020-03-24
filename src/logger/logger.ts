import {iStore} from "../store/models/iStore";
import {iSubscriptionTracker} from "../common/models/iSubscriptionTracker";
import {iTimeLog, LOG_LEVEL} from "./models/iLog";
import {iDispatcher} from "../dispatcher/models/iDispatcher";
import {DISPATCHER_MESSAGES} from "../dispatcher/dispatcher.messages";

interface iLoggerDependencies {
    store: iStore,
    subscriptionTracker: iSubscriptionTracker,
    dispatcher: iDispatcher,
};

export class Logger {

    private modules: iLoggerDependencies;

    constructor(
        modules: iLoggerDependencies
    ) {
        this.modules = modules;
        this.subscribeToLogs();
    }

    private subscribeToLogs(): void {
        this.modules.subscriptionTracker.subscribeTo(
            this.modules.store.LogEntries$,
            (log: iTimeLog) => {
                this.handleLog(log);
            }
        );
    }

    private handleLog(log: iTimeLog): void {
        switch (log.level) {
            case LOG_LEVEL.Message:
                this.handleMessageLog(log);
                break;
            case LOG_LEVEL.Error:
                this.handleErrorLog(log);
                break;
            case LOG_LEVEL.Debug:
                this.handleDebugLog(log);
                break;
            case LOG_LEVEL.Warning:
                this.handleWarningLog(log);
                break;
            default:
                this.createWarningLog("Log type "+log.level+" is not a valid log type!");
                break;
        }
    }

    private handleMessageLog(log: iTimeLog): void {
        this.consoleLog("log",log);
    }

    private handleErrorLog(log: iTimeLog): void {
        this.consoleLog("error",log);
    }

    private handleDebugLog(log: iTimeLog): void {
        this.consoleLog("log",log);
    }

    private handleWarningLog(log: iTimeLog): void {
        this.consoleLog("warn",log);
    }

    private consoleLog(func: string,log: iTimeLog): void {
        //@ts-ignore
        console[func](
            new Date(log.timestamp).toLocaleString()+" => ",
            log.message,
            log.data || ""
        );
    }

    private createWarningLog(warning: any): void {
        this.modules.dispatcher.dispatch(DISPATCHER_MESSAGES.NewLog,{
            message: warning,
            level: LOG_LEVEL.Warning
        });
    }

}