import axios, { apiBaseURL } from "./axios"

const simulationsApiBaseURL = `${apiBaseURL}/simulations`

export default class SimulationsApi {
	static move(simulationId) {
		return axios.get(`${simulationsApiBaseURL}/simulation/${simulationId}/step`)
	}
}
