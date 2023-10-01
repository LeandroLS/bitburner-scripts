/** @param {NS} ns */
export async function main(ns) {
  const virusName = ns.args[0]
  const ramCost = ns.getScriptRam(virusName)

  function bfsNodes() {
    const start = ns.getHostname()
    const queue = [start];
    const visited = new Set();
    const result = [];

    while (queue.length) {
      const node = queue.shift();

      if (!visited.has(node)) {
        visited.add(node);
        result.push(node);
        const neighbors = ns.scan(node)
        for (const neighbor of neighbors) {
          queue.push(neighbor);
        }
      }
    }

    return result;
  }
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

  function runVirus(networkNodes) {
    for (const node of networkNodes) {
      const serverRam = ns.getServerMaxRam(node)
      const numThreads = getPossibleThreads({ serverRam, ramCost })
      stopPreviousSameVirus({ node, virusName })
      ns.exec(virusName, node, { threads: numThreads })
    }
  }
  const networkNodes = await bfsNodes()
  runVirus(networkNodes)
}