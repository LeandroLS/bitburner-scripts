
import { bfsNodes } from "./bfs-nodes";
import { canHack } from "./can-hack-nodes";
export async function main(ns) {
  const cracks = {
    "BruteSSH.exe": ns.brutessh,
    "FTPCrack.exe": ns.ftpcrack,
    "SQLInject.exe": ns.sqlinject,
    "RelaySTMP.exe": ns.relaysmtp,
    "HTTPWorm.exe": ns.httpworm
  }


  function hackTargets(canHackNodes) {
    for (const canHackNode of canHackNodes) {
      ns.print("Hacking:", canHackNode)
      for (const crackName in cracks) {
        if (ns.fileExists(crackName, "home")) {
          cracks[crackName](canHackNode)
        }
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