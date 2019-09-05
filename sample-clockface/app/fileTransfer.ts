import { outbox, inbox } from "file-transfer";
import * as fs from "fs";


let self : any = {};

const MAX_TRANSFER_COUNT:number = 5;

self.canTransfer = function() {
    try {
        let promise = outbox.enumerate();
        return promise.then(function (fileTransferArray) {
            console.log("fileTransferArray.length: "+ fileTransferArray.length + ", max count: " + MAX_TRANSFER_COUNT);
            let underLimit = fileTransferArray.length < MAX_TRANSFER_COUNT;
            return Promise.resolve(underLimit);
        });
    } catch (ex) {
        console.log("Error in app canTransfer()");
        return Promise.reject(false);
    }
}


self.transferFile = function(fileName : string){
    try {
        let fileSize = fs.statSync(fileName).size;
        if(fileSize === 0) {
            return Promise.reject(new Error("0 byte file, cannot transfer"));
        }

        let promise = self.canTransfer();
        return promise.then(function (underLimit:Boolean) {
            if (underLimit) {
                return queueFileTransfer(fileName);
            } else {
                console.log("Cannot queue file transfer, max transfer count reached");
                return Promise.reject(new Error("Cannot queue file transfer, max transfer count reached"));
            }
        });
    } catch(ex) {
        console.log(ex);
        return Promise.reject(new Error(ex));
    }
}

function queueFileTransfer(fileName:string) {
    console.log(`trying to enqueue ${fileName}`);
    let promise = outbox.enqueueFile("/private/data/" + fileName);
    return promise.then(() => {
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