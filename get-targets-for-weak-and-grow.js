import { bfsNodes } from "./bfs-nodes";
import { alreadyHacked } from "./can-hack-nodes";

export async function main(ns) {
  const scriptName = "weak-and-grow.js"
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

    if (threadsPerNode === 0) {
      threadsPerNode = 1
    }
    for (const node of optimalNodesToRunScript) {
      ns.run("weak-and-grow.js", threadsPerNode, node)
    }
  }

  function healthyTarget(target) {
    if (target.includes("private-")) return false
    if (target.includes("home")) return false
    if (ns.getServerMaxMoney(target) === 0) return false
    if (ns.getServerMinSecurityLevel(target) === 0) return false
    return true
  }
  function getOptimalTargetsServers(targets) {
    const maxTargets = 20
    let possibleTargets = []
    // Iterate through the array and find the number closest to half of the target
    for (const target of targets) {
      if (alreadyHacked({ ns, target }) && healthyTarget(target)) {
        if (possibleTargets.length <= maxTargets) {
          possibleTargets.push(target)
        } else {
          const lowerMoneyTargetIndex = possibleTargets.findIndex((node) => {
            const nodeMaxMoney = ns.getServerMaxMoney(node)
            const targetMaxMoney = ns.getServerMaxMoney(target)
            return nodeMaxMoney < targetMaxMoney
          })
          possibleTargets = possibleTargets.slice(lowerMoneyTargetIndex + 1)
          possibleTargets.push(target)
        }
      }
    }
    return possibleTargets
  }

  const networkNodes = bfsNodes(ns)
  const optimalNodesToWeak = getOptimalTargetsServers(networkNodes)

  const higherMoneyToLowerNodes = optimalNodesToWeak.sort((nodeA, nodeB) => {
    const nodeAMaxMoney = ns.getServerMaxMoney(nodeA)
    const nodeBMaxMoney = ns.getServerMaxMoney(nodeB)
    if (nodeAMaxMoney < nodeBMaxMoney) return 1
    if (nodeAMaxMoney > nodeBMaxMoney) return -1
    return 0
  })

  runScript(higherMoneyToLowerNodes)

}