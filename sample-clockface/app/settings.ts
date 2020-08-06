import * as fs from "fs";
import * as logging from './logging';
import { display } from 'display';

const SETTINGS_FILE = "settings.cbor";
const SETTINGS_TYPE = "cbor";

let settings:any = {};


function applySettings() {
    try {
        
        display.on = true;      
    } catch (ex) {
        logging.logError(ex, "Error applying app settings");
    }
}

export function saveSettings() {
    fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

export function loadSettings() {
    try {
        settings = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    } catch (ex) {
        settings = {};
    }
    applySettings();
}
