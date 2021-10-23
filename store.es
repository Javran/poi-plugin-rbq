import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { mkSimpleReducer } from 'subtender'

import { store } from 'views/create-store'

const itemRange = {min: 0, max: 3000}

const initState = {
  ready: false,
  resourceRanges: {
    ..._.fromPairs(['fuel', 'ammo', 'steel', 'bauxite'].map(resourceName =>
      [resourceName, {min: 0, max: 350000}])
    ),
    bucket: itemRange,
    devMat: itemRange,
    instantBuild: itemRange,
  },
}

const reducer = mkSimpleReducer(
  initState,
  '@poi-plugin-rbq@Modify',
  '@poi-plugin-rbq@Ready',
)

const actionCreators = {
  ready: newState => ({
    type: '@poi-plugin-rbq@Ready',
    newState,
  }),
  modify: modifier => ({
    type: '@poi-plugin-rbq@Modify',
    modifier,
  }),
}

const mapDispatchToProps = _.memoize(dispatch =>
  bindActionCreators(actionCreators, dispatch))

const withBoundActionCreators = (func, dispatch=store.dispatch) =>
  func(mapDispatchToProps(dispatch))

export {
  initState,
  reducer,
  actionCreators,
  mapDispatchToProps,
  withBoundActionCreators,
}
