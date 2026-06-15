import api from "./axios";


export const getMarketPrices = (params) =>
  api.get("/market", { params });

export const getStates = () =>
  api.get("/market/states");

export const getCrops = () =>
  api.get("/market/crops");

export const addMarketPrice = (data) =>
  api.post("/market", data);

export const deleteMarketPrice = (id) =>
  api.delete(`/market/${id}`);

export const triggerSync = () =>
  api.post("/market/sync");
