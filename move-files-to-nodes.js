/** @param {NS} ns */
import { bfsNodes } from "./bfs-nodes";
export async function main(ns) {
  let filesNames = ns.args
  const needToMove = [
    "get-targets-for-give-me-money.js",
    "give-me-money.js",
    "can-hack-nodes.js",
    "bfs-nodes.js"
  ]
  if(filesNames.length === 0){
    filesNames = needToMove
  }
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