export const requiredValidator = {
  func: (val) => val.trim("") !== "",
  msg: "{{field}} is required."
}

export const minLengthValidator = {
  func: (val) => val.length >= 3,
  msg: "{{field}}'s value is too short."
}

export const fieldsAreSameValidator = {
  fields: ["password", "passwordAgain"],
  func: (val1, val2) => val1 === val2,
  msg: "{{field1}} and {{field2}} must be the same",
  displayOn: "passwordAgain" // TODO: this could be an array if you wanted to display it on multiple fields
}
