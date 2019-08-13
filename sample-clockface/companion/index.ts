import ft from "./fileTransfer";
import messaging from "./peerMessaging";

let init = function() {
    let msgInterval = 180000;
    setInterval(function() {
        messaging.sendMessage("COMPANION MESSAGE " + Date.now(), {timeout: msgInterval});}, msgInterval);

    ft.init();
}
init();