export function getCracksLength(ns) {
  const possibleCracks = {
    "BruteSSH.exe": ns.brutessh,
    "FTPCrack.exe": ns.ftpcrack,
    "SQLInject.exe": ns.sqlinject,
    "RelaySTMP.exe": ns.relaysmtp,
    "HTTPWorm.exe": ns.httpworm
  }

  let actualCracks = 0

  for (const crackName in possibleCracks) {
    if (ns.fileExists(crackName, "home")) {
      actualCracks++
    }
  }
  return actualCracks
}

export function canHack({ ns, target }) {
  if (alreadyHacked({ ns, target })) return false
  const requiredHackingLevel = ns.getServerRequiredHackingLevel(target)
  const actualHackingLevel = ns.getHackingLevel(target)
  if (requiredHackingLevel > actualHackingLevel) return false

  const numberOfPortsRequired = ns.getServerNumPortsRequired(target)
  if (numberOfPortsRequired > getCracksLength(ns)) return false
  return true
}

export function alreadyHacked({ ns, target }) {
  const alreadyRoot = ns.hasRootAccess(target)
  const server = ns.getServer(target)
  const portsOpened = server.openPortCount
  return alreadyRoot && portsOpened <= getCracksLength(ns)
}