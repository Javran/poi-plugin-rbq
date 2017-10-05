import { createStructuredSelector } from 'reselect'
import { words } from 'subtender'

import React, { PureComponent } from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import {
  Panel,
} from 'react-bootstrap'

import {
  resourceDetailsSelector,
} from '../../selectors'

import { PTyp } from '../../ptyp'
import { ResourceBar } from './resource-bar'

const rNames = words('fuel ammo steel bauxite bucket')

class ResourcePanelImpl extends PureComponent {
  static propTypes = {
    resourceDetails: PTyp.object.isRequired,
  }

  render() {
    const {resourceDetails} = this.props
    return (
      <Panel>
        {
          rNames.map(resourceName => (
            <ResourceBar
              key={resourceName}
              name={resourceName}
              info={resourceDetails[resourceName]}
            />
          ))
        }
      </Panel>
    )
  }
}

const ResourcePanel = connect(
  createStructuredSelector({
    resourceDetails: resourceDetailsSelector,
  })
)(ResourcePanelImpl)

export { ResourcePanel }
