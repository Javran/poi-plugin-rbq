import { createStructuredSelector } from 'reselect'
import { words } from 'subtender'

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  ProgressBar,
  OverlayTrigger, Tooltip,
} from 'react-bootstrap'
import { recoveryDetailsSelector } from '../selectors'

import { PTyp } from '../ptyp'

const rNames = words('fuel ammo steel bauxite bucket')

class RecoveryImpl extends PureComponent {
  static propTypes = {
    recoveryDetails: PTyp.object.isRequired,
  }

  render() {
    const {recoveryDetails} = this.props
    return (
      <div style={{padding: 10}}>
        {
          rNames.map(resourceName => {
            const recovInfo = recoveryDetails[resourceName]
            const rowComponent = (
              <div
                key={resourceName}
                style={{display: 'flex', alignItems: 'center'}}>
                <div style={{flex: 1}}>{resourceName}</div>
                <ProgressBar
                  style={{width: '80%', margin: 10}}
                  min={0} max={1}
                  now={recovInfo.rate}
                />
              </div>
            )

            return recovInfo.neededAmount ? (
              <OverlayTrigger
                placement="bottom"
                key={resourceName}
                overlay={(
                  <Tooltip id={`plugin-chaos-resource-tooltip-${resourceName}`}>
                    {`${recovInfo.neededAmount} (${(recovInfo.rate*100).toFixed(4)}%)`}
                  </Tooltip>
                )}
              >
                {rowComponent}
              </OverlayTrigger>
            ) : rowComponent
          })
        }
      </div>
    )
  }
}

const Recovery = connect(
  createStructuredSelector({
    recoveryDetails: recoveryDetailsSelector,
  })
)(RecoveryImpl)

export { Recovery }
