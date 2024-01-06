import axios, { apiBaseURL } from "./axios"

// const simulationsApiBaseURL = `${apiBaseURL}/simulations`
const simulationsApiBaseURL = "http://localhost:8000/simulations"

export default class SimulationsApi {
	static move() {
		return axios.get(`${simulationsApiBaseURL}/simulation/move`)
	}
}
