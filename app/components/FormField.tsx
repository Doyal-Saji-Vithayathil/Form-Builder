import React from "react";

import { FormField as FormFieldType, FormData } from "../types/form";

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  error: string | undefined;
  onChange: (fieldId: string, value: any) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const {
    fieldId,
    type,
    label,
    placeholder,
    required,
    options,
    dataTestId,
    minLength,
    maxLength,
  } = field;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onChange(fieldId, e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(fieldId, e.target.checked);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(fieldId, e.target.value);
  };

  const renderField = () => {
    switch (type) {
      case "text":
      case "email":
      case "tel":
      case "date":
        return (
          <input
            type={type}
            id={fieldId}
            name={fieldId}
            value={value || ""}
            placeholder={placeholder}
            onChange={handleInputChange}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            data-testid={dataTestId}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            aria-invalid={!!error}
            className={error ? "input-error" : ""}
          />
        );
      case "textarea":
        return (
          <textarea
            id={fieldId}
            name={fieldId}
            value={value || ""}
            placeholder={placeholder}
            onChange={handleInputChange}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            data-testid={dataTestId}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            aria-invalid={!!error}
            className={error ? "input-error" : ""}
          />
        );
      case "dropdown":
        return (
          <select
            id={fieldId}
            name={fieldId}
            value={value || ""}
            onChange={handleInputChange}
            required={required}
            data-testid={dataTestId}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            aria-invalid={!!error}
            className={error ? "input-error" : ""}
          >
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
            {options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div
            role="radiogroup"
            aria-labelledby={`${fieldId}-label`}
            data-testid={dataTestId}
          >
            {options?.map((option) => (
              <label
                key={option.value}
                style={{ marginRight: "15px", display: "inline-block" }}
              >
                <input
                  type="radio"
                  name={fieldId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleRadioChange}
                  required={required}
                  data-testid={option.dataTestId}
                  aria-describedby={error ? `${fieldId}-error` : undefined}
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <label>
            <input
              type="checkbox"
              id={fieldId}
              name={fieldId}
              checked={!!value}
              onChange={handleCheckboxChange}
              required={required}
              data-testid={dataTestId}
              aria-describedby={error ? `${fieldId}-error` : undefined}
              aria-invalid={!!error}
            />
            {label}
          </label>
        );
      default:
        return <p>Unsupported field type: {type}</p>;
    }
  };

  return (
    <div className="form-field">
      {type !== "checkbox" && (
        <label htmlFor={fieldId} id={`${fieldId}-label`}>
          {label}
          {required ? " *" : ""}
        </label>
      )}
      {renderField()}
      {error && (
        <p id={`${fieldId}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
