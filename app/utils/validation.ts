import { FormField, FormData, FormErrors } from "../types/form";

type FormDataValue = FormData[keyof FormData] | undefined | null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEL_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export const validateField = (
  field: FormField,
  value: FormDataValue
): string | null => {
  const stringValue = typeof value === "string" ? value.trim() : "";

  const arrayValue = Array.isArray(value) ? value : [];
  const booleanValue = typeof value === "boolean" ? value : false;

  if (field.required) {
    let isEmpty = false;
    switch (field.type) {
      case "checkbox":
        isEmpty = !booleanValue;
        break;
      case "radio":
      case "dropdown":
        isEmpty = !stringValue;
        break;

      default:
        isEmpty = !stringValue;
        break;
    }

    if (isEmpty) {
      return field.validation?.message || `${field.label} is required.`;
    }
  }

  if (
    !field.required &&
    !stringValue &&
    arrayValue.length === 0 &&
    !booleanValue
  ) {
    return null;
  }

  if (stringValue) {
    if (field.minLength && stringValue.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters long.`;
    }
    if (field.maxLength && stringValue.length > field.maxLength) {
      return `${field.label} must be no more than ${field.maxLength} characters long.`;
    }
    if (field.type === "email" && !EMAIL_REGEX.test(stringValue)) {
      return `Please enter a valid email address for ${field.label}.`;
    }
    if (field.type === "tel" && !TEL_REGEX.test(stringValue)) {
      return `Please enter a valid phone number for ${field.label}.`;
    }
  }

  return null;
};

export const validateSection = (
  fields: FormField[],
  formData: FormData
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  let isValid = true;

  fields.forEach((field) => {
    const error = validateField(field, formData[field.fieldId]);
    if (error) {
      errors[field.fieldId] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
