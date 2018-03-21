export function dateDelta(d1, d2) {
    let d = Math.abs(d2 - d1) / 1000;
    let r = {};
    let s = {
        yr: 31536000,
        mo: 2592000,
        wk: 604800,
        day: 86400,
        hr: 3600,
        min: 60,
        sec: 1
    };

    Object.keys(s).forEach(function (key) {
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
    });

// for example: {year:0,month:0,week:1,day:2,hour:34,minute:56,second:7}
//     console.log(r);

    let parsed = "";
    for (let key of Object.keys(r)) {
        if (parsed)
            break;

        let val = r[key];
        if (!val) {
            continue;
        }

        parsed = parseVal(val,  key);
    }

    if(!parsed) {
        parsed = "just now";
    }
    return parsed;
}

function parseVal(val, denom) {
    if (val === 1) {
        return "a " + denom + " ago";
    } else {
        return val + " " + denom + "s ago";
    }
}

export function rdbEpochToDate(ep) {
    let date = new Date(0);
    date.setUTCSeconds(ep);
    return date;
}
