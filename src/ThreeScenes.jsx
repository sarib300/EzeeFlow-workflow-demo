import { Suspense,  useRef,  } from 'react';
import {  useFrame, Canvas } from '@react-three/fiber';
import { 
   Float, Environment, MeshDistortMaterial, 
  Sphere, Stars, Sparkles as DreiSparkles, Torus,  Icosahedron
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';



// ============ 3D SCENES (one per section) ============

export function MorphingOrb({ color }) {
  const ref = useRef();
  useFrame((s) => {
    ref.current.rotation.x = s.clock.elapsedTime * 0.3;
    ref.current.rotation.y = s.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={2}>
      <Sphere ref={ref} args={[1.5, 32, 32]}>
        <MeshDistortMaterial color={color} distort={0.5} speed={3} metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.4} />
      </Sphere>
    </Float>
  );
}

export function FloatingCube({ color }) {
  const ref = useRef();
  useFrame((s) => {
    ref.current.rotation.x = s.clock.elapsedTime * 0.4;
    ref.current.rotation.y = s.clock.elapsedTime * 0.5;
  });
  return (
    <Float speed={1.5} floatIntensity={3}>
      <Icosahedron ref={ref} args={[1.4, 1]}>
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} emissive={color} emissiveIntensity={0.3} wireframe={false} />
      </Icosahedron>
      <Icosahedron args={[1.6, 1]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </Icosahedron>
    </Float>
  );
}

export function TorusRing({ color }) {
  const ref = useRef();
  useFrame((s) => {
    ref.current.rotation.x = s.clock.elapsedTime * 0.5;
    ref.current.rotation.z = s.clock.elapsedTime * 0.3;
  });
  return (
    <Float speed={2}>
      <Torus ref={ref} args={[1.3, 0.4, 32, 100]}>
        <MeshDistortMaterial color={color} distort={0.3} speed={2} metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.4} />
      </Torus>
    </Float>
  );
}

export function SceneWrapper({ children, color }) {
  // Detect low-power device
  const isLowPower = typeof navigator !== 'undefined' && 
    (navigator.hardwareConcurrency < 4 || /Mobile/.test(navigator.userAgent));
  return (
    <Canvas 
    // frameLoop={isLowPower ? 'demand' : 'always'}
    frameLoop='always'
 camera={{ position: [0, 0, 5], fov: 50 }} 
      gl={{ antialias: !isLowPower, alpha: true, powerPreference: 'high-performance' }}
      dpr={isLowPower ? 1 : [1, 2]}  // cap pixel ratio
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color={color} />
        <pointLight position={[-5, -5, 5]} intensity={1} color="#fff" />
       <Stars radius={30} depth={50} count={600} factor={3} fade speed={1} />
<DreiSparkles count={40} scale={[6, 6, 4]} size={2} speed={0.5} color={color} />
        {children}
        <Environment preset="city" />
        {!isLowPower && (
          <EffectComposer>
            <Bloom intensity={1} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={[0.0006, 0.0006]} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}