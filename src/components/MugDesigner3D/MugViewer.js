import React, {
    useEffect,
    Suspense,
    forwardRef,
    useImperativeHandle
} from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'

const placeholderBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

// 🔥 ESTE COMPONENTE PERMITE EXPONER EL CANVAS AL PADRE
function ExposeCanvas({ innerRef }) {
    const { gl } = useThree()

    useImperativeHandle(innerRef, () => ({
        getCanvas: () => gl.domElement
    }), [gl])

    return null
}

function Mug({ textureUrl }) {
    const { scene } = useGLTF('/mug.glb')
    const texture = useLoader(TextureLoader, textureUrl || placeholderBase64)

    useEffect(() => {
        if (!scene || !texture) return

        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.needsUpdate = true

        scene.traverse((child) => {
            if (!child.isMesh) return

            const material = child.material

            if (material.name === 'Foto' && textureUrl) {
                material.map = texture
                material.needsUpdate = true
            }

            if (material.name !== 'Foto') {
                material.map = null
                material.color.set('#f2f2f2')
                material.needsUpdate = true
            }
        })
    }, [scene, texture, textureUrl])

    return <primitive object={scene} scale={0.7} />
}

// 🔥 AHORA EL COMPONENTE ACEPTA REF
const MugViewer = forwardRef(({
                                  textureUrl,
                                  onLoadComplete,
                                  showInstructions = true,
                                  cameraPosition = [0, 0.6, 4],
                                  cameraFov = 45
                              }, ref) => {

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#1e1e1e'
            }}
        >
            <Canvas
                camera={{
                    position: cameraPosition,
                    fov: cameraFov
                }}
                shadows
                onCreated={onLoadComplete}
                gl={{ preserveDrawingBuffer: true }} // 🔥 CLAVE PARA SCREENSHOT
            >
                {/* 🔥 EXPONE EL CANVAS */}
                <ExposeCanvas innerRef={ref} />

                <ambientLight intensity={0.6} />
                <directionalLight position={[6, 10, 6]} intensity={1.2} castShadow />
                <hemisphereLight intensity={0.35} groundColor="#999" />

                <Suspense
                    fallback={
                        <Html center>
                            <div style={{ color: '#fff' }}>Cargando taza…</div>
                        </Html>
                    }
                >
                    <Mug textureUrl={textureUrl} />

                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 0]}>
                        <circleGeometry args={[3, 32]} />
                        <meshStandardMaterial color="#eaeaea" />
                    </mesh>
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2.5}
                    maxDistance={6}
                    maxPolarAngle={Math.PI / 1.8}
                />
            </Canvas>

            {showInstructions && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        width: '100%',
                        textAlign: 'center',
                        fontSize: 12,
                        color: '#ddd'
                    }}
                >
                    🖱️ Arrastra para rotar • 🔍 Zoom
                </div>
            )}
        </div>
    )
})

export default MugViewer

useGLTF.preload('/mug.glb')
