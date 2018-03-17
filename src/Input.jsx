import React, { Component } from "react"
import ControlledComponent from "./ControlledComponent"
import { pluck } from "../utils"

// TODO: figure out PropTypes. `name` should be required.
// TODO: maybe throw a warning if type is checkbox and value is passed?? depends on the value

class Input extends Component {
  static controlledComponent

  render() {
    // console.log("Input.render()", this.props)
    const { checked, label, name, type, validators, value } = this.props
    const inputProps = pluck(this.props, ["className"])

    // TODO: can these pass-thru be cleaned up or refactored?
    return (
      <ControlledComponent
        checked={checked}
        label={label}
        name={name}
        validators={validators}
        type={type}
        value={value}
        ref={(el) => (this.controlledComponent = el)}
        render={(name, value, controlledComponentProps) => (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            {...controlledComponentProps}
            {...inputProps}
          />
        )}
      />
    )
  }
}

export default Input
