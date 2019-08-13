import { outbox, inbox, FileTransfer } from "file-transfer";

let self : any = {};

self.transferFile = function(fileName : string){
    try {
        let promise = outbox.enqueueFile("/private/data/" + fileName);
        return promise.then((ft) => {
            console.log("FileTransferToCompanionQueued.  Filename: " + fileName);

            ft.onchange = onFileTransferEvent;
            self.dumpQueue();

            return Promise.resolve();
        })
        .catch((error) => {
            console.log("Failed to schedule file transfer.  Filename: " + fileName);
            return Promise.reject(new Error(error));
        });
    } catch(ex) {
        console.log(ex);
        return Promise.reject(new Error(ex));
    }
}

function onFileTransferEvent(this:FileTransfer, e:Event) {
    console.log(`onFileTransferEvent(): name=${this.name} readyState=${this.readyState}`);
    self.dumpQueue();
}

self.dumpQueue = function() {
    outbox.enumerate()
        .then(fileTransferArray => {
        console.log('dumpQueue(): length='+fileTransferArray.length);
        fileTransferArray.forEach(function(transfer) {
            console.log(`${transfer.name}: ${transfer.readyState}`);
            });
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