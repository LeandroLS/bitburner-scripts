export async function main(ns) {
  let maxServers = ns.getPurchasedServerLimit();
  let maxSizeRam = ns.getPurchasedServerMaxRam();
  let money = ns.getPlayer().money;
  const maxRam = 32768
  while (true) {
    for (let i = 0; i <= maxServers; i++) {
      if (ns.serverExists("private-" + i)) {
        const ram = ns.getServerMaxRam("private-" + i) * 2
        const upgradeCost = ns.getPurchasedServerUpgradeCost("private-" + i, ram)
        ns.print("upgrade cost:", upgradeCost, "private-" + i )
        if (ram <= maxSizeRam && upgradeCost < money && ram <= maxRam) {
          ns.upgradePurchasedServer("private-" + i, ram)
          ns.print("Upgraded: " + "private-" + i )
        }
      }
    }
    await ns.sleep(500)
  }

}