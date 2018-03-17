import React, { Component } from "react"
import ControlledComponent from "./ControlledComponent"
import { pluck } from "../utils"

// TODO: figure out PropTypes. `name` should be required.

class Select extends Component {
  static controlledComponent

  render() {
    // console.log("Select.render()", this.props)
    const { label, validators, value } = this.props
    const inputProps = pluck(this.props, ["className"])

    return (
      <ControlledComponent
        label={label}
        validators={validators}
        value={value}
        ref={(el) => (this.controlledComponent = el)}
        render={(name, value, controlledComponentProps) => (
          <select
            id={name}
            name={name}
            value={value}
            {...controlledComponentProps}
            {...inputProps}
          >
            {this.props.children}
          </select>
        )}
      />
    )
  }
}

export default Select
