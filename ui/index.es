import { createStructuredSelector } from 'reselect'
import { join } from 'path-extra'
import { words } from 'subtender'

import React, { PureComponent } from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import {
  Panel,
  ProgressBar,
  OverlayTrigger, Tooltip, Button,
} from 'react-bootstrap'

import { MaterialIcon } from 'views/components/etc/icon'

import {
  resourceDetailsSelector,
} from '../selectors'
import { PTyp } from '../ptyp'

const rNames = words('fuel ammo steel bauxite bucket')

const matIds = {
  fuel: 1, ammo: 2, steel: 3, bauxite: 4, bucket: 6,
}

class RBQMainImpl extends PureComponent {
  static propTypes = {
    resourceDetails: PTyp.object.isRequired,
  }

  render() {
    const {resourceDetails} = this.props
    return (
      <div style={{padding: 10}} >
        <link
          rel="stylesheet"
          href={join(__dirname, '..', 'assets', 'rbq.css')}
        />
        <Panel>
          {
            rNames.map(resourceName => {
              const recovInfo = resourceDetails[resourceName]
              const rowComponent = (
                <div
                  key={resourceName}
                  style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
                  <MaterialIcon
                    materialId={matIds[resourceName]}
                    className="material-icon"
                  />
                  <ProgressBar
                    label={
                      (
                        <div
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <div
                            className="range-hint"
                            style={{
                              flex: 1,
                              fontSize: '80%',
                            }}>
                            {recovInfo.min}
                          </div>
                          <div style={{
                            flex: 1,
                            fontWeight: "bold"}}>
                            {`${recovInfo.now} (${(recovInfo.rate*100).toFixed(2)}%)`}
                          </div>
                          <div
                            className="range-hint"
                            style={{
                              flex: 1,
                              fontSize: '80%',
                            }}>
                            {recovInfo.max}
                          </div>
                        </div>
                      )
                    }
                    style={{
                      position: 'relative',
                      margin: 'auto', marginLeft: 10, flex: 1, height: '2em'}}
                    min={0} max={1}
                    now={recovInfo.rate}
                  />
                  <Button
                    bsSize="small"
                    style={{marginLeft: 10}}
                  >
                    <FontAwesome name="edit" />
                  </Button>
                </div>
              )

              return recovInfo.neededAmount !== 0 ? (
                <OverlayTrigger
                  placement="bottom"
                  key={resourceName}
                  overlay={(
                    <Tooltip id={`plugin-chaos-resource-tooltip-${resourceName}`}>
                      {recovInfo.neededAmount}
                    </Tooltip>
                  )}
                >
                  {rowComponent}
                </OverlayTrigger>
              ) : rowComponent
            })
          }
        </Panel>
      </div>
    )
  }
}

const RBQMain = connect(
  createStructuredSelector({
    resourceDetails: resourceDetailsSelector,
  })
)(RBQMainImpl)

export { RBQMain }
