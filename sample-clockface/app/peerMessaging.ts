import * as messaging from "messaging";
import asap from "fitbit-asap/app";
import { gettext } from 'i18n';


let self:any = {};

let init:void|null = (function(){
    asap.onmessage = function(message:any) {
        console.log("App received peer message: " + JSON.stringify(message));
    }

    self.sendMessage = function(message:any, options:any = null) {
        try {
            if (options) {
                asap.send(message, options);
                console.log("App sent peer message: " + JSON.stringify(message));
            } else {
                asap.send(message);
            }
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
})();
init = null;

export default self;
