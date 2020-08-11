import clock from "./clock";
import { memory } from "system";
import * as testing from "./testing";

let init:void|null = (function() {
    try {
        testing.init();
        clock.show();

        setInterval(function() {console.log("JS memory: " + memory.js.used + "/" + memory.js.total);}, 10000);
} catch(ex) {
    console.log(ex);
}
})();
init=null;