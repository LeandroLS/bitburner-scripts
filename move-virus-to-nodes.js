/** @param {NS} ns */
export async function main(ns) {
    const virusName = ns.args[0]
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
          const neighbors =  ns.scan(node)
          for (const neighbor of neighbors) {
            queue.push(neighbor);
          }
        }
      }
  
      return result;
    }
  
    function moveVirus(networkNodes) {
      for (const node of networkNodes) {
        ns.scp(virusName, node, "home")
      }
    }
    while (true) {
      const networkNodes = bfsNodes()
      moveVirus(networkNodes)
      await ns.sleep(500)
    }
  }