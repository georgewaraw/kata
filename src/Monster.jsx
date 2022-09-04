import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PositionalAudio, useFBX } from "@react-three/drei";
import { AnimationMixer, Color } from "three";

import monster_run from "./assets/monster_run.fbx";
import monster_roar from "./assets/monster_roar.mp3";

export function Monster() {

	const monster = useFBX( monster_run );
	const [ mixer ] = useState( new AnimationMixer(monster) );
	const [ animation ] = useState( mixer.clipAction(monster.animations[0]) );

	useEffect( function () {

		monster.name = "monster";

		for( const child of monster.children ) {

			if( child.isSkinnedMesh ) {

				child.castShadow = true;

				child.material.color = new Color( "yellow" );
			}
		}

		animation.play();
	}, [animation, monster] );

	useFrame( (_, delta) => mixer.update(delta) );

	return (
		<primitive
			object={ monster }
			position-z={ -30 }
		>
			<PositionalAudio
				url={ monster_roar }
				distanceModel="exponential"
				rolloffFactor={ 5 }
				autoplay
			/>
		</primitive>
	);

}
