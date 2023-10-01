/** @param {NS} ns */
export async function main(ns) {
    const target = await ns.getHostname()

    const securityThresh = await ns.getServerMinSecurityLevel(target) + 5;
    const moneyThresh = await ns.getServerMaxMoney(target) * 0.75;

    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}