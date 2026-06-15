import api from "./axios";


export const createComplaint = (data) =>
  api.post("/complaints", data);


export const getMyComplaints = () =>
  api.get("/complaints/mine");


export const getAllComplaints = () =>
  api.get("/complaints");


export const getComplaintById = (id) =>
  api.get(`/complaints/${id}`);


export const respondComplaint = (id, data) =>
  api.put(`/complaints/${id}`, data);


export const getComplaintStats = () =>
  api.get("/complaints/stats");
