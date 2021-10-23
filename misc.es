import { words } from 'subtender'

const resourceNames = words('fuel ammo steel bauxite bucket devMat instantBuild')

/*
   given now, max, p (p /= 1), computes a non-negative integer min
   such that `(max-now)/(max-min)` is close to `p`.
 */
const computeMin = (now, max, p) => {
  const min = (now - p*max)/(1-p)
  const minInt = Math.max(0,Math.floor(min))
  return minInt
}

export {
  resourceNames,
  computeMin,
}
