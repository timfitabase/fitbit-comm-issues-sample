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

// self.deleteOldestQueuedTransfer = function(substringOfQueuedFileToReplace: string) {
//     try {
//     let promise = outbox.enumerate();
//     return promise.then(fileTransferArray => {
//         let matchingFile = fileTransferArray.sort().find(function(ft) {
//             let idx = ft.name.indexOf(substringOfQueuedFileToReplace);
//             return idx != -1;
//         });

//         if (matchingFile) {
//             console.log(`Cancelling ${matchingFile.name}`);
//             matchingFile.cancel();
//             return Promise.resolve(true);
//         } else {
//             return Promise.resolve(false);
//         }
//     });
//     } catch (ex) {
//         console.log(ex);
//         return Promise.reject(ex);
//     }
// }

// self.transferFile = function(fileName : string, substringOfQueuedFileToReplace: string = ""){
//     try {
//         let fileSize = fs.statSync(fileName).size;
//         if(fileSize === 0) {
//             return Promise.reject(new Error("0 byte file, cannot transfer"));
//         }

//         return queueFileTransfer(fileName);

//         let promise = self.canTransfer();
//         return promise.then(function (underLimit:Boolean) {
//             console.log("underLimit: " + underLimit);
            
//             if (underLimit) {
//                 return queueFileTransfer(fileName);
//             } else {
//                 //For our most important transfers (prompt events), try to remove an old log file so we can stay under the queued file limit.
//                 if (substringOfQueuedFileToReplace != "") {
//                     //If we were able to delete, we'll fall through and initiate the transfer.
//                     let deletePromise = self.deleteOldestQueuedTransfer(substringOfQueuedFileToReplace);
//                     return deletePromise.then(function (success:Boolean) {
//                         if (success) {
//                             return queueFileTransfer(fileName);
//                         } else {
//                             let error = new Error("Cannot queue file transfer and no queued logs to purge");
//                             console.log(error);
//                             return Promise.reject(error);
//                         }
//                     })
//                 }
//                 else {
//                     let error = new Error("Cannot queue file transfer, max transfer count reached");
//                     console.log(error);
//                     return Promise.reject(error);
//                 }
//             }
//         });
        
//     } catch(ex) {
//         console.log(ex);
//         return Promise.reject(new Error(ex));
//     }
// }

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