import { createContext, useState, useContext } from "react"

export const movementsContext = createContext()

export const MovementsProvider = (props) => {
	const [movements, setMovements] = useState({})

	console.log("movements", movements)

	return (
		<movementsContext.Provider value={{ movements, setMovements }}>
			{props.children}
		</movementsContext.Provider>
	)
}

export const useMovementsContext = () => {
	const context = useContext(movementsContext)
	return context
}
