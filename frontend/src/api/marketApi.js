import api from "./axios";

// Get prices
export const getMarketPrices = (params) =>
  api.get("/market", { params });

// States dropdown
export const getStates = () =>
  api.get("/market/states");

// Crops dropdown
export const getCrops = () =>
  api.get("/market/crops");

// Add price (admin)
export const addMarketPrice = (data) =>
  api.post("/market", data);

// Delete
export const deleteMarketPrice = (id) =>
  api.delete(`/market/${id}`);

// Sync
export const triggerSync = () =>
  api.post("/market/sync");