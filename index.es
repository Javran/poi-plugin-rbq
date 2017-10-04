import { RBQMain as reactClass } from './ui'
import { reducer, withBoundActionCreators } from './store'

import { loadPState } from './p-state'

const pluginDidLoad = () =>
  setTimeout(() =>
    withBoundActionCreators(bac => {
      const pState = loadPState()
      if (pState !== null) {
        const {newState} = pState
        bac.ready(newState)
      } else {
        bac.ready(undefined)
      }
    })
  )

const pluginWillUnload = () => {
}

export {
  reactClass,
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
