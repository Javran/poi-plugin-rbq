import { enumFromTo } from 'subtender'
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

class QuickPanelImpl extends PureComponent {
  static propTypes = {
    resources: PTyp.object.isRequired,
    modify: PTyp.func.isRequired,
  }

  handleAdjustAll = percent => {
    const {modify, resources} = this.props
    console.log(modify, resources)
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
