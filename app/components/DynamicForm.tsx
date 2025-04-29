"use client";

import React, { useState, useEffect } from "react";
import { User, FormStructure, FormData, FormErrors } from "../types/form";
import { getFormStructure } from "../api";
import { validateSection } from "../utils/validation";
import FormSection from "./FormSection";
import Navigation from "./Navigation";

interface DynamicFormProps {
  user: User;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ user }) => {
  const [formStructure, setFormStructure] = useState<FormStructure | null>(
    null
  );
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchForm = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await getFormStructure(user.rollNumber);
        setFormStructure(response.form);
        const initialData: FormData = {};
        response.form.sections.forEach((section) => {
          section.fields.forEach((field) => {
            initialData[field.fieldId] = field.type === "checkbox" ? false : "";
          });
        });
        setFormData(initialData);
      } catch (error) {
        console.error("Failed to fetch form structure:", error);
        setApiError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [user.rollNumber]);

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return <div>Loading form structure...</div>;
  }

  if (apiError) {
    return <div className="error-message">Error loading form: {apiError}</div>;
  }

  if (!formStructure) {
    return <div>Form data not available.</div>;
  }

  const currentSection = formStructure.sections[currentSectionIndex];

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
    if (errors[fieldId]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const goToSection = (index: number) => {
    if (formStructure && index >= 0 && index < formStructure.sections.length) {
      setErrors({});
      setCurrentSectionIndex(index);
    }
  };

  const handleNext = () => {
    if (!formStructure) return;
    const currentSection = formStructure.sections[currentSectionIndex];
    const { isValid, errors: sectionErrors } = validateSection(
      currentSection.fields,
      formData
    );
    setErrors(sectionErrors);
    if (isValid) {
      goToSection(currentSectionIndex + 1);
    } else {
      console.log("Section invalid:", sectionErrors);
    }
  };

  const handlePrev = () => {
    goToSection(currentSectionIndex - 1);
  };

  const handleSubmit = () => {
    if (!formStructure || isSubmitting) return;
    const lastSection = formStructure.sections[currentSectionIndex];
    const { isValid, errors: sectionErrors } = validateSection(
      lastSection.fields,
      formData
    );
    setErrors(sectionErrors);
    if (isValid) {
      setIsSubmitting(true);
      console.log("Form Submitted Successfully!");
      console.log("Collected Form Data:", formData);
      alert("Form submitted successfully! Check the console for data.");
      setIsSubmitting(false);
    } else {
      console.log("Final section invalid:", sectionErrors);
    }
  };

  return (
    <div className="dynamic-form-container">
      <h1>{formStructure.formTitle}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <FormSection
          section={currentSection}
          formData={formData}
          errors={errors}
          onFieldChange={handleFieldChange}
        />
        <Navigation
          currentSectionIndex={currentSectionIndex}
          totalSections={formStructure.sections.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </form>
      <p style={{ marginTop: "20px", fontSize: "0.9em", color: "#555" }}>
        Section {currentSectionIndex + 1} of {formStructure.sections.length}
      </p>
    </div>
  );
};

export default DynamicForm;
