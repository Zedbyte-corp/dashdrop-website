import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Tween, removeAll, update, Easing } from "@tweenjs/tween.js";
import {
	Environment,
	OrbitControls,
	PerspectiveCamera,
	Sparkles,
	Stars,
} from "@react-three/drei";
import {
	Bloom,
	Vignette,
	EffectComposer,
	ChromaticAberration,
	HueSaturation,
} from "@react-three/postprocessing";
import * as THREE from "three";
import "./App.css";
import { gsap } from "gsap";

export function BackgroundAnimation() {
	const lerpedPosition = new THREE.Vector3();
	const cursor = new THREE.Vector3();
	const pointLightRef = useRef();

	const [state, setState] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0, z: 10 });
	const [target, setTarget] = useState({ x: 0, y: 0, z: 0 });
	const [colors, setColors] = useState({
		blue: "#327510",
		red: "#828210",
		purple: "#19b3a4",
	});

	var clonedGltf = null;

	useEffect(() => {
		document.addEventListener(
			"mousemove",
			(event) => {
				event.preventDefault();
				cursor.x = event.clientX / window.innerWidth - 0.5;
				cursor.y = event.clientY / window.innerHeight - 0.5;
			},
			false
		);
	}, []);

	function Control({ position, target, colors }) {
		const controlRef = useRef();

		const {
			camera,
			gl: { domElement },
		} = useThree();

		useEffect(() => {
			// new Tween({ amount: 0 })
			// 	.to(
			// 		{
			// 			amount: 1,
			// 		},
			// 		1
			// 	)
			// 	.easing(Easing.Linear.None)
			// 	.start()
			// 	.onUpdate(function () {
			clonedGltf.materials.blue.color.set(colors.blue);
			clonedGltf.materials.red.color.set(colors.red);
			clonedGltf.materials.purple.color.set(colors.purple);
			// });

			gsap.timeline().to(camera.position, {
				duration: 3,
				repeat: 0,
				x: position.x,
				y: position.y,
				z: position.z,
				ease: "power3.inOut",
			});
			gsap.timeline().to(
				controlRef.current.target,
				{
					duration: 3,
					repeat: 0,
					x: target.x,
					y: target.y,
					z: target.z,
					ease: "power3.inOut",
				},
				"<"
			);
		}, [position, target, clonedGltf]);
		return (
			<OrbitControls
				ref={controlRef}
				args={[camera, domElement]}
				enableZoom={false}
				enablePan={false}
				// autoRotate
				// autoRotateSpeed={0.5}
			/>
		);
	}

	function LERP() {
		return useFrame(() => {
			lerpedPosition.lerp(cursor, 0.01);
			// state.camera.position.y = lerpedPosition.y * 8;
			pointLightRef.current.position.x = -lerpedPosition.x * 50; //moves the horizontal light position using the lerped position
			pointLightRef.current.position.y = lerpedPosition.y * 60; //moves the vertical light position using the lerped position
		});
	}

	function introAnimation() {
		gsap.timeline().to(clonedGltf.scene.rotation, {
			duration: 3,
			repeat: 0,
			y: 5,
			ease: "power3.inOut",
		});
		gsap.timeline().to(document.getElementById("upper-layer"), {
			duration: 3,
			delay: 2,
			repeat: 0,
			opacity: 1,
			transform:
				"perspective(50rem) translate3d(0px, 0%, 0px) rotateX(0deg) scale(0.9, 0.9)",
			ease: "power3.inOut",
		});
	}

	function GTLF() {
		const gltf = useLoader(GLTFLoader, "./fish-tank.glb", (loader) => {
			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath(
				"https://www.gstatic.com/draco/v1/decoders/"
			);
			loader.setDRACOLoader(dracoLoader);
		});

		console.log(gltf);
		clonedGltf = useMemo(() => gltf, [gltf]);
		if (state === 1) {
			introAnimation();
		}
		useEffect(() => {
			let timeout;
			const rotate = () => {
				for (let i in gltf.nodes) {
					if (gltf.nodes[i].name.includes("Cylinder")) {
						gltf.nodes[i].rotation.y += gltf.nodes[i].id * 0.000005;
					}
				}
				timeout = setTimeout(rotate, 1);
			};
			rotate();
			return () => void clearTimeout(timeout);
		}, []);

		return <primitive object={gltf.scene} />;
	}

	function handleClick() {
		gsap.timeline().to(document.getElementById("upper-layer"), {
			duration: 2,
			delay: 0,
			repeat: 0,
			opacity: 0,
			transform:
				"perspective(50rem) translate3d(0px, 150%, 200px) rotateX(-80deg) scale(1, 1)",
			ease: "power3.inOut",
		});
		gsap.timeline().to(document.getElementById("first-div"), {
			duration: 2,
			delay: 1,
			repeat: 0,
			opacity: 1,
			ease: "power3.inOut",
		});
	}

	function handleClick2() {
		gsap.timeline().to(document.getElementById("first-div"), {
			duration: 2,
			delay: 0,
			repeat: 0,
			opacity: 0,
			ease: "power3.inOut",
		});
		introAnimation();
	}

	return (
		<div className="canvas">
			<Canvas
				camera={{ position: [0, 6.6, 0] }}
				gl={{
					powerPreference: "high-performance",
					antialias: true,
					pixelRatio: Math.min(window.devicePixelRatio, 2),
					outputEncoding: THREE.sRGBEncoding,
					toneMapping: THREE.LinearToneMapping,
				}}
			>
				<color attach="background" args={["#000"]} />
				<Stars
					radius={500}
					depth={50}
					count={1000}
					factor={1}
					saturation={0}
					fade
					speed={1}
				/>
				{/* <Sparkles count={500} scale={30 * 2} size={0.001} speed={0.1} /> */}
				<Environment files="./gem_2.hdr" />
				<ambientLight intensity={0.3} />
				<LERP />
				<EffectComposer>
					<Bloom
						intensity={1.9}
						mipmapBlur={true}
						luminanceThreshold={0.1}
						radius={1.1}
					/>
					<Bloom
						intensity={3.2}
						mipmapBlur={true}
						luminanceThreshold={0.1}
						radius={0.5}
					/>
					<Bloom
						intensity={1.2}
						mipmapBlur={true}
						luminanceThreshold={0.1}
						radius={0.5}
					/>
					<ChromaticAberration offset={[0.0009, 0.0009]} />
					<HueSaturation hue={-0.1} saturation={0.25} />
					<Vignette eskil={false} offset={0.5} darkness={0.5} />
				</EffectComposer>
				<pointLight
					ref={pointLightRef}
					position={[-3, 0, 8]}
					intensity={0.05}
					color="#fffff0"
					distance={100}
				/>
				<GTLF />
				<Control position={position} target={target} colors={colors} />

				<PerspectiveCamera
					fov={50}
					aspect={window.innerWidth / window.innerHeight}
					near={0.1}
					filmGauge={35}
					focus={10}
					filmOffset={0}
					far={2000}
				/>
			</Canvas>
			<div id="upper-layer">
				<div
					className="button"
					onClick={() => {
						handleClick();
						setState(2);
						setPosition({ x: 0, y: 20, z: 20 });
						setColors({
							blue: "#6b156a",
							red: "#6b156a",
							purple: "#8f1120",
						});
					}}
				>
					hiyaa
				</div>
			</div>
			<div id="first-div">
				<div
					className="button"
					onClick={() => {
						handleClick2();
						setState(1);
						setPosition({ x: 0, y: 0, z: 10 });
						setColors({
							blue: "#327510",
							red: "#828210",
							purple: "#19b3a4",
						});
					}}
				>
					asdasd
				</div>
			</div>
		</div>
	);
}
