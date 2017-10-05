import React, { PureComponent } from 'react'
import FontAwesome from 'react-fontawesome'
import {
  ProgressBar,
  OverlayTrigger, Tooltip, Button,
} from 'react-bootstrap'

import { MaterialIcon } from 'views/components/etc/icon'
import { PTyp } from '../../ptyp'

const matIds = {
  fuel: 1, ammo: 2, steel: 3, bauxite: 4, bucket: 6,
}

class ResourceBar extends PureComponent {
  static propTypes = {
    // fuel, ammo, etc.
    name: PTyp.string.isRequired,
    info: PTyp.object.isRequired,
  }

  render() {
    const {info, name} = this.props
    const rowComponent = (
      <div
        style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
        <MaterialIcon
          materialId={matIds[name]}
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
                  style={{
                    flex: 1,
                    fontSize: '80%',
                  }}>
                  {info.min}
                </div>
                <div style={{
                  flex: 1,
                  fontWeight: "bold"}}>
                  {`${info.now} (${(info.rate*100).toFixed(2)}%)`}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: '80%',
                  }}>
                  {info.max}
                </div>
              </div>
            )
          }
          style={{
            position: 'relative',
            margin: 'auto', marginLeft: 10, flex: 1, height: '2em'}}
          min={0} max={1}
          now={info.rate}
        />
        <Button
          bsSize="small"
          style={{marginLeft: 10}}
        >
          <FontAwesome name="edit" />
        </Button>
      </div>
    )
    return info.neededAmount !== 0 ? (
      <OverlayTrigger
        placement="bottom"
        key={name}
        overlay={(
          <Tooltip id={`plugin-chaos-resource-tooltip-${name}`}>
            {info.neededAmount}
          </Tooltip>
        )}
      >
        {rowComponent}
      </OverlayTrigger>
    ) : rowComponent
  }
}

export { ResourceBar }
