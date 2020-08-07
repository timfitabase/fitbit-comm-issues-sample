import * as logging from "./logging";
import messaging from "./peerMessaging";
import { memory } from "system";
import * as logFileTransfer from './logFileTransfer';

export function init() {
    try {
        setInterval(function() {messaging.sendMessage("APP MESSAGE " + Date.now(), {timeout: 60000});}, 60000);
        setInterval(function() {logFileTransfer.exportLogs();},300000);

    } catch (ex) {
        logging.logError(ex, "error in testing.init()");
    }
}