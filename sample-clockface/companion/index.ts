import ft from "./fileTransfer";
import messaging from "./peerMessaging";
import { me } from "companion"

const MILLISECONDS_PER_MINUTE = 1000 * 60;
    me.wakeInterval = 6 * MILLISECONDS_PER_MINUTE;

    if (me.launchReasons.wokenUp) {
        // The companion started due to a periodic timer
        console.log("Started due to wake interval");
        messaging.sendMessage("COMPANION STARTED DUE TO WAKE INTERVAL. " + Date.now());
    } else if (me.launchReasons.fileTransfer) {
        console.log("Started due to file transfer");
    }

    me.onwakeinterval = evt => {
        console.log("Companion was already awake - onwakeinterval");
        messaging.sendMessage("onwakeinterval fired but companion was already running. " + Date.now());
        }

let init = function() {
    

    // let msgInterval = 180000;
    // setInterval(function() {
    //     messaging.sendMessage("COMPANION MESSAGE " + Date.now(), {timeout: msgInterval});}, msgInterval);

    ft.init();
}
init();