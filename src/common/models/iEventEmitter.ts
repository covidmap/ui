export interface iEventEmitter {

    on(event: string,callback: Function): void;

    emit(event: string,data: any): void

}