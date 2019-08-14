import ft from "./fileTransfer";
import messaging from "./peerMessaging";
import { me } from "companion"

let init = function() {
    const MILLISECONDS_PER_MINUTE = 1000 * 60;
    me.wakeInterval = 5.5 * MILLISECONDS_PER_MINUTE;

    if (me.launchReasons.wokenUp) {
        // The companion started due to a periodic timer
        console.log("Started due to wake interval!")
      }

    let msgInterval = 180000;
    setInterval(function() {
        messaging.sendMessage("COMPANION MESSAGE " + Date.now(), {timeout: msgInterval});}, msgInterval);

    ft.init();
}
init();