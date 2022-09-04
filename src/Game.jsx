import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BasicShadowMap } from "three";
import { Postprocessing } from "./Postprocessing.jsx";
import { Floor } from "./Floor.jsx";
import { Monster } from "./Monster.jsx";
import { Player } from "./Player.jsx";

export function Game() {

	const [ playing, setPlaying ] = useState( false );

	useEffect( () => window.addEventListener(
		"pointerdown",
		() => setPlaying( true ),
		{ once: true }
	), [] );

	return (
		<Canvas
			dpr={ 0.3 }
			gl={{ antialias: false }}
			shadows={{ type: BasicShadowMap }}
		>
			<Postprocessing />
			<ambientLight args={[ "magenta", 0.025 ]} />
			<Floor
				size={ 10000 }
				repeat={ 3 }
				wobble={ 0.01 }
			/>
			{ playing && <Monster /> }
			<Player playing={ playing } />
		</Canvas>
	);

}
