import React, { Component } from "react"
import PropTypes from "prop-types"

class Radio extends Component {
  static contextTypes = {
    radioGroup: PropTypes.object
  }

  render() {
    const { name, selected, onChange } = this.context.radioGroup
    const { value } = this.props
    const options = {}
    if (selected !== undefined) {
      options.checked = value === selected
    }

    return (
      <input
        {...this.props}
        type="radio"
        name={name}
        onChange={onChange}
        {...options}
      />
    )
  }
}

export default Radio
