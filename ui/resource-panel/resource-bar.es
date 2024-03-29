import _ from 'lodash'
import React, { PureComponent } from 'react'
import { modifyObject, not, enumFromTo } from 'subtender'
import FontAwesome from 'react-fontawesome'
import {
  ProgressBar,
  OverlayTrigger, Tooltip,
  FormControl,
} from 'react-bootstrap'
import {
  Button,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core'
import { Popover } from 'views/components/etc/overlay'

import { MaterialIcon } from 'views/components/etc/icon'
import { PTyp } from '../../ptyp'
import { computeMin, resourceUpperBoundOf } from '../../misc'
import { __ } from '../../tr'

const matIds = {
  fuel: 1,
  ammo: 2,
  steel: 3,
  bauxite: 4,
  instantBuild: 5,
  bucket: 6,
  devMat: 7,
}

class ResourceBar extends PureComponent {
  static propTypes = {
    // fuel, ammo, etc.
    name: PTyp.string.isRequired,
    info: PTyp.object.isRequired,
    onChangeMinMax: PTyp.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      minText: '',
      maxText: '',
    }
  }

  handleToggleEdit = () =>
    this.setState(
      _.flow(
        modifyObject('editing',not),
        state => {
          const {editing} = state
          if (editing) {
            const {info: {min, max}} = this.props
            return {
              ...state,
              minText: String(min),
              maxText: String(max),
            }
          } else {
            return state
          }
        }
      )
    )

  handleChangeValue = which => e => {
    const text = e.target.value
    this.setState(modifyObject(which, () => text))
  }

  handleSaveEditing = (min,max) => () => {
    this.props.onChangeMinMax(min,max)
    this.setState({editing: false})
  }

  handleAdjustMin = percent => () => {
    const {info: {now}} = this.props
    const {maxText} = this.state
    const max = Number(maxText)
    if (!max)
      return
    const p = percent/100
    const minInt = computeMin(now,max,p)
    const minText = String(minInt)
    this.setState({minText})
  }

  renderViewer = () => {
    let {info} = this.props
    const {editing} = this.state
    return (
      <ProgressBar
        className="bg-hack"
        label={(
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}>
            <div
              className="pg-text"
              style={{
                flex: 2,
                fontSize: '.9em',
              }}>
              {info.min}
            </div>
            <div
              className="pg-text"
              style={{
                flex: 3,
                fontWeight: "bold",
              }}>
              {`${info.now} (${(info.rate*100).toFixed(2)}%)`}
            </div>
            <div
              className="pg-text"
              style={{
                flex: 2,
                fontSize: '.9em',
              }}>
              {info.max}
            </div>
          </div>
        )}
        style={{
          position: 'relative',
          margin: 'auto', marginLeft: 10, flex: 1, height: '2.2em',
          ...(editing ? {display: 'none'} : {}),
        }}
        key="viewer"
        min={0} max={1}
        now={info.rate}
      />
    )
  }

  renderEditor = () => {
    const {editing, minText, maxText} = this.state
    const {name} = this.props

    const [minVal, maxVal] = [minText,maxText].map(Number)
    const upBound = resourceUpperBoundOf(name)
    const maxValid =
      maxText && _.isInteger(maxVal) &&
      maxVal >= 0 && maxVal <= upBound
    const valid =
      minText && _.isInteger(minVal) &&
      minVal >= 0 && minVal <= upBound &&
      maxValid &&
      minVal < maxVal

    const menuContent = (
      <Menu>
        {
          enumFromTo(10,90,x => x+10).map(v => (
            <MenuItem
              key={v}
              text={`${v}%`}
              onClick={this.handleAdjustMin(v)}
            />
          ))
        }
      </Menu>
    )

    return (
      <div
        key="editor"
        style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 10,
          height: '2.2em',
          ...(editing ? {} : {display: 'none'}),
        }}
      >
        <Popover
          content={menuContent}
          position={Position.BOTTOM}
        >
          <Button
            disabled={!maxValid}
          >
            {__('AdjustMin')}
          </Button>
        </Popover>
        <FormControl
          type="text"
          placeholder={__('Min')}
          onChange={this.handleChangeValue('minText')}
          value={minText}
          style={{marginLeft: 10, flex: 1}}
        />
        <span style={{margin: '2px 8px'}}>~</span>
        <FormControl
          type="text"
          placeholder={__('Max')}
          onChange={this.handleChangeValue('maxText')}
          value={maxText}
          style={{flex: 1}}
        />
        <Button
          bsStyle={valid ? 'success' : 'danger'}
          onClick={valid ? this.handleSaveEditing(minVal,maxVal) : null}
          disabled={!valid}
          style={{marginLeft: 10, width: '3.6em', marginTop: 0}}
        >
          <FontAwesome name="save" />
        </Button>
      </div>
    )
  }

  render() {
    const {info, name} = this.props
    const {editing} = this.state
    const content = (
      <div
        style={{display: 'flex', alignItems: 'center', flex: 1}}>
        <MaterialIcon
          materialId={matIds[name]}
          className="material-icon"
        />
        {
          [
            this.renderViewer(),
            this.renderEditor(),
          ]
        }
      </div>
    )

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        {
          info.neededAmount !== 0 ? (
            <OverlayTrigger
              placement="top"
              key={name}
              overlay={(
                <Tooltip
                  className="rbq-pop"
                  id={`plugin-chaos-resource-tooltip-${name}`}>
                  {__('BarTooltip',info.now,info.neededAmount)}
                </Tooltip>
              )}
            >
              {content}
            </OverlayTrigger>
          ) : content
        }
        <Button
          onClick={this.handleToggleEdit}
          bsSize="small"
          style={{marginLeft: 10, width: '3.6em'}}
        >
          <FontAwesome
            name={editing ? 'undo' : 'edit'}
          />
        </Button>
      </div>
    )
  }
}

export { ResourceBar }
