export let Permissions = {};

let sub;

// Bind UI elements and other stuff that depends on what permissions the
//  users have directly to the Permissions dict defined above.
//  This way the UI will update as soon as permissions change due to mithril magic

export function init() {
    // create socket
    // bind socket updates to update const Permissions defined above

    sub = changefeed("permissions")
        .debounceTime(500)
        .map(message => message["new_val"])
        .subscribe(data => {
            Permissions = data;
            console.log("new permissions received");
        });
}

export function tearDown() {
    // close socket
    sub.unsubscribe();
    // clear dict
    Permissions = {};
}
