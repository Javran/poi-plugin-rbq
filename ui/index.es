import { join } from 'path-extra'
import React from 'react'

import {
  ResourcePanel,
} from './resource-panel'

import {
  QuickPanel,
} from './quick-panel'

const RBQMain = _props => (
  <div style={{padding: 10}} >
    <link
      rel="stylesheet"
      href={join(__dirname, '..', 'assets', 'rbq.css')}
    />
    <ResourcePanel />
    <QuickPanel />
  </div>
)

export { RBQMain }
