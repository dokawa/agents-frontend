import axios from "axios"
import humps from "humps"

export const apiBaseURL = process.env.REACT_APP_API_BASE_URL

const instance = axios.create()
instance.defaults.headers.post["Content-Type"] = "application/json"
instance.defaults.headers.patch["Content-Type"] = "application/json"
instance.defaults.headers.delete["Content-Type"] = "application/json"

instance.interceptors.response.use((response) => {
	if (response.data && response.headers["content-type"] === "application/json") {
		return humps.camelizeKeys(response.data)
	}
	return response.data
})

export default instance
