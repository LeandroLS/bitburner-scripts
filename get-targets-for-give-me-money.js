import { bfsNodes } from "./bfs-nodes";
/** @param {NS} ns */
export async function main(ns) {
  const cracks = [
    ns.brutessh,
    ns.ftpcrack,
    ns.sqlinject,
    ns.relaysmtp,
    ns.httpworm
  ]
  const scriptName = "give-me-money.js"
  const ramCost = ns.getScriptRam(scriptName)
  const host = ns.getHostname()
  const serverRam = ns.getServerMaxRam(host)
  const numThreads = getPossibleThreads({ serverRam, ramCost })
  function getPossibleThreads({ serverRam, ramCost }) {
    let numThreads = parseInt(serverRam / ramCost)
    if (numThreads === 0) {
      numThreads = 1
    }
    return numThreads
  }

  function runScript(optimalNodesToRunScript) {
    let threadsPerNode = parseInt(numThreads / optimalNodesToRunScript.length)

    if(threadsPerNode === 0){
      threadsPerNode = 1
    }
    for (const node of optimalNodesToRunScript) {
      ns.exec("give-me-money.js", host, threadsPerNode, node)
    }
  }

  function alreadyHacked(target) {
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
    const actualHackingLevel = ns.getHackingLevel(target)
    if (requiredHackingLevel > actualHackingLevel) return false

    const numberOfPortsRequired = ns.getServerNumPortsRequired(target)

    const cracksLength = cracks.length
    if (numberOfPortsRequired > cracksLength) return false

    const hasRoot = ns.hasRootAccess(target)
    if (!hasRoot) return false

    return true
  }

  function getOptimalTargetsServers(targets) {
    const maxTargets = 20
    let possibleTargets = []
    // Iterate through the array and find the number closest to half of the target
    for (const target of targets) {
      if (alreadyHacked(target)) {
        if(target.includes("private-")) continue
        if(target.includes("home")) continue
        if(possibleTargets.length <= maxTargets){
          possibleTargets.push(target)
        } else {
          const lowerMoneyTargetIndex = possibleTargets.findIndex((node) => {
            const nodeMaxMoney = ns.getServerMaxMoney(node)
            const targetMaxMoney = ns.getServerMaxMoney(target)
            return nodeMaxMoney < targetMaxMoney
          })
          possibleTargets = possibleTargets.slice(lowerMoneyTargetIndex+1)
          possibleTargets.push(target)
        }
      }
    }
    return possibleTargets
  }

  const networkNodes = bfsNodes(ns)
  const optimalNodesToRunScript = getOptimalTargetsServers(networkNodes)

  runScript(optimalNodesToRunScript)
}