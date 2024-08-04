export const HOST = import.meta.env.VITE_BACKEND_URL
export const AUTH_ROUTE = "api/auth"
export const CONTACT_ROUTE = 'api/contact'
export const MESSAGE_ROUTE = 'api/message'
export const CHANNEL_ROUTE = 'api/channel'

//Auth
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTE}/add-profile-image`
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTE}/remove-profile-image`

//Contact
export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTE}/search`
export const GET_DM_CONTACT_ROUTE = `${CONTACT_ROUTE}/get-contact-for-dm`
export const GET_ALL_CONTACT_ROUTE = `${CONTACT_ROUTE}/get-all-contact`

//Message
export const GET_ALL_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/get-messages`
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTE}/upload-file`

//Channel
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`
export const GET_USER_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/get-user-channel`
export const GET_MESSAGE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/get-message-channel`