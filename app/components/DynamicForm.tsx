// app/components/DynamicForm.tsx
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
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Add state to track if the component has mounted ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted on the client
    setIsMounted(true);

    const fetchForm = async () => {
      // Keep setIsLoading(true) here to handle potential re-fetches if needed
      // but the initial loading state is handled by isMounted now.
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
  }, [user.rollNumber]); // Dependency array

  // --- Updated Rendering Logic ---

  // 1. On the server, AND on the client before mount, render nothing or a basic placeholder
  //    This ensures the initial server/client HTML matches (often by rendering nothing complex).
  if (!isMounted) {
    // Render null or a very simple placeholder that matches what the server would render
    // *before* any client-side logic runs. Null is often safest.
    return null;
    // Or return <div>Loading...</div>; if that's acceptable and simple.
  }

  // 2. After mounting on the client, handle loading/error states
  if (isLoading) {
    return <div>Loading form structure...</div>;
  }

  if (apiError) {
    return <div className="error-message">Error loading form: {apiError}</div>;
  }

  // 3. Handle the case where loading finished but the structure is still missing
  if (!formStructure) {
    // This might happen if the API returns success but an empty form, or edge cases.
    return <div>Form data not available.</div>;
  }

  // 4. Only render the full form when mounted, not loading, no errors, and structure exists
  const currentSection = formStructure.sections[currentSectionIndex];

  // Rest of the component logic (handlers) remain the same...
  const handleFieldChange = (fieldId: string, value: any) => {
    // ... (implementation unchanged)
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
    // ... (implementation unchanged)
    if (formStructure && index >= 0 && index < formStructure.sections.length) {
      setErrors({});
      setCurrentSectionIndex(index);
    }
  };

  const handleNext = () => {
    // ... (implementation unchanged)
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
    // ... (implementation unchanged)
    goToSection(currentSectionIndex - 1);
  };

  const handleSubmit = () => {
    // ... (implementation unchanged)
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
