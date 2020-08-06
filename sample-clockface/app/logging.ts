import * as fs from "fs";
import { LogEntry } from "./../common/LogEntry";

const LOG_FILE_NAME = "log.txt";
const MAX_LOG_FILE_SIZE = 10 * 1024; //Cap log file at 10K
let loggingEnabled = true;

export function setLoggingEnabled(enableLogging:boolean) {
    loggingEnabled = enableLogging;
}

export function logEvent(message:string, customData:any = {}, timestamp:string = "") {
    let entry = new LogEntry(message, "Log", customData, timestamp ? timestamp : "");

    if (loggingEnabled) {
        console.log(entry.toString());
        writeToLogFile(entry);
    } else {
        //This recurses until loggingEnabled is true
        setTimeout(logEvent.bind(null, message, customData, timestamp ? timestamp : new Date().toISOString()), 5000);
    }
}

export function logError(ex:Error, message:string = "", customData:any = {}, timestamp:string = "") {
    let logString = `${message ? message+"\r\n" : ""}${ex.toString()}\r\n${ex.stack}`;

    let entry = new LogEntry(logString, "Error", customData, timestamp ? timestamp : "");
    
    if (loggingEnabled) {
        console.log(entry.toString());
        writeToLogFile(entry);
    } else {
        //This recurses until loggingEnabled is true
        setTimeout(logError.bind(null, ex, message, customData, timestamp ? timestamp : new Date().toISOString()), 5000);
    }
}

function writeToLogFile(logEntry:LogEntry){
    if (loggingEnabled) {
        let logString = JSON.stringify(logEntry) + ",";

        let fileSizeBytes = 0;
        try {
            fileSizeBytes = fs.statSync(LOG_FILE_NAME).size;
        } catch(ex) {}

        if (fileSizeBytes >= MAX_LOG_FILE_SIZE) {
            console.log("Log files capped at " + fileSizeBytes/1024);
        } else {
            let file = fs.openSync(LOG_FILE_NAME, 'a');
            
            try {
                var arrBuff = new ArrayBuffer(logString.length*2); // 2 bytes for each char
                var arrBuffView = new Uint16Array(arrBuff);

                for (var i = 0; i < logString.length; i++) {
                    arrBuffView[i] = logString.charCodeAt(i);
                }
                fs.writeSync(file, arrBuff);
            } catch(ex) {
                console.log(ex);
            } finally {
                fs.closeSync(file);
            }
        }
    }
}