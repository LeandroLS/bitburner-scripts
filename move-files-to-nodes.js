/** @param {NS} ns */
import { bfsNodes } from "./bfs-nodes";
export async function main(ns) {
  const filesNames = ns.args
  function moveFile(networkNodes) {
    for (const node of networkNodes) {
      filesNames.forEach(file => {
        ns.scp(file, node, "home")
      })
    }
  }
  while (true) {
    const networkNodes = bfsNodes(ns)
    moveFile(networkNodes)
    await ns.sleep(500)
  }
}