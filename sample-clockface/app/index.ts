import document from "document";
import clock from "clock";
import * as clockUtil from "./clockUtils";
import messaging from "./peerMessaging";
import { memory } from "system";
import * as logFileTransfer from './logFileTransfer';
import fileTransfer from './fileTransfer';


let init:void|null = (function() {
    try {
        const date = document.getElementById("date");
        const time = document.getElementById("time");
        const timeShadow = document.getElementById("timeShadow");

        //Init clock
        clock.granularity = "seconds";  
        clock.ontick = (evt) => updateClock(evt);


        // Update the <text> element with the current time
        let updateClock = function(evt :any) {
            let today = evt.date;
            if (date != null) {
                date.text = clockUtil.getDateString(today);
            }
            
            let t = clockUtil.getTimeString(today);

            if (time != null) {
                time.text = t;
            }

            if (timeShadow != null) {
                timeShadow.text = t;
            }
        }

        //setInterval(function() {messaging.sendMessage("APP MESSAGE " + Date.now(), {timeout: 60000});}, 60000);

        //setInterval(function() {console.log("JS memory: " + memory.js.used + "/" + memory.js.total);}, 10000);

        setInterval(function() {logFileTransfer.exportLogs();},30000);
} catch(ex) {
    console.log(ex);
}
})();
init=null;