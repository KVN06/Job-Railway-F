import { apiFetch } from './http.js';

export function listTrainings(params = {}) {
  return apiFetch('/training', { query: params });
}

export function getTraining(id) {
  return apiFetch(`/training/${id}`);
}

export function updateTraining(id, payload){
  return apiFetch(`/training/${id}`, { method: 'PUT', body: payload });
}

export function createTraining(payload){
  return apiFetch('/training', { method: 'POST', body: payload });
}
