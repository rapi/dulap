import React, { useEffect, useRef, Suspense } from 'react'
import { useLoader, useFrame, ThreeEvent } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'
import assert from 'assert'

interface StandBuilderProps {
  selectedColor: string
  desiredWidth: number
  desiredHeight: number
  drawerOffsetZ?: number
  desiredDepth: number
  desiredPlintHeight: number
  lerpSpeed?: number
}

type DrawerState = {
  mesh: THREE.Mesh
  baseZ: number
  hovering: boolean
}

export const StandBuilder: React.FC<StandBuilderProps> = ({
  selectedColor = '#ded9d3',
  desiredWidth,
  desiredHeight,
  desiredDepth,  
  drawerOffsetZ = 10,
  desiredPlintHeight,
  lerpSpeed = 0.1,
}) => {
  const fbx = useLoader(FBXLoader, '/assets/stand.fbx')

  const drawersRef = useRef<Map<string, DrawerState>>(new Map())
  const baselineSizeRef = useRef<{ width: number; height: number; depth: number, plintHeight: number, plintWidth: number } | null>(
    null
  )

  useEffect(() => {
    if (!fbx) return

    // Establish a neutral initial scale for consistent baseline measurement
    fbx.scale.set(1, 1, 1)
    drawersRef.current.clear()

    fbx.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh

        // Enable shadow casting and receiving for all meshes
        mesh.castShadow = true
        mesh.receiveShadow = true

        // Clone materials once to avoid global side-effects from R3F caching
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m?.clone?.() as THREE.Material)
          } else {
            mesh.material = (mesh.material as THREE.Material)?.clone?.() as THREE.Material
          }
        }

        const name = (mesh.name || '').toLowerCase();
      
        if (name.startsWith('yashik')) {
          drawersRef.current.set(mesh.uuid, {
            mesh,
            baseZ: mesh.position.z,
            hovering: false,
          })
          mesh.userData.isDrawer = true
        }

        if (name.startsWith('bottom')) {
          mesh.userData.isPlint = true
        }
      }
    })
  }, [fbx])

  // Compute and cache baseline bounding-box size once the model is present
  useEffect(() => {
    if (!fbx) return
    const box = new THREE.Box3().setFromObject(fbx)
    const size = new THREE.Vector3()
    box.getSize(size)

    assert(!!getPlintMesh(fbx), 'NO plint detected')
    const boxPlint = new THREE.Box3().setFromObject(getPlintMesh(fbx)!)
    const boxSize = new THREE.Vector3()
    boxPlint.getSize(boxSize)

    baselineSizeRef.current = {
      width: Math.max(size.x, 0.0001),
      height: Math.max(size.y, 0.0001),
      depth: Math.max(size.z, 0.0001),
      plintHeight:  Math.max(boxSize.y, 0.0001),
      plintWidth:  Math.max(boxSize.x, 0.0001),
    }
  }, [fbx])

  // Apply scaling whenever desiredWidth/desiredHeight change
  useEffect(() => {
    if (!fbx || !baselineSizeRef.current) return
    const baseline = baselineSizeRef.current

    // TODO: Fix me
    // const plint = getPlintMesh(fbx)
    // // 3.5 - width of the left and right wall
    // const plintSX = (desiredWidth-3.5) / baseline.plintWidth
    // plint?.scale.setX(plintSX)
    // console.log({plintSX});

    const sx = desiredWidth / baseline.width
    const sy = desiredHeight / baseline.height
    const sz = desiredDepth/baseline.depth
    fbx.scale.set(sx, sy, sz)
  }, [fbx, desiredWidth, desiredHeight, desiredDepth, desiredPlintHeight])

  // Recolor everything whenever selectedColor changes
  useEffect(() => {
    if (!fbx) return

    const toDispose: THREE.Material[] = []

    type ColorableMaterial =
      | THREE.MeshStandardMaterial
      | THREE.MeshPhysicalMaterial
      | THREE.MeshPhongMaterial
      | THREE.MeshLambertMaterial
      | THREE.MeshBasicMaterial

    type WithOptionalMaps = {
      map?: THREE.Texture | null
      roughnessMap?: THREE.Texture | null
      metalnessMap?: THREE.Texture | null
      normalMap?: THREE.Texture | null
      aoMap?: THREE.Texture | null
      toneMapped?: boolean
      needsUpdate?: boolean
    }

    fbx.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

        const updated = materials.map((mat) => {
          const colorMat = mat as ColorableMaterial & WithOptionalMaps
          if (colorMat && (colorMat as ColorableMaterial).color) {
            // Material supports color — just set it
            colorMat.color.set(selectedColor)
            // Optional: turn off toneMapping for pure color look
            colorMat.toneMapped = false
            // Ensure textures don't override the color
            if (colorMat.map) colorMat.map = null
            if (colorMat.roughnessMap) colorMat.roughnessMap = null
            if (colorMat.metalnessMap) colorMat.metalnessMap = null
            if (colorMat.normalMap) colorMat.normalMap = null
            if (colorMat.aoMap) colorMat.aoMap = null
            colorMat.needsUpdate = true
            return mat
          } else {
            // No color property — replace with a simple colored material
            const replacement = new THREE.MeshStandardMaterial({
              color: selectedColor,
              roughness: 0.6,
              metalness: 0.0,
              toneMapped: false,
            })
            replacement.needsUpdate = true
            if (mat && (mat as THREE.Material).dispose) toDispose.push(mat as THREE.Material)
            return replacement
          }
        })

        mesh.material = Array.isArray(mesh.material) ? updated : updated[0]!
      }
    })

    // Clean up any replaced materials (avoid leaks)
    return () => {
      toDispose.forEach((m) => m.dispose())
    }
  }, [fbx, selectedColor])

  // Smooth hover animation for drawers
  useFrame(() => {
    drawersRef.current.forEach(({ mesh, baseZ, hovering }) => {
      const targetZ = baseZ + (hovering ? drawerOffsetZ : 0)
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, lerpSpeed)
    })
  })

  const getPlintMesh = (fbx: THREE.Group) => {
    return fbx.children.find((c)=>c.userData.isPlint)
  } 

  const isDrawerMesh = (obj: THREE.Object3D | null | undefined): obj is THREE.Mesh =>
    !!obj && (obj as THREE.Mesh).isMesh && !!(obj as THREE.Mesh).userData?.isDrawer

  const setHovering = (uuid: string, value: boolean) => {
    const d = drawersRef.current.get(uuid)
    if (d) d.hovering = value
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const hit = e.intersections[0]?.object ?? e.object
    if (isDrawerMesh(hit)) {
      setHovering(hit.uuid, true)
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const hit = e.object
    if (isDrawerMesh(hit)) {
      setHovering(hit.uuid, false)
      document.body.style.cursor = 'auto'
    }
  }

  const handlePointerMissed = () => {
    drawersRef.current.forEach((d) => (d.hovering = false))
    document.body.style.cursor = 'auto'
  }

  if (!fbx) return null

  return (
    <Suspense fallback={null}>
      <primitive
        object={fbx}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMissed={handlePointerMissed}
      />
    </Suspense>
  )
}
