export type LOG_LEVEL = "Debug" | "Message" | "Error" | "Warning";

export const LOG_LEVEL: {[key: string]: LOG_LEVEL} = {
    Debug: "Debug",
    Message: "Message",
    Error: "Error",
    Warning: "Warning"
};

export interface iLog {
    message: string,
    data?: any,
    level: LOG_LEVEL
}

export interface iTimeLog extends iLog {
    timestamp: number
}