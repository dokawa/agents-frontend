import axios, { apiBaseURL } from "./axios"

const simulationsApiBaseURL = `${apiBaseURL}/simulations`

export default class SimulationsApi {
	static step(simulationId) {
		return axios.get(`${simulationsApiBaseURL}/simulation/${simulationId}/step`)
	}

	static resetCount(simulationId) {
		return axios.get(`${simulationsApiBaseURL}/simulation/${simulationId}/reset_count`)
	}
}
