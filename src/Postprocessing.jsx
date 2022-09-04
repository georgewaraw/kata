import { ChromaticAberration, DepthOfField, EffectComposer, Noise, Scanline } from "@react-three/postprocessing";

const OFFSET = 0.002;

export const Postprocessing = () => (
	<EffectComposer>
		<Scanline
			density={ 2 }
			opacity={ 100 }
		/>
		<ChromaticAberration offset={[ OFFSET, OFFSET ]} />
		<Noise opacity={ 100 } />
		<DepthOfField
			bokehScale={ 10 }
			focalLength={ 1 }
		/>
	</EffectComposer>
);
