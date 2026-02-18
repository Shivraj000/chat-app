const BASE_URL = "/api"; // Vite proxy will handle this

async function fetchApi(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // For 204 No Content, response.json() will fail.
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export const signupUser = (userData) => {
  // userData: { fullName, username, password, confirmPassword, gender }
  // Now expects confirmPassword to be part of userData
  return fetchApi(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (credentials) => {
  // credentials: { username, password }
  return fetchApi(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
};

export const logoutUser = () => {
  return fetchApi(`${BASE_URL}/auth/logout`, {
    method: "POST",
  });
};

export const getUsers = () => {
  return fetchApi(`${BASE_URL}/users`);
};

export const getMessages = (userId) => {
  // userId is the ID of the other user in the conversation
  return fetchApi(`${BASE_URL}/messages/${userId}`);
};

export const sendMessage = (userId, message) => {
  // userId is the receiver's ID
  // message: { message: "text" }
  return fetchApi(`${BASE_URL}/messages/send/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
};
