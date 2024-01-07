import axios, { apiBaseURL } from "./axios"

const simulationsApiBaseURL = `${apiBaseURL}/simulations`

export default class SimulationsApi {
	static move() {
		return axios.get(`${simulationsApiBaseURL}/simulation/move`)
	}
}
