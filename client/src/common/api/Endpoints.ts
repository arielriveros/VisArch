export const API_ENDPOINT = (): string => {
    return process.env.NODE_ENV === 'production' ? 'api' : `${process.env.REACT_APP_API_URL}`
};
export const SOCKET_ENDPOINT = (): string => {
    return process.env.NODE_ENV === 'production' ? '' : `${process.env.REACT_APP_SOCKET_URL}` || ''
};