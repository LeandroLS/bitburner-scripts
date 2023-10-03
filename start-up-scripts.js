export async function main(ns){
    ns.run("scan-and-hack-nodes.js")
    ns.run("auto-upgrade-servers.js")
    ns.run("get-targets-for-weak-and-grow.js")
    ns.run("move-files-to-nodes.js")
    ns.run("run-script-in-nodes.js", 1, 'get-targets-for-give-me-money.js')
}