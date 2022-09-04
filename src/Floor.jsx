import { MeshWobbleMaterial, useTexture } from "@react-three/drei";
import { NearestFilter, RepeatWrapping } from "three";

import floor from "./assets/floor.jpg";
/*
	size NUMBER
	repeat NUMBER
	wobble NUMBER
*/
export const Floor = ({ size, repeat, wobble }) => (
	<mesh
		receiveShadow
		rotation-x={ 270 * Math.PI / 180 }
	>
		<planeGeometry args={[ size, size ]} />
		<MeshWobbleMaterial
			factor={ wobble / size }
			speed={ 2 }
		>
			<primitive
				attach="map"
				object={ useTexture(floor) }
				magFilter={ NearestFilter }
				minFilter={ NearestFilter }
				wrapS={ RepeatWrapping }
				wrapT={ RepeatWrapping }
				repeat={ size / repeat }
			/>
		</MeshWobbleMaterial>
	</mesh>
);
