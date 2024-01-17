import React from "react"
import Game from "./game/game"
import { PronunciatioProvider } from "./game/pronunciatioContext"

function App() {
	return (
		<div className='App'>
			<PronunciatioProvider>
				<Game />
			</PronunciatioProvider>
		</div>
	)
}

export default App
