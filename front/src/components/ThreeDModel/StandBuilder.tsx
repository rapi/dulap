import React, { useEffect, useRef, Suspense } from 'react'
import { useLoader, useFrame, ThreeEvent } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'
import * as THREE from 'three'

interface StandBuilderProps {
  selectedColor?: string
  desiredWidth?: number
  desiredHeight?: number
  drawerOffsetZ?: number
  desiredDepth?: number
  lerpSpeed?: number
}

type DrawerState = {
  mesh: THREE.Mesh
  baseZ: number
  hovering: boolean
}

export const StandBuilder: React.FC<StandBuilderProps> = ({
  selectedColor = '#ded9d3',
  desiredWidth = 80,
  desiredHeight = 70,
  desiredDepth = 10,  
  drawerOffsetZ = 10,
  lerpSpeed = 0.1,
}) => {
  const fbx = useLoader(FBXLoader, '/assets/stand.fbx')

  const drawersRef = useRef<Map<string, DrawerState>>(new Map())
  const baselineSizeRef = useRef<{ width: number; height: number; depth: number } | null>(
    null
  )

  // 1) Initial setup: scale, find drawers, and CLONE materials so later color changes
  //    won't affect other instances that share cached materials.
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

        const name = (mesh.name || '').toLowerCase()
        if (name.startsWith('yashik')) {
          drawersRef.current.set(mesh.uuid, {
            mesh,
            baseZ: mesh.position.z,
            hovering: false,
          })
          mesh.userData.isDrawer = true
        }
      }
    })
  }, [fbx])

  // 1b) Compute and cache baseline bounding-box size once the model is present
  useEffect(() => {
    if (!fbx) return
    // Compute the bounding box at the current (neutral) scale
    const box = new THREE.Box3().setFromObject(fbx)
    const size = new THREE.Vector3()
    box.getSize(size)
    baselineSizeRef.current = {
      width: Math.max(size.x, 0.0001),
      height: Math.max(size.y, 0.0001),
      depth: Math.max(size.z, 0.0001),
    }
  }, [fbx])

  // 1c) Apply scaling whenever desiredWidth/desiredHeight change
  useEffect(() => {
    if (!fbx || !baselineSizeRef.current) return
    const baseline = baselineSizeRef.current
    // Convert desired cm directly to world units, assuming baseline dimensions are in same unit scale
    const sx = desiredWidth / baseline.width/1.75
    const sy = desiredHeight / baseline.height/1.9
    // Keep depth unchanged relative to baseline (can be modified when depth control exists)
    const sz = desiredDepth/baseline.depth/2
    fbx.scale.set(sx, sy, sz)
  }, [fbx, desiredWidth, desiredHeight, desiredDepth])

  // 2) Recolor everything whenever selectedColor changes
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
