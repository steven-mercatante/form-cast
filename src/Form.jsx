import React, { Component } from "react"
import PropTypes from "prop-types"
import { pluck } from "../utils"

class Form extends Component {
  static childContextTypes = {
    getFormState: PropTypes.func,
    validateForm: PropTypes.func
  }

  getChildContext = () => {
    return {
      getFormState: this.getFormState,
      validateForm: this.validateForm
    }
  }

  state = {
    fields: {},
    errors: [],
    fieldErrors: {},
    isValid: false
  }

  _childrenFormFieldRefs = {}

  getFormState = () => this.state

  handleSubmit = (event) => {
    console.log("Form.handleSubmit()")
    event.preventDefault()
    this.validateForm()
  }

  validateForm = () => {
    // TODO: think about setting state for this.state.isValid

    // Run FormField-level validators
    if (this.validateFormFields()) {
      /*
      At this point, FormFields are considered valid on an individual basis,
      so we store each FormField's name and value in the Form's state. This
      way the Form's parent components can access its field data.
      */
      const fieldData = {}
      Object.values(this._childrenFormFieldRefs).forEach((el) => {
        fieldData[el.props.name] = el.controlledComponent.state.value
      })

      // Run Form-level validators
      const fieldErrors = {}
      const { validators: formValidators = [] } = this.props
      formValidators.forEach((validator) => {
        const { fields: fieldNames, func, msg, displayOn } = validator
        const fieldValues = this.getFieldValues(fieldNames, fieldData)
        if (func(...fieldValues) !== true) {
          if (displayOn !== undefined) {
            if (fieldErrors[displayOn] === undefined) {
              fieldErrors[displayOn] = []
            }
            fieldErrors[displayOn].push(msg)
          }
        }
      })

      this.setState({ fieldErrors })

      /*
      If _all_ validators (FormField and Form) pass, update the Form's state
      and call its `onSubmit` callback prop.
      */
      this.setState({ fields: fieldData }, () =>
        this.props.onSubmit(this.state.fields)
      )
    }
  }

  getFieldValues = (fieldNames, fieldData) => {
    console.log(this.state)
    return fieldNames.map((fieldName) => fieldData[fieldName])
  }

  validateFormFields = () => {
    // console.log("Form.validateFormFields()")
    let allAreValid = true

    Object.values(this._childrenFormFieldRefs).forEach((el) => {
      if (el.controlledComponent.validate() !== true) {
        allAreValid = false
      }
    })

    return allAreValid
  }

  getFieldErrors = (field) => {
    try {
      return this.state.fieldErrors[field]
    } catch (error) {
      return []
    }
  }

  registerChildFormField = (name, el) => {
    // console.log("Form.registerChildFormField()")
    this._childrenFormFieldRefs[name] = el
  }

  storeFieldError = (field, error) => {}

  render() {
    // console.log("Form.render()", this.state.fields)
    const { children } = this.props
    const formProps = pluck(this.props, ["className"])

    const childrenWithProps = React.Children.map(children, (child) => {
      // TODO: come up w/ a better way to recognize FormField children (add a helper func isFormField(component))
      const childFieldName = child.props.name
      if (childFieldName !== undefined) {
        const newProps = {
          ref: (el) => this.registerChildFormField(childFieldName, el),
          errors: this.getFieldErrors(childFieldName),
          ...child.props
        }

        /* 
        If the Form has a value for this FormField, pass it to the FormField via props.  
        Otherwise, FormField will use the value prop that was explicitly passed to it.
        */
        const fieldValue = this.state.fields[childFieldName]
        if (fieldValue !== undefined) {
          newProps.value = fieldValue
        }

        return React.cloneElement(child, newProps)
      } else {
        return child
      }
      //   return child
    })

    // TODO: just pluck props that you know could/should be attached to a form tag (like className, but not onSubmit or other handlers)
    return (
      <form {...formProps} onSubmit={this.handleSubmit}>
        {childrenWithProps}
      </form>
    )
  }
}

export default Form
