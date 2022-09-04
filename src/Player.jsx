import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PositionalAudio, useFBX } from "@react-three/drei";
import { AnimationMixer, Color, Vector3 } from "three";
import { Text } from "./Text.jsx";
import { Buildings } from "./Buildings.jsx";

import girl_idle from "./assets/girl_idle.fbx";
import girl_run from "./assets/girl_run.fbx";
import girl_attack from "./assets/girl_attack.fbx";
import music from "./assets/music.mp3";
import girl_lunge from "./assets/girl_lunge.mp3";
import monster_grunt from "./assets/monster_grunt.mp3";

const DISTANCE = { X: 10, Z: 30 };
const DURATION = [ 0.25, 1 ];
const HEIGHT = 2.5;
const SCALE = 0.02;
const SPEED = 3;
const THRESHOLD = 0.2;

export function Player({ playing }) {

	const { camera, mouse, scene } = useThree();
	const [ vector ] = useState( new Vector3() );
	const girl = useFBX( girl_idle );

	const [ mixer ] = useState( new AnimationMixer(girl) );
	const [ clip ] = useState({
		idle: girl.animations[ 0 ],
		run: useFBX( girl_run ).animations[ 0 ],
		attack: useFBX( girl_attack ).animations[ 0 ]
	});
	const [ animation ] = useState({
		idle: mixer.clipAction( clip.idle ),
		run: mixer.clipAction( clip.run ),
		attack: mixer.clipAction( clip.attack )
	});

	const idle = useCallback( function () {

		if(
			!animation.idle.isRunning() &&
			!animation.attack.isRunning()
		) {

			animation.idle.reset();
			animation.run.crossFadeTo( animation.idle, DURATION[0] );
			animation.idle.play();
		}
	}, [animation] );
	const run = useCallback( function () {

		if(
			playing &&
			!animation.run.isRunning() &&
			!animation.attack.isRunning()
		) {

			animation.run.reset();
			animation.idle.crossFadeTo( animation.run, DURATION[1] );
			animation.run.play();
		}
	}, [animation, playing] );
	const attack = useCallback( function () {

		if( !animation.attack.isRunning() ) {

			let current = "idle";
			if( animation.run.isRunning() ) current = "run";
			else if( animation.attack.isRunning() ) current = "attack";

			animation.attack.reset();
			animation[ current ].crossFadeTo( animation.attack, DURATION[0] );
			animation.attack.play();

			if( audioAttack.current ) audioAttack.current.play();

			setTimeout(
				function () {

					animation.run.reset();
					animation.attack.crossFadeTo( animation.run, DURATION[1] );
					animation.run.play();

					const monster = scene.getObjectByName( "monster" );
					if( camera.position.distanceTo(monster.position) < 10 ) {

						monster.position.z -= DISTANCE.Z;
						monster.position.x = camera.position.x + (
							( Math.random() > 0.5 ) ? DISTANCE.X : -DISTANCE.X
						);

						setScore( (score) => score + 1 );

						if( audioHit.current ) audioHit.current.play();
					}
				},
				(clip.attack.duration - DURATION[1]) * 1000
			);
		}
	}, [animation, camera, clip, scene] );

	const [ score, setScore ] = useState( 0 );

	const audioAttack = useRef();
	const audioHit = useRef();

	useEffect( () => window.addEventListener(
		"pointerdown",
		() => attack(),
		{ once: true }
	), [attack] );

	useEffect( function () {

		for( const child of girl.children ) {

			if( child.isSkinnedMesh ) {

				child.castShadow = true;

				child.material.color = new Color( "yellow" );
				child.material.map = null;
				child.material.needsUpdate = true;
			}
		}
	}, [girl.children] );

	useEffect( function () {

		function keyDownCallback( e ) {

			if(
				e.code === "ArrowUp" ||
				e.code === "KeyW"
			) run();
		}
		function keyUpCallback( e ) {

			if(
				e.code === "ArrowUp" ||
				e.code === "KeyW" ||
				e.code === "ArrowDown" ||
				e.code === "KeyS"
			) idle();
		}
		const mouseUpCallback = () => attack();

		let then = 0;
		let xStart = 0;
		let yStart = 0;
		function touchStartCallback( e ) {

			e.preventDefault();

			then = Date.now();

			xStart = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1;
			yStart = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1;
		}
		function touchEndCallback( e ) {

			e.preventDefault();

			const xEnd = e.changedTouches[ 0 ].clientX / window.innerWidth * 2 - 1;
			const yEnd = e.changedTouches[ 0 ].clientY / window.innerHeight * -2 + 1;

			if( Date.now() - then < 200 ) {

				if(
					Math.abs( xStart - xEnd ) < THRESHOLD &&
					Math.abs( yStart - yEnd ) < THRESHOLD
				) attack();
				else if( yStart < yEnd ) run();
				else idle();
			}
		}

		window.addEventListener( "keydown", keyDownCallback );
		window.addEventListener( "keyup", keyUpCallback );
		window.addEventListener( "mouseup", mouseUpCallback );

		window.addEventListener( "touchstart", touchStartCallback );
		window.addEventListener( "touchend", touchEndCallback );

		animation.idle.play();

		return function () {

			window.removeEventListener( "keydown", keyDownCallback );
			window.removeEventListener( "keyup", keyUpCallback );
			window.removeEventListener( "mouseup", mouseUpCallback );

			window.removeEventListener( "touchstart", touchStartCallback );
			window.removeEventListener( "touchend", touchEndCallback );
		}
	}, [animation, attack, idle, run] );

	useFrame( function (_, delta) {

		if( animation.run.isRunning() ) {

			const { x } = mouse;
			if( Math.abs(x) > 0.25 ) camera.rotation.y -= x / 150;
			girl.rotation.y = -x;

			camera.position.addScaledVector(
				vector.crossVectors(
					camera.up,
					vector.setFromMatrixColumn( camera.matrix, 0 )
				),
				SPEED * delta
			);
		}

		mixer.update( delta );
	} );

	useFrame( function (_, delta) {

		let monster;

		if( monster = scene.getObjectByName("monster") ) {

			monster.position.z += SPEED * delta;

			if( camera.position.z < monster.position.z ) {

				monster.position.z -= DISTANCE.Z;
				monster.position.x = camera.position.x + (
					( Math.random() > 0.5 ) ? DISTANCE.X : -DISTANCE.X
				);

				if( score > 0 ) setScore( (score) => score - 1 );
			}
		}
	} );

	return (
		<primitive
			object={ camera }
			far={ 100 }
			position={[ 0, HEIGHT, 0 ]}
		>
			<pointLight
				args={[ "magenta", 1, 25, 2 ]}
				castShadow
				position-y={ 5 }
			/>
			<primitive
				object={ girl }
				scale={[ -SCALE, SCALE, -SCALE ]}
				position={[ 0, -HEIGHT, -5 ]}
			>
				<PositionalAudio
					ref={ audioAttack }
					url={ girl_lunge }
					loop={ false }
				/>
				<PositionalAudio
					ref={ audioHit }
					url={ monster_grunt }
					loop={ false }
				/>
			</primitive>
			{ !playing && (<Text
				content={ "KATA" }
				height={ 0.3 }
			/>) }
			{ playing && (<Text
				content={ ("0000" + score).slice(-4) }
				height={ 0.6 }
			/>) }
			{ playing && <Buildings height={ HEIGHT } /> }
			{ playing && (<PositionalAudio
				url={ music }
				autoplay
				onUpdate={ (audio) => audio.setVolume(0.25) }
			/>) }
		</primitive>
	);

}
