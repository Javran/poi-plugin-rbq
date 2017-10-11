import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import { modifyObject } from 'subtender'

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
} from 'react-bootstrap'

import {
  resourceDetailsSelector,
} from '../../selectors'
import { PTyp } from '../../ptyp'
import { ResourceBar } from './resource-bar'
import { mapDispatchToProps } from '../../store'
import { resourceNames } from '../../misc'

class ResourcePanelImpl extends PureComponent {
  static propTypes = {
    resourceDetails: PTyp.object.isRequired,
    modify: PTyp.func.isRequired,
  }

  handleChangeMinMax = name => (min,max) =>
    this.props.modify(
      modifyObject(
        'resourceRanges',
        modifyObject(
          name,
          _.flow(
            modifyObject('min', () => min),
            modifyObject('max', () => max)
          )
        )
      )
    )

  render() {
    const {resourceDetails} = this.props
    return (
      <Panel>
        {
          resourceNames.map(resourceName => (
            <ResourceBar
              key={resourceName}
              name={resourceName}
              info={resourceDetails[resourceName]}
              onChangeMinMax={this.handleChangeMinMax(resourceName)}
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
  }),
  mapDispatchToProps,
)(ResourcePanelImpl)

export { ResourcePanel }
