
import { bfsNodes } from "./bfs-nodes";
import { canHack } from "./can-hack-nodes";
export async function main(ns) {
  const cracks = [
    ns.brutessh,
    ns.ftpcrack,
    ns.sqlinject,
    ns.relaysmtp,
    ns.httpworm
  ]

  function hackTargets(canHackNodes) {
    for (const canHackNode of canHackNodes) {
      ns.print("Hacking:", canHackNode)
      for (const crack of cracks) {
        crack(canHackNode)
      }
      if (!ns.hasRootAccess(canHackNode)) {
        ns.nuke(canHackNode)
        ns.alert("Hacked:" + canHackNode)
      }
    }
  }

  while (true) {
    const networkNodes = bfsNodes(ns)
    const canHackNodes = networkNodes.filter(target => canHack({ ns, target }))
    ns.print("can hack:", canHackNodes)
    hackTargets(canHackNodes)
    await ns.sleep(500)
  }
}