export type DispatcherMessageListener = (data: any) => void;
export type DispatcherAllListener = (message: string, data: any) => void;

export interface iDispatcher {
    dispatch(message: string, data?: any): void;

    registerToAll(listener: DispatcherAllListener): void;

    registerToMessage(message: string, listener: DispatcherMessageListener): void;
}