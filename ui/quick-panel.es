import _ from 'lodash'
import { enumFromTo, modifyObject } from 'subtender'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
  DropdownButton, MenuItem,
} from 'react-bootstrap'

import { indexedResourcesSelector } from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'
import { resourceNames, computeMin } from '../misc'

class QuickPanelImpl extends PureComponent {
  static propTypes = {
    resources: PTyp.object.isRequired,
    modify: PTyp.func.isRequired,
  }

  handleAdjustAll = percent => {
    const p = percent/100
    const {modify, resources} = this.props
    modify(
      modifyObject(
        'resourceRanges',
        // chain the modification of each resource together
        _.flow(resourceNames.map(resourceName =>
          // the modification on current resource
          modifyObject(
            resourceName,
            range => {
              const now = resources[resourceName]
              const {max} = range
              const minInt = computeMin(now,max,p)

              // apply modification only if it's valid
              return (
                _.isInteger(minInt) &&
                minInt >= 0 && minInt <= 300000 &&
                minInt < max ?
                  modifyObject(
                    'min', () => minInt
                  ) :
                  _.identity
              )(range)
            }
          )
        ))
      )
    )
  }

  render() {
    return (
      <Panel>
        <div>
          <DropdownButton
            id="poi-plugin-rbq-adjust-all-mins"
            onSelect={this.handleAdjustAll}
            title="Adjust All Mins"
          >
            {
              enumFromTo(10,90,x => x+10).map(v => (
                <MenuItem key={v} eventKey={v}>
                  {`${v}%`}
                </MenuItem>
              ))
            }
          </DropdownButton>
        </div>
      </Panel>
    )
  }
}

const QuickPanel = connect(
  createStructuredSelector({resources: indexedResourcesSelector}),
  mapDispatchToProps
)(QuickPanelImpl)

export { QuickPanel }
