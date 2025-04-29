import React from "react";

interface NavigationProps {
  currentSectionIndex: number;
  totalSections: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  currentSectionIndex,
  totalSections,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting = false,
}) => {
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === totalSections - 1;

  return (
    <div className="navigation-buttons">
      {!isFirstSection && (
        <button type="button" onClick={onPrev} disabled={isSubmitting}>
          Previous
        </button>
      )}
      {!isLastSection && (
        <button type="button" onClick={onNext} disabled={isSubmitting}>
          Next
        </button>
      )}
      {isLastSection && (
        <button type="button" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
};

export default Navigation;
