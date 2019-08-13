import * as messaging from "messaging";
import asap from "fitbit-asap/companion";

let self:any = {};

asap.onmessage = function(evt:any) {
    console.log("Companion received peer message: " + JSON.stringify(evt));
    console.log("Companion responding");
    self.sendMessage("RESPONSE " + Date.now());
}

self.sendMessage = function(message:any) {
    try {
        asap.send(message);
        console.log("Companion sent peer message: " + JSON.stringify(message));
    } catch (ex) {
        console.log(ex);
    }
}

messaging.peerSocket.onerror = function(evt:messaging.ErrorEvent) {  
    try {
        let error = new Error(`${evt.message}  Error code: ${evt.code}`);
        error.stack = evt.stack;
        console.log(JSON.stringify(error));
    } catch (ex) {
        console.log(ex);
    }
}

export default self;