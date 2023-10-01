export function canHack({ ns, target }) {
  if (alreadyHacked(target)) return false
  const requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
  const actualHackingLevel = ns.getHackingLevel(target)
  if (requiredHackingLevel > actualHackingLevel) return false

  const numberOfPortsRequired = ns.getServerNumPortsRequired(target)
  if (numberOfPortsRequired > cracks.length) return false
  return true
}

export function alreadyHacked({ ns, target }) {
  const alreadyRoot = ns.hasRootAccess(target)
  const server = ns.getServer(target)
  const portsOpened = server.openPortCount
  return alreadyRoot && portsOpened <= cracks.length
}