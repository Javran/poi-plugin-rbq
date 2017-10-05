import { join } from 'path-extra'
import React, { PureComponent } from 'react'

import {
  ResourcePanel,
} from './resource-panel'

class RBQMain extends PureComponent {
  render() {
    return (
      <div style={{padding: 10}} >
        <link
          rel="stylesheet"
          href={join(__dirname, '..', 'assets', 'rbq.css')}
        />
        <ResourcePanel />
      </div>
    )
  }
}

export { RBQMain }
