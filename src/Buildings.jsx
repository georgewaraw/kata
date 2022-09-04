import { Billboard, MeshWobbleMaterial, useTexture } from "@react-three/drei";
import { NearestFilter, RepeatWrapping } from "three";

import window from "./assets/window.jpg";

const WIDTH = 17.5;
const HEIGHT = 20;
/*
	height NUMBER
*/
export function Buildings({ height }) {

	const geometry = <boxGeometry args={[ WIDTH, HEIGHT, WIDTH ]} />;
	const material = (
		<MeshWobbleMaterial
			factor={ 0.5 }
			speed={ 0.5 }
		>
			<primitive
				attach="map"
				object={ useTexture(window) }
				magFilter={ NearestFilter }
				minFilter={ NearestFilter }
				wrapS={ RepeatWrapping }
				wrapT={ RepeatWrapping }
				repeat={ 2 }
			/>
		</MeshWobbleMaterial>
	);

	return (
		<Billboard position-y={ -height }>
			<mesh position={[ -15, HEIGHT/2, -60 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ 15, HEIGHT/2, -50 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ -25, HEIGHT/2, -30 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ 25, HEIGHT/2, -20 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ -35, HEIGHT/2, -10 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ 35, HEIGHT/2, 0 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ -25, HEIGHT/2, 10 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ 25, HEIGHT/2, 20 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ -15, HEIGHT/2, 30 ]}>
				{ geometry }
				{ material }
			</mesh>
			<mesh position={[ 15, HEIGHT/2, 40 ]}>
				{ geometry }
				{ material }
			</mesh>
		</Billboard>
	);

}
