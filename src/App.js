import React from "react"
import Game from "./game/game"
import { PronunciatiosProvider } from "./hooks/usePronunciatiosContext"
import { MovementsProvider } from "./hooks/useMovementsContext"

function App() {
	return (
		<div className='App'>
			<MovementsProvider>
				<PronunciatiosProvider>
					<Game />
				</PronunciatiosProvider>
			</MovementsProvider>
		</div>
	)
}

export default App
