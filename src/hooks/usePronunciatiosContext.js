import { createContext, useState, useContext } from "react"

export const pronunciatiosContext = createContext()

export const PronunciatiosProvider = (props) => {
	const [pronunciatios, setPronunciatios] = useState({})

	return (
		<pronunciatiosContext.Provider value={{ pronunciatios, setPronunciatios }}>
			{props.children}
		</pronunciatiosContext.Provider>
	)
}

export const usePronunciatiosContext = () => {
	const context = useContext(pronunciatiosContext)
	return context
}
