import api from "./axios";

// Create complaint
export const createComplaint = (data) =>
  api.post("/complaints", data);

// My complaints
export const getMyComplaints = () =>
  api.get("/complaints/mine");

// All complaints (admin)
export const getAllComplaints = () =>
  api.get("/complaints");

// Get by ID
export const getComplaintById = (id) =>
  api.get(`/complaints/${id}`);

// Respond (admin)
export const respondComplaint = (id, data) =>
  api.put(`/complaints/${id}`, data);

// Stats
export const getComplaintStats = () =>
  api.get("/complaints/stats");