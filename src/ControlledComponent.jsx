import React, { Component } from "react"

// See https://reactjs.org/docs/forms.html#controlled-components
class ControlledComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.getDefaultValue(),
      errors: []
    }
  }

  isCheckbox = () => this.props.type === "checkbox"

  getDefaultValue = () => {
    if (this.isCheckbox()) {
      return this.props.checked === true
    }
    return this.props.value !== undefined ? this.props.value : ""
  }

  handleChange = (event) => {
    console.log("ControlledComponent.handleChange()")
    const { target } = event
    this.setState({
      value: this.isCheckbox() ? target.checked : target.value
    })
  }

  validate = () => {
    // console.log("ControlledComponent.validate()", this.props.name)
    const { value } = this.state
    const { label, validators } = this.props
    const errors = []
    let isValid = true

    if (validators === undefined) {
      // If a ControlledComponent doesn't have any validators we can assume it's valid
      return isValid
    }

    validators.forEach(({ func, msg }) => {
      if (func(value) !== true) {
        isValid = false
        errors.push(msg.replace("{{field}}", label))
      }
    })

    this.setState({ errors })
    return isValid
  }

  componentWillReceiveProps(nextProps) {
    /*
        This ensures that a ControlledComponent's `value` state is set to its `value` prop 
        if that prop was passed. For example, when a ControlledComponent is first mounted
        and its `value` prop is either blank or undefined its state will match 
        that. However, if a real `value` prop is then passed to the form, say
        from a parent component that just received data from an API it needs
        to display, the ControlledComponent will receive this new `value` prop and update
        its `value` state so that you see the value in the field.
        */
    // console.log("ControlledComponent.componentWillReceiveProps()", nextProps)
    if (this.props === nextProps) {
      return
    }

    if (nextProps.value !== undefined) {
      this.setState({ value: nextProps.value })
    }
  }

  renderErrors = (errors) => (
    <ul>{errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
  )

  render() {
    // console.log("ControlledComponent.render()", this.props)
    const { errors: stateErrors, value } = this.state
    const { errors: propErrors = [], label, name, type = "text" } = this.props
    const errors = stateErrors.concat(propErrors)

    // Uses the "props collection" pattern
    const controlledComponentProps = {
      onChange: this.handleChange
    }

    if (this.isCheckbox()) {
      controlledComponentProps.checked = value
    }

    return (
      <fieldset>
        <label htmlFor={name} className="form__label">
          {label}
        </label>
        {this.props.render(name, value, controlledComponentProps)}
        {this.renderErrors(errors)}
      </fieldset>
    )
  }
}

export default ControlledComponent
