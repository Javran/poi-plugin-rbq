import { enumFromTo } from 'subtender'
import React, { PureComponent } from 'react'
import {
  Panel,
  DropdownButton, MenuItem,
} from 'react-bootstrap'

class QuickPanel extends PureComponent {
  handleAdjustAll = p =>
    console.log(p)

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

export { QuickPanel }
