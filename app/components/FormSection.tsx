import React from "react";
import {
  FormSection as FormSectionType,
  FormData,
  FormErrors,
} from "../types/form";
import FormField from "./FormField";
interface FormSectionProps {
  section: FormSectionType;
  formData: FormData;
  errors: FormErrors;

  onFieldChange: (fieldId: string, value: string | boolean) => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  formData,
  errors,
  onFieldChange,
}) => {
  return (
    <div className="form-section">
      <h2>{section.title}</h2>
      <p>{section.description}</p>
      {section.fields.map((field) => (
        <FormField
          key={field.fieldId}
          field={field}
          value={formData[field.fieldId]}
          error={errors[field.fieldId]}
          onChange={onFieldChange}
        />
      ))}
    </div>
  );
};

export default FormSection;
