import document from "document";
import * as messaging from "messaging";
import asap from "fitbit-asap/app";
import * as logging from './logging';
import * as clockUtil from "../common/clockUtils";

import * as fs from "fs";


let self:any = {};

let init:void|null = (function(){
    const MAX_UNSENT_MESSAGES = 5; //The max number of messages allowed to be enqueued, waiting to send, at any given time
    const ASAP_FILE_PREFIX = "_asap_";

    let canEnqueue = function() {
        try {
            let listDir;
            try {
                listDir = fs.listDirSync("/private/data/");
            } catch (ex) {
                return true;
            }
            let dirIter;
            let peerMessagesFileCount = 0;
            
            //Get a count of the _asap_ files stored in the file system already and see if we've reached max
            while((dirIter = listDir.next()) && !dirIter.done && peerMessagesFileCount < MAX_UNSENT_MESSAGES) {
                if(dirIter.value && dirIter.value.indexOf(ASAP_FILE_PREFIX) >= 0) {
                    peerMessagesFileCount++;
                }
            }
            if (peerMessagesFileCount >= MAX_UNSENT_MESSAGES) {
                return false;
            }
            return true;

        } catch (ex) {
            logging.logError(ex, "error in peerMessaging.canEnqueue");
        }
    }

    asap.onmessage = function(message:any) {
        try {

            console.log("App received peer message: " + JSON.stringify(message));

            let receivedDate = document.getElementById("lastMessageReceivedDate");
            let d = new Date();
            receivedDate!.text = `${clockUtil.getDateString(d)} ${clockUtil.getTimeString(d)}`;

        } catch (ex) {
            logging.logError(ex, "error in asap.onmessage()");
        }
    }

    self.sendMessage = function(message:any, options:any = null, shouldLog:boolean = true) {
        try {
            if (canEnqueue()) {
                if (options) {
                    asap.send(message, options);
                } else {
                    asap.send(message);
                }
                let sentDate = document.getElementById("lastMessageSentDate");
                let d = new Date();
                sentDate!.text = `${clockUtil.getDateString(d)} ${clockUtil.getTimeString(d)}`;

                if (shouldLog) {
                    logging.logEvent("SentPeerMessage");
                } else {
                    console.log("SentPeerMessage");
                }
            } else {
                if (shouldLog) {
                    let error = new Error("Cannot queue peer message, max enqueued message count reached");
                    logging.logError(error);
                } else {
                    console.log("SentPeerMessage");
                    console.log("Error: Cannot queue peer message, max enqueued message count reached");
                }            
            }
        } catch (ex) {
            logging.logError(ex, "Error in peerMessaging.sendMessage()");
        }
    }

    messaging.peerSocket.onerror = function(evt:messaging.ErrorEvent) {  
        try {
            let error = new Error(`${evt.message}  Error code: ${evt.code}`);
            logging.logError(error, "Error - messaging.peerSocket.onerror");
        } catch (ex) {
            console.log(ex);
            logging.logError(new Error("MessageSocket error"));
        }
    }
})();
init = null;

export default self;
