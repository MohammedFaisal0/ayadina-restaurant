export const DATA_STORAGE_KEY = "ayadina-app-data";
export const DATA_CHANGE_EVENT = "ayadina-data-change";
export const AUTH_STORAGE_KEY = "ayadina-admin-token";
export const AUTH_CHANGE_EVENT = "ayadina-auth-change";

export function emitDataChange() {
  window.dispatchEvent(new Event(DATA_CHANGE_EVENT));
}

export function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
