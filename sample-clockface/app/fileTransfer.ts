import { outbox, inbox } from "file-transfer";
import * as fs from "fs";

const MAX_TRANSFER_COUNT:number = 5;

let self : any = {};

self.canTransfer = function() {
    try {
        let promise = outbox.enumerate();
        return promise.then(function (fileTransferArray) {
            console.log("fileTransferArray.length: "+ fileTransferArray.length + ", max count: " + MAX_TRANSFER_COUNT);
            let underLimit = fileTransferArray.length < MAX_TRANSFER_COUNT;
            return Promise.resolve(underLimit);
        });
    } catch (ex) {
        console.log(ex);
        return Promise.reject(false);
    }
}

self.queueFileTransfer = function(fileName:string) {
    console.log(`trying to enqueue ${fileName}`);

    let promise = outbox.enqueueFile("/private/data/" + fileName);
    return promise.then((ft) => {
        console.log("FileTransferToCompanionQueued");
        return Promise.resolve();
    })
    .catch((error) => {
        console.log(`Failed to schedule file transfer: ${error}`);
        return Promise.reject(new Error(error));
    });
}

function processReceivedFiles() {
    let fileName;
    try {
        while (fileName = inbox.nextFile()) {
            console.log("AppReceivedFile: " + fileName );
        }
    } catch(ex) {
        console.log(ex);
    }
}

let init:void|null = (function() {
    inbox.addEventListener("newfile", processReceivedFiles);
    processReceivedFiles();
})();
init = null;

export default self;