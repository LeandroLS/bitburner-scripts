
export async function main(ns) {
    const cracks = [
      ns.brutessh,
      ns.ftpcrack,
      ns.sqlinject,
      ns.relaysmtp,
      ns.httpworm
    ]
  
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
  
    function canHack(target) {
      const requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
      const actualHackingLevel = ns.getHackingLevel(target)
      if (requiredHackingLevel > actualHackingLevel) return false
  
      const numberOfPortsRequired = ns.getServerNumPortsRequired(target)
  
      const cracksLength = cracks.length
      if (numberOfPortsRequired > cracksLength) return false
    
      return true
    }
  
    function hackTargets(canHackNodes) {
      for (const canHackNode of canHackNodes) {
        ns.print("Hacking:", canHackNode)
        for (const crack of cracks) {
          crack(canHackNode)
        }
        if(!ns.hasRootAccess(canHackNode)){
          ns.nuke(canHackNode)
          ns.alert("Hacked:", canHackNode)
        }
      }
    }
  
    while (true) {
      const networkNodes = bfsNodes()
      const canHackNodes = []
      for(const node of networkNodes) {
        if(canHack(node)){
          canHackNodes.push(node)
        }
      }
      ns.print("can hack:", canHackNodes)
      hackTargets(canHackNodes)
      await ns.sleep(500)
    }
  }
  