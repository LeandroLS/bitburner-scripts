import { bfsNodes } from "./bfsNodes";
/** @param {NS} ns */
export async function main(ns) {
  const virusName = ns.args[0]
  const ramCost = ns.getScriptRam(virusName)

  function getPossibleThreads({ serverRam, ramCost }) {
    let numThreads = parseInt(serverRam / ramCost)
    if (numThreads === 0) {
      numThreads = 1
    }
    return numThreads
  }

  function stopPreviousSameVirus({ node, virusName }) {
    const processes = ns.ps(node)
    const matchingProcesses = processes.filter((process) => process.filename === virusName)
    matchingProcesses.forEach(process => ns.kill(process.pid))
  }

  function runScript(networkNodes) {
    for (const node of networkNodes) {
      const serverRam = ns.getServerMaxRam(node)
      const numThreads = getPossibleThreads({ serverRam, ramCost })
      stopPreviousSameVirus({ node, virusName })
      ns.exec(virusName, node, { threads: numThreads })
    }
  }
  const networkNodes = bfsNodes(ns)
  runScript(networkNodes)
}