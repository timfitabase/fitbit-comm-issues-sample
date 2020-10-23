import document from "document";
import clock from "clock";
import { gettext } from "i18n";
import * as clockUtil from "../common/clockUtils";
import * as logging from './logging';
import { display } from 'display';

let self:any = {};
let date;
let time;
let timeShadow;

let init:void|null = (function () {

    console.log("clock initialized");
    self.show = function() {
        //@ts-ignore
        document.location.replace("./resources/clock.view").then(() => {
            internalInit();
        });
        
    }

    self.unload = function() {
        clock.removeEventListener("tick", onTick);
    }

    function internalInit() {
        try {
            date = document.getElementById("date");
            time = document.getElementById("time");
            timeShadow = document.getElementById("timeShadow");

            //Init clock
            clock.granularity = "seconds";  
            clock.addEventListener("tick", onTick)

            display.on = true;
        } catch(ex) {
            logging.logError(ex, gettext("$2"));
        }
    }

    function onTick(evt) {
        {
            let d = evt.date;
            if (date != null) {
                date.text = clockUtil.getDateString(d);
            }
            let t = clockUtil.getTimeString(d);
        
            if (time != null) {
                time.text = t;
            }
        
            if (timeShadow != null) {
                timeShadow.text = t;
            }
        };
    }
})();
init = null;

export default self;