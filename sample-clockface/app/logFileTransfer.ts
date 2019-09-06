import * as fs from "fs";
import fileTransfer from './fileTransfer';

const LOG_FILE_NAME = "./resources/logFile.txt";

export function exportLogs() {
    try {
        let promise = fileTransfer.canTransfer();
        return promise.then(function (underLimit:Boolean) {

            if (underLimit) {
                console.log("Exporting test log file");

                //Set a unique transfer file name so we don't overwrite any previously queued transfer files
                let logTransferFileName = `${Date.now()}_logFile.txt`;

                try {
                    let ab = fs.readFileSync(LOG_FILE_NAME);
                    fs.writeFileSync(logTransferFileName, ab);
                } catch(e) {
                    console.log("Error renaming log file");
                    console.log(e);
                    return;
                }

                fileTransfer.queueFileTransfer(logTransferFileName)
                .then(function() {
                    console.log("Export complete");
                    fs.unlinkSync(logTransferFileName);
                });
                
                fs.unlinkSync(logTransferFileName);
            } else {
                let error = new Error("Cannot queue file transfer, max transfer count reached");
                console.log(error);
                return Promise.reject(error);
            }
        });
    } catch(ex) {
        console.log(ex);
    }
}