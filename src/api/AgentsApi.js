import { createQuery } from "utils/ApiUtils"
import axios, { apiBaseURL } from "./axios"

const usersApiBaseURL = `${apiBaseURL}/agents`

export default class AgentsApi {
	static list() {
		return axios.get(`${usersApiBaseURL}/agents`, {
			params: { query: createQuery(...query), page, page_size: pageSize },
		})
	}
}
