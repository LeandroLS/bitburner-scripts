export async function main(ns) {
  let maxServers = ns.getPurchasedServerLimit();
  let maxSizeRam = ns.getPurchasedServerMaxRam();
  let money = ns.getPlayer().money;
  const maxRam = 16384
  while (true) {
    for (let i = 0; i < maxServers; i++) {
      if (ns.serverExists("private-" + i)) {
        const ram = ns.getServerMaxRam("private-" + i) * 2
        const upgradeCost = ns.getPurchasedServerUpgradeCost("private-" + i, ram)
        ns.print("upgrade cost:", upgradeCost)
        if (ram <= maxSizeRam && upgradeCost < money && ram <= maxRam) {
          ns.upgradePurchasedServer("private-" + i, ram)
        }
      }
    }
    await ns.sleep(500)
  }

}