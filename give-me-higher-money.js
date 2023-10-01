/** @param {NS} ns */
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
  
    function alreadyHacked(target) {
      const requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
      const actualHackingLevel = ns.getHackingLevel(target)
      if (requiredHackingLevel > actualHackingLevel) return false
  
      const numberOfPortsRequired = ns.getServerNumPortsRequired(target)
  
      const cracksLength = cracks.length
      if (numberOfPortsRequired > cracksLength) return false
  
      const hasRoot = ns.hasRootAccess(target)
      if(!hasRoot) return false
  
      return true
    }
  
    function getOptimalTargetServer(targets) {
  
      let closestHackingLevelTarget = null;
      let minDifferenceHackLevel = Infinity;
      let maxDifferenceMaxMoney = 0;
  
      // Iterate through the array and find the number closest to half of the target
      for (const target of targets) {
        if (alreadyHacked(target)) {
          const requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
          const actualHackingLevel = ns.getHackingLevel(target)
          const maxMoney = ns.getServerMaxMoney(target) * 0.75;
  
          const difference = Math.abs(actualHackingLevel / 2 - requiredHackingLevel);
          if (difference < minDifferenceHackLevel && maxMoney > maxDifferenceMaxMoney) {
            minDifferenceHackLevel = difference;
            maxDifferenceMaxMoney = maxMoney
            closestHackingLevelTarget = target;
          }
        }
      }
      return closestHackingLevelTarget
    }
  
    const targetList = bfsNodes()
    const higherMoneyTarget = getOptimalTargetServer(targetList)
    const securityThresh = ns.getServerMinSecurityLevel(higherMoneyTarget) + 5;
    const moneyThresh = ns.getServerMaxMoney(higherMoneyTarget) * 0.75;
    ns.print("Best Target:", higherMoneyTarget)
  
    while (true) {
      if (ns.getServerSecurityLevel(higherMoneyTarget) > securityThresh) {
        await ns.weaken(higherMoneyTarget);
      } else if (ns.getServerMoneyAvailable(higherMoneyTarget) < moneyThresh) {
        await ns.grow(higherMoneyTarget);
      } else {
        await ns.hack(higherMoneyTarget);
      }
    }
  }