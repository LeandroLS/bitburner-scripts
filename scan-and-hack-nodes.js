
import { bfsNodes } from "./bfsNodes";
export async function main(ns) {
  const cracks = [
    ns.brutessh,
    ns.ftpcrack,
    ns.sqlinject,
    ns.relaysmtp,
    ns.httpworm
  ]

  function alreadyHacked(target){
    const alreadyRoot = ns.hasRootAccess(target)
    const server = ns.getServer(target)
    const portsOpened = server.openPortCount
    return alreadyRoot && portsOpened <= cracks.length
  }

  function canHack(target) {
    if(alreadyHacked(target)) return false
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
    const actualHackingLevel = ns.getHackingLevel(target)
    if (requiredHackingLevel > actualHackingLevel) return false

    const numberOfPortsRequired = ns.getServerNumPortsRequired(target)
    if (numberOfPortsRequired > cracks.length) return false

    return true
  }

  function hackTargets(canHackNodes) {
    for (const canHackNode of canHackNodes) {
      ns.print("Hacking:", canHackNode)
      for (const crack of cracks) {
        crack(canHackNode)
      }
      if (!ns.hasRootAccess(canHackNode)) {
        ns.nuke(canHackNode)
        ns.alert("Hacked:", canHackNode)
      }
    }
  }

  while (true) {
    const networkNodes = bfsNodes(ns)
    const canHackNodes = networkNodes.filter(node => canHack(node))
    ns.print("can hack:", canHackNodes)
    hackTargets(canHackNodes)
    await ns.sleep(500)
  }
}