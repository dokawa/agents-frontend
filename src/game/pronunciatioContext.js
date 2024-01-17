import { createContext, useState, useContext } from "react"

export const pronunciatioContext = createContext()

export const PronunciatioProvider = (props) => {
	const [pronunciatios, setPronunciatios] = useState({})

	return (
		<pronunciatioContext.Provider value={{ pronunciatios, setPronunciatios }}>
			{props.children}
		</pronunciatioContext.Provider>
	)
}

export const usePronunciatioContext = () => {
	const context = useContext(pronunciatioContext)
	return context
}
