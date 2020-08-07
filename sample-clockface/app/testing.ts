import * as logging from "./logging";
import messaging from "./peerMessaging";
import { memory } from "system";
import * as logFileTransfer from './logFileTransfer';

export function init() {
    try {
        //How often we should send the schedulingInfo file to the companion, prompting a schedule check
        const CHECK_SCHEDULE_INTERVAL = 60 * 1000;

        //This sends updated prompt status back to the companion and triggers it to check the schedule for any new prompts to display
        setInterval(function () {
            try {
                //Don't push it if memory use is critical.
                if (memory.monitor.pressure == "critical") {
                    logging.logEvent("Skipping schedule check due to critical memory usage");
                    return;
                }

                setInterval(function() {messaging.sendMessage("APP MESSAGE " + Date.now(), {timeout: 120000});}, 60000);

                setInterval(function() {logFileTransfer.exportLogs();},300000);

            } catch (ex) {
                logging.logError(ex, "Error in testing.ts");
            }
        }, 60000);
    } catch (ex) {
        logging.logError(ex, "error in testing.init()");
    }
}