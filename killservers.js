export async function main(ns) {
    var currentServers = ns.getPurchasedServers();
    for (var i = 0; i < currentServers.length; ++i) {
        var serv = currentServers[i];
        if (serv.includes("private-6")) {
            ns.deleteServer(serv);
        }
    }
}

