import api from "./axios";


export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};


export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};


export const logoutUser = () => {
  localStorage.removeItem("user");
};
