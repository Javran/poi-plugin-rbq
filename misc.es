import { words } from 'subtender'

const resourceNames = words('fuel ammo steel bauxite bucket')

const computeMin = (now, max, p) => {
  const min = (now - p*max)/(1-p)
  const minInt = Math.max(0,Math.floor(min))
  return minInt
}

export {
  resourceNames,
  computeMin,
}
