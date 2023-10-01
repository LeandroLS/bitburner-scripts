//get all nodes in network
export function bfsNodes(ns) {
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