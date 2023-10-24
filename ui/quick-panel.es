import _ from 'lodash'
import { enumFromTo, modifyObject } from 'subtender'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Panel,
} from 'react-bootstrap'
import {
  Button,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core'
import { Popover } from 'views/components/etc/overlay'

import {
  indexedResourcesSelector,
  isDevUserSelector,
} from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'
import { resourceNames, computeMin, resourceUpperBoundOf } from '../misc'
import { __ } from '../tr'

/*
  TODO: what should be considered as minimum of "done stockpiling" state.
  note that this is for now a DevUser only feature, until we
  have some ways to implement this on UI.
 */
const computeHardCapMin = rscName => {
  if (['fuel', 'ammo', 'steel', 'bauxite'].includes(rscName)) {
    return 345000
  }
  if (!['bucket', 'devMat', 'instantBuild'].includes(rscName)) {
    console.warn(`unrecognized resource: ${rscName}`)
  }
  return 2900
}

class QuickPanelImpl extends PureComponent {
  static propTypes = {
    resources: PTyp.object.isRequired,
    isDevUser: PTyp.bool.isRequired,
    modify: PTyp.func.isRequired,
  }

  handleAdjustAll = percent => () => {
    const p = percent/100
    const {modify, resources, isDevUser} = this.props
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
              const minInt = computeMin(now, max, p)
              const maxRsc = resourceUpperBoundOf(resourceName)
              const hardCapMin = computeHardCapMin(resourceName)
              // apply modification only if it's valid
              return (
                _.isInteger(minInt) &&
                minInt >= 0 && minInt <= maxRsc &&
                minInt < max ?
                  modifyObject(
                    'min', () => isDevUser ? _.min([minInt, hardCapMin]) : minInt
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
    const menuContent = (
      <Menu>
        {
          enumFromTo(10,90,x => x+10).map(v => (
            <MenuItem
              key={v}
              eventKey={v}
              text={`${v}%`}
              onClick={this.handleAdjustAll(v)}
            />
          ))
        }
      </Menu>
    )

    return (
      <Panel>
        <Panel.Body>
          <div>
            <Popover
              content={menuContent}
              position={Position.BOTTOM}
            >
              <Button>
                {__('AdjustAllMins')}
              </Button>
            </Popover>
          </div>
        </Panel.Body>
      </Panel>
    )
  }
}

const QuickPanel = connect(
  createStructuredSelector({
    resources: indexedResourcesSelector,
    isDevUser: isDevUserSelector,
  }),
  mapDispatchToProps
)(QuickPanelImpl)

export { QuickPanel }
