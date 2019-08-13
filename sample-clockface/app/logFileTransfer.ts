import * as fs from "fs";
import fileTransfer from './fileTransfer';

const LOG_FILE_NAME = "./resources/logFile.txt";

export function exportLogs() {
    try {
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

            fileTransfer.transferFile(logTransferFileName)
            .then(function() {
                console.log("Export complete");
                fs.unlinkSync(logTransferFileName);
            })
            
            fs.unlinkSync(logTransferFileName);
        
    } catch(ex) {
        console.log(ex);
    }
}