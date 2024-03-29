import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  configSelector,
} from 'views/utils/selectors'
import { initState } from './store'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-rbq'),
  ext => _.isEmpty(ext) ? initState : ext)

const readySelector = createSelector(
  extSelector,
  ext => ext.ready
)

const resourceRangesSelector = createSelector(
  extSelector,
  ext => ext.resourceRanges
)

const infoSelector = state => state.info

const resourcesSelector = createSelector(
  infoSelector,
  info => info.resources
)

const indexedResourcesSelector = createSelector(
  resourcesSelector,
  resourcesRaw => {
    const [fuel, ammo, steel, bauxite, instantBuild, bucket, devMat] =
      resourcesRaw
    return {
      fuel, ammo, steel, bauxite,
      bucket, devMat, instantBuild,
    }
  }
)

const resourceDetailsSelector = createSelector(
  indexedResourcesSelector,
  resourceRangesSelector,
  (resources, resourceRanges) => _.fromPairs(
    _.toPairs(resourceRanges).map(
      ([resourceName,{min,max}]) => {
        const actualAmount = resources[resourceName]
        const recovInfo = (actualAmount >= max) ?
          {
            rate: 1,
            neededAmount: null,
          } : {
            rate: Math.max(actualAmount-min,0) / Math.max(max-min,0),
            neededAmount: max - actualAmount,
          }
        return [
          resourceName,
          {...recovInfo,min,max,now: actualAmount},
        ]
      }
    )
  )
)

const isDevUserSelector = createSelector(
  configSelector,
  cfg => _.get(cfg, ['javran'], false)
)

export {
  extSelector,
  readySelector,
  indexedResourcesSelector,
  resourceRangesSelector,
  resourceDetailsSelector,
  isDevUserSelector,
}
