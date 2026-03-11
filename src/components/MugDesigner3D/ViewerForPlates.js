import React, {
    useEffect,
    Suspense,
    forwardRef,
    useImperativeHandle,
    useRef
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

// COMPONENTE PLACA CORREGIDO
function Placa({textureUrl}) {
    const { scene } = useGLTF('/Placa.glb')
    const texture = useLoader(TextureLoader, textureUrl || placeholderBase64)
    const previousTextureUrlRef = useRef(textureUrl)

    useEffect(() => {
        if (!scene) return

        // Guardar referencia para el cleanup
        previousTextureUrlRef.current = textureUrl

        // Caso 1: RESET - No hay textureUrl
        if (!textureUrl) {
            scene.traverse((child) => {
                if (!child.isMesh) return

                // Manejar tanto materiales únicos como arrays de materiales
                const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material]

                materials.forEach(material => {
                    // Limpiar textura si existe
                    if (material.map) {
                        material.map.dispose() // IMPORTANTE: liberar memoria de GPU
                        material.map = null
                    }
                    // Restaurar color original
                    material.color.set('#f2f2f2')
                    material.needsUpdate = true
                })
            })
            return
        }

        // Caso 2: Hay textureUrl - aplicar textura
        if (!texture) return

        // Configurar textura
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.needsUpdate = true

        // Aplicar a la malla
        scene.traverse((child) => {
            if (!child.isMesh) return

            const materials = Array.isArray(child.material)
                ? child.material
                : [child.material]

            materials.forEach(material => {
                // Limpiar textura anterior si es diferente
                if (material.map && material.map !== texture) {
                    material.map.dispose()
                }

                // Solo aplicar textura al material llamado 'foto'
                if (material.name === 'foto') {
                    material.map = texture
                    material.color.set('#ffffff') // Blanco para que la textura se vea bien
                } else {
                    material.map = null
                    material.color.set('#f2f2f2')
                }
                material.needsUpdate = true
            })
        })

        // Cleanup function para cuando el componente se desmonte o textureUrl cambie
        return () => {
            // Si estamos en reset o el componente se desmonta, limpiar texturas
            if (!textureUrl && texture && texture !== textureUrl) {
                texture.dispose()
            }
        }
    }, [scene, texture, textureUrl])

    return <primitive object={scene} scale={0.5} />
}

// 🔥 AHORA EL COMPONENTE ACEPTA REF
const ViewerForPlates = forwardRef(({
                                        textureUrl,
                                        onLoadComplete,
                                        showInstructions = true,
                                        cameraPosition = [0, 0.6, 4],
                                        cameraFov = 45
                                    }, ref) => {

    console.log('ViewerForPlates textureUrl:', textureUrl)

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
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
                {/* 🔥 EXPONE EL CANVAS */}
                <ExposeCanvas innerRef={ref} />

                <ambientLight intensity={0.6} />
                <directionalLight position={[6, 10, 6]} intensity={1.2} castShadow />
                <hemisphereLight intensity={0.35} groundColor="#999" />

                <Suspense
                    fallback={
                        <Html center>
                            <div style={{ color: '#fff' }}>Cargando placa…</div>
                        </Html>
                    }
                >
                    <Placa textureUrl={textureUrl}/>

                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                        <circleGeometry args={[4, 32]} />
                        <meshStandardMaterial color="#eaeaea" />
                    </mesh>
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2.5}
                    maxDistance={8}
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

export default ViewerForPlates

useGLTF.preload('/Placa.glb')