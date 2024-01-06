import { useQuery } from "react-query"
import SimulationsApi from "../api/SimulationsApi"

export const useSimulations = () => {
	const { isLoading, data: movements } = useQuery(["simulations"], () =>
		SimulationsApi.list(query, page, pageSize),
	)

	return {
		movements,
		isLoading,
	}
}
