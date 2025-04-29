import { FormResponse, User } from "../types/form";

const API_BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export const createUser = async (
  userData: User
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

export const getFormStructure = async (
  rollNumber: string
): Promise<FormResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/get-form?rollNumber=${encodeURIComponent(rollNumber)}`,
    {
      method: "GET",
      headers: {},
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};
