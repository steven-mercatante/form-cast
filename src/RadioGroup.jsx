import React, { Component } from "react"
import PropTypes from "prop-types"

import ControlledComponent from "./ControlledComponent"
import { pluck } from "../utils"

// TODO: figure out PropTypes. `name` should be required.

class RadioGroup extends Component {
  static childContextTypes = {
    radioGroup: PropTypes.object
  }

  getChildContext = () => {
    const { name, selected, onChange } = this.props

    return {
      radioGroup: { name, selected, onChange }
    }
  }

  static controlledComponent

  render() {
    // console.log("RadioGroup.render()", this.props)
    const { label, validators, value } = this.props
    const inputProps = pluck(this.props, ["className"])

    return (
      <ControlledComponent
        label={label}
        validators={validators}
        value={value}
        ref={(el) => (this.controlledComponent = el)}
        render={(name, value, controlledComponentProps) => (
          <div
            id={name}
            name={name}
            value={value}
            {...controlledComponentProps}
            {...inputProps}
          >
            {this.props.children}
          </div>
        )}
      />
    )
  }
}

export default RadioGroup
