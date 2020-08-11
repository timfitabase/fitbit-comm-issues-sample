/*
 * From: https://github.com/chandanv89/fitbit-minimalist-clock-face
 */

// Add zero in front of numbers < 10
export function zeroPad(i: Number) {
    let paddedValue: string = "";
    if (i < 10) {
        paddedValue = "0" + i.toString();
    }
    else {
        paddedValue = i.toString();
    }
    return paddedValue;
}

export function getDateString(dateObj: Date) {
    let day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    let month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    let dt = zeroPad(dateObj.getDate());
    let week = day[dateObj.getDay()];
    let mon = month[dateObj.getMonth()];

    return `${week} ${dt} ${mon}`;
}

export function getTimeString(dateObj: Date) {
    let hrs = dateObj.getHours();
    hrs = ((hrs + 11) % 12 + 1);
    let hours = monoDigits(zeroPad(hrs));
    let mins = monoDigits(zeroPad(dateObj.getMinutes()));

    return `${hours}:${mins}`;
}

// Convert a number to a special monospace number
export function monoDigits(digits: String) {
    var ret = "";
    for (var index = 0; index < digits.length; index++) {
        var num = digits.charAt(index);
        ret = ret.concat(hex2a("0x1" + num));
    }
    return ret;
}

// Hex to string
export function hex2a(hex: String) {
    var str = '';
    for (var index = 0; index < hex.length; index += 2) {
        var val = parseInt(hex.substr(index, 2), 16);
        if (val) str += String.fromCharCode(val);
    }
    return str.toString();
}