import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
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

const resourcePlans = {
  fuel: 290000,
  ammo: 290000,
  steel: 290000,
  bauxite: 290000,
  bucket: 2950,
}

const resourceMin = {
  fuel: 150000,
  ammo: 150000,
  steel: 150000,
  bauxite: 150000,
  bucket: 2000,
}

const resourceDetailsSelector = createSelector(
  resourcesSelector,
  resourcesRaw => {
    const [fuel, ammo, steel, bauxite, _instantBuild, bucket] =
      resourcesRaw
    return {
      fuel, ammo, steel, bauxite, bucket,
    }
  }
)

// min = actual-0.1*planned / 0.9 (for 10%)

const recoveryDetailsSelector = createSelector(
  resourceDetailsSelector,
  resourceDetails => _.fromPairs(
    _.toPairs(resourcePlans).map(
      ([resourceName, plannedAmount]) => {
        const actualAmount = resourceDetails[resourceName]
        const minAmount = resourceMin[resourceName]
        const recovInfo = (actualAmount >= plannedAmount) ?
          {
            rate: 1,
            neededAmount: null,
          } : {
            rate: Math.max(actualAmount-minAmount,0) / Math.max(plannedAmount-minAmount,0),
            neededAmount: plannedAmount - actualAmount,
          }
        return [resourceName, recovInfo]
      })
  )
)

const resourceDetailsAltSelector = createSelector(
  resourceDetailsSelector,
  resourceRangesSelector,
  (resourceDetails, resourceRanges) => _.fromPairs(
    _.toPairs(resourceRanges).map(
      ([resourceName,{min,max}]) => {
        const actualAmount = resourceDetails[resourceName]
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

export {
  extSelector,
  readySelector,
  resourceRangesSelector,
  resourceDetailsSelector,
  recoveryDetailsSelector,
  resourceDetailsAltSelector,
}
