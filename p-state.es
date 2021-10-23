import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const latestVersion = '0.2.0'

const stateToPState = ({resourceRanges}) => ({
  $dataVersion: latestVersion,
  resourceRanges,
})

const getPStateFilePath = () => {
  const {APPDATA_PATH} = window
  const path = join(APPDATA_PATH,'rbq')
  ensureDirSync(path)
  return join(path,`p-state.json`)
}

const savePState = pState => {
  const path = getPStateFilePath()
  try {
    writeJsonSync(path,pState)
  } catch (err) {
    console.error('Error while writing to p-state file', err)
  }
}

const updatePState = oldPState => {
  const currentPState = {...oldPState}

  if (currentPState.$dataVersion === 'initial') {
    currentPState.resourceRanges.instantBuild = {min: 0, max: 3000}
    currentPState.resourceRanges.devMat = {min: 0, max: 3000}
    currentPState.$dataVersion = '0.2.0'
  }

  if (currentPState.$dataVersion === latestVersion) {
    return currentPState
  }

  throw new Error('failed to update the config')
}

const loadPState = () => {
  try {
    return updatePState(readJsonSync(getPStateFilePath()))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading config', err)
    }
  }
  return null
}

export {
  stateToPState,
  savePState,
  loadPState,
}
