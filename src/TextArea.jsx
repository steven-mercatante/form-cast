import React, { Component } from "react"
import ControlledComponent from "./ControlledComponent"
import { pluck } from "../utils"

// TODO: figure out PropTypes. `name` should be required.

class TextArea extends Component {
  static controlledComponent

  render() {
    const { label, type, validators, value } = this.props
    const inputProps = pluck(this.props, ["className", "rows"])

    return (
      <ControlledComponent
        label={label}
        validators={validators}
        value={value}
        ref={(el) => (this.controlledComponent = el)}
        render={(name, value, controlledComponentProps) => (
          <textarea
            id={name}
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

export default TextArea
