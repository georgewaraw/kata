import { MeshWobbleMaterial, Text3D } from "@react-three/drei";

import VT323_Regular from "./assets/VT323_Regular.json";
/*
	content STRING
	height NUMBER
*/
export const Text = ({ content, height }) => (
	<Text3D
		font={ VT323_Regular }
		size={ 0.225 }
		height={ 0.1 }
		position={[ 0, height, -1 ]}
		onUpdate={ ({ geometry }) => geometry.center() }
	>
		{ content }
		<MeshWobbleMaterial
			factor={ 0.375 }
			color="yellow"
		/>
	</Text3D>
);
