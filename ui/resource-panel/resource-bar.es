import _ from 'lodash'
import React, { PureComponent } from 'react'
import { modifyObject, not, enumFromTo } from 'subtender'
import FontAwesome from 'react-fontawesome'
import {
  ProgressBar,
  OverlayTrigger, Tooltip, Button,
  DropdownButton, MenuItem,
  FormControl,
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

  handleAdjustMin = percent => {
    const {info: {now}} = this.props
    const {maxText} = this.state
    const max = Number(maxText)
    if (!max)
      return
    const p = percent/100
    const min = (now - p*max)/(1-p)
    const minText = String(Math.floor(min))
    this.setState({minText})
  }

  renderViewer = () => {
    const {info} = this.props
    const {editing} = this.state
    return (
      <ProgressBar
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
    const upBound = name === 'bucket' ? 3000 : 300000
    const maxValid =
      maxText && _.isInteger(maxVal) &&
      maxVal >= 0 && maxVal <= upBound
    const valid =
      minText && _.isInteger(minVal) &&
      minVal >= 0 && minVal <= upBound &&
      maxValid &&
      minVal < maxVal

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
        <DropdownButton
          disabled={!maxValid}
          onSelect={this.handleAdjustMin}
          id={`poi-plugin-rbq-adjust-min-${name}`}
          title="Adjust Min"
        >
          {
            enumFromTo(10,90,x => x+10).map(v => (
              <MenuItem key={v} eventKey={v}>
                {`${v}%`}
              </MenuItem>
            ))
          }
        </DropdownButton>
        <FormControl
          type="text"
          placeholder="Min"
          onChange={this.handleChangeValue('minText')}
          value={minText}
          style={{marginLeft: 10, flex: 1}}
        />
        <span style={{margin: '2px 8px'}}>~</span>
        <FormControl
          type="text"
          placeholder="Max"
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
              placement="bottom"
              key={name}
              overlay={(
                <Tooltip id={`plugin-chaos-resource-tooltip-${name}`}>
                  {info.neededAmount}
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
