import AgentsApi from "api/AgentsApi"
import { useQuery } from "react-query"

export const useAgents = () => {
	const { isLoading, data: users } = useQuery(["agents"], () =>
		AgentsApi.list(query, page, pageSize),
	)

	return {
		users,
		isLoading,
	}
}
