import { outbox, inbox } from "file-transfer";

let self : any = {};


async function processReceivedFiles() {
    let file;
    try {
        while (file = await inbox.pop()) {
            console.log("CompanionReceivedFile.  Filename: " + file.name + " length: " + file.length);
        }
    } catch(ex) {
        console.log(ex);
    }
}

self.init = function() {
    inbox.onnewfile = processReceivedFiles;
}

export default self;