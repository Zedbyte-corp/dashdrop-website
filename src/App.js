import { useEffect, useRef } from "react";
import "./App.css";
// import { BackgroundAnimation, panCam } from "./bganimation";
import { BackgroundAnimation } from "./bganimationcanvas";
function App() {
	const mountRef = useRef(null);
	// useEffect(() => {
	// 	panCam(2, 0, 0, 1000, 1, 3, 9, 5000);
	// }, []);

	return (
		<BackgroundAnimation />
		// <div>
		// 	{/* <div className="asd">asd</div> */}
		// 	<button onClick={() => panCam(2, 0, 0, 1000, -3.2, -10, -12, 1000)}>
		// 		state1
		// 	</button>
		// 	<button
		// 		onClick={() => panCam(2, 0, 0, 1000, -7.2, 1.08, 2.8, 1000)}
		// 	>
		// 		state2
		// 	</button>
		// 	<button onClick={() => panCam(0, 0, 0, 1000, 10, 72.9, -10, 1000)}>
		// 		state3
		// 	</button>
		// 	<BackgroundAnimation
		// 		className="hi"
		// 		mountRef={mountRef}
		// 	></BackgroundAnimation>
		// </div>
	);
}

export default App;
