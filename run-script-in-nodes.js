import { bfsNodes } from "./bfs-nodes";
/** @param {NS} ns */
export async function main(ns) {
  const scriptName = ns.args[0]

  function stopPreviousSameScript({ node, scriptName }) {
    const processes = ns.ps(node)
    const matchingProcesses = processes.filter((process) => process.filename === scriptName)
    matchingProcesses.forEach(process => ns.kill(process.pid))
  }

  function runScript(networkNodes) {
    for (const node of networkNodes) {
      stopPreviousSameScript({ node, scriptName })
      ns.exec(scriptName, node)
    }
  }
  const networkNodes = bfsNodes(ns)
  runScript(networkNodes)
}