import { RBQMain as reactClass } from './ui'
import { reducer, withBoundActionCreators } from './store'
import { loadPState } from './p-state'
import { globalSubscribe, globalUnsubscribe } from './observers'

const pluginDidLoad = () => {
  globalSubscribe()
  setTimeout(() =>
    withBoundActionCreators(bac => {
      const pState = loadPState()
      if (pState !== null) {
        const curState = {...pState}
        const {resourceRanges} = curState
        bac.ready({resourceRanges})
      } else {
        bac.ready(undefined)
      }
    })
  )
}

const pluginWillUnload = globalUnsubscribe

export {
  reactClass,
  reducer,
  pluginDidLoad,
  pluginWillUnload,
}
