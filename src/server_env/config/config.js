// export const API_URL = `${window.location.protocol}//${window.location.hostname}:5000`
// export const API_URL = `http://46.41.151.18:5000`
export const API_URL = `${window.location.protocol}//${window.location.hostname}:3000`

export const LOCAL_CLOUD = `${API_URL}/images/${localStorage.getItem('clientId')}`
export const CONSOLE_CLOUD = `${API_URL}/images/console`
