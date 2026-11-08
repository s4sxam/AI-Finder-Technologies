import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Sliders, Eye, RefreshCw, ChevronDown, ChevronUp, Sparkles, Orbit } from 'lucide-react';
import { ToolCategory } from '../types';

interface ThreeSceneProps {
  onSelectCategory?: (category: ToolCategory) => void;
  selectedCategory?: ToolCategory | 'all';
  className?: string;
  isHeroMode?: boolean;
}

// Pre-allocated math helpers at module scope for zero-GC in render loop
const _vec3 = new THREE.Vector3();
const _targetPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _color = new THREE.Color();

// Procedural CanvasTexture generator for category insignia dials
function createCategoryBadgeTexture(label: string, symbol: string, accentHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Background gradient plate
  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
  grad.addColorStop(0, '#131A2A');
  grad.addColorStop(0.8, '#0A0E17');
  grad.addColorStop(1, '#05070B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Outer calibration circle & tick marks
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 230, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle crosshair reticle
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(256, 30); ctx.lineTo(256, 90);
  ctx.moveTo(256, 422); ctx.lineTo(256, 482);
  ctx.moveTo(30, 256); ctx.lineTo(90, 256);
  ctx.moveTo(422, 256); ctx.lineTo(482, 256);
  ctx.stroke();

  // Inner ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(256, 256, 170, 0, Math.PI * 2);
  ctx.stroke();

  // Primary symbol monogram
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 120px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 256, 236);

  // Bottom category label
  ctx.fillStyle = accentHex;
  ctx.font = '600 32px "JetBrains Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText(label.toUpperCase(), 256, 345);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  return tex;
}

// Procedural contact shadow radial gradient
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.45)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  onSelectCategory,
  selectedCategory,
  className = '',
  isHeroMode = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explodedDist, setExplodedDist] = useState(1.0);
  const [finishTheme, setFinishTheme] = useState<'cobalt' | 'titanium' | 'brass'>('cobalt');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [activeCategoryNode, setActiveCategoryNode] = useState<ToolCategory | 'core'>('core');

  // Mutable refs to pass UI state into animation loop without re-instantiating scene
  const explodedRef = useRef(1.0);
  const finishRef = useRef(finishTheme);
  const autoRotateRef = useRef(autoRotate);
  const activeNodeRef = useRef(activeCategoryNode);

  useEffect(() => {
    explodedRef.current = explodedDist;
  }, [explodedDist]);

  useEffect(() => {
    finishRef.current = finishTheme;
  }, [finishTheme]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    activeNodeRef.current = activeCategoryNode;
  }, [activeCategoryNode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL from renderer string
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070A11);
    scene.fog = new THREE.FogExp2(0x070A11, 0.045);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 8.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Procedural Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Rig (Key, Fill, Rim)
    const keyLight = new THREE.DirectionalLight(0xFFF7EA, 3.2);
    keyLight.position.set(6, 9, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x8AB4F8, 0x0F172A, 1.4);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x2F5BFF, 2.5);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // Master Nexus Assembly Group
    const nexusRoot = new THREE.Group();
    scene.add(nexusRoot);

    // Radial Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.6;
    scene.add(shadowMesh);

    // Floor Grid Ring
    const gridHelper = new THREE.GridHelper(14, 28, 0x2F5BFF, 0x1E293B);
    gridHelper.position.y = -1.59;
    scene.add(gridHelper);

    // --- PROCEDURAL COMPONENT 1: CENTRAL QUANTUM AI CORE (Composite 5-Part Model) ---
    const coreGroup = new THREE.Group();
    nexusRoot.add(coreGroup);

    // Part 1: Primary silhouette - Faceted Quantum Icosahedron Core
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1E293B,
      metalness: 0.9,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = !isSoftwareGl;
    coreGroup.add(coreMesh);

    // Part 2: Inner glowing energy prism
    const innerGeo = new THREE.OctahedronGeometry(0.5, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x2F5BFF,
      wireframe: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Part 3: Inner Gyroscopic Reticle Gimbal (Lathe/Torus geometry)
    const ringGeo1 = new THREE.TorusGeometry(1.2, 0.03, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      metalness: 0.95,
      roughness: 0.2
    });
    const gimbal1 = new THREE.Mesh(ringGeo1, ringMat1);
    coreGroup.add(gimbal1);

    // Part 4: Secondary Orthogonal Gimbal
    const ringGeo2 = new THREE.TorusGeometry(1.4, 0.025, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x2F5BFF,
      metalness: 0.85,
      roughness: 0.3
    });
    const gimbal2 = new THREE.Mesh(ringGeo2, ringMat2);
    gimbal2.rotation.x = Math.PI / 2;
    coreGroup.add(gimbal2);

    // Part 5: Accent Beryllium Optical Calibrators
    const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.9,
      roughness: 0.15
    });
    for (let i = 0; i < 6; i++) {
      const pin = new THREE.Mesh(pinGeo, pinMat);
      const angle = (i / 6) * Math.PI * 2;
      pin.position.set(Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3);
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pin.position.clone().normalize());
      coreGroup.add(pin);
    }

    // --- PROCEDURAL COMPONENT 2: 6 CATEGORY SATELLITE NODES ---
    // Chat, Coding, Image, Video, Research, Writing
    const categories: {
      category: ToolCategory;
      label: string;
      symbol: string;
      accent: number;
      accentHex: string;
      baseRadius: number;
      angleOffset: number;
      elevation: number;
    }[] = [
      { category: 'chat', label: 'Chat', symbol: 'AI', accent: 0x3B82F6, accentHex: '#3B82F6', baseRadius: 2.8, angleOffset: 0, elevation: 0.4 },
      { category: 'coding', label: 'Code', symbol: 'DEV', accent: 0x10B981, accentHex: '#10B981', baseRadius: 2.8, angleOffset: (Math.PI / 3) * 1, elevation: -0.3 },
      { category: 'image', label: 'Art', symbol: 'IMG', accent: 0xEC4899, accentHex: '#EC4899', baseRadius: 2.8, angleOffset: (Math.PI / 3) * 2, elevation: 0.5 },
      { category: 'video', label: 'Motion', symbol: 'VID', accent: 0x8B5CF6, accentHex: '#8B5CF6', baseRadius: 2.8, angleOffset: (Math.PI / 3) * 3, elevation: -0.4 },
      { category: 'research', label: 'Research', symbol: 'RES', accent: 0x0EA5E9, accentHex: '#0EA5E9', baseRadius: 2.8, angleOffset: (Math.PI / 3) * 4, elevation: 0.3 },
      { category: 'writing', label: 'Prose', symbol: 'TXT', accent: 0xF59E0B, accentHex: '#F59E0B', baseRadius: 2.8, angleOffset: (Math.PI / 3) * 5, elevation: -0.2 },
    ];

    const satelliteMeshes: {
      category: ToolCategory;
      group: THREE.Group;
      basePos: THREE.Vector3;
      accentColor: number;
    }[] = [];

    categories.forEach((item) => {
      const satGroup = new THREE.Group();

      // Part A: Cylindrical Dial Base
      const dialGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.16, 32);
      const dialMat = new THREE.MeshStandardMaterial({
        color: 0x0F172A,
        metalness: 0.9,
        roughness: 0.2
      });
      const dialMesh = new THREE.Mesh(dialGeo, dialMat);
      dialMesh.castShadow = !isSoftwareGl;
      satGroup.add(dialMesh);

      // Part B: Top Face Canvas Texture
      const badgeTex = createCategoryBadgeTexture(item.label, item.symbol, item.accentHex);
      const faceGeo = new THREE.CircleGeometry(0.46, 32);
      const faceMat = new THREE.MeshBasicMaterial({
        map: badgeTex,
        transparent: true
      });
      const faceMesh = new THREE.Mesh(faceGeo, faceMat);
      faceMesh.rotation.x = -Math.PI / 2;
      faceMesh.position.y = 0.082;
      satGroup.add(faceMesh);

      // Part C: Outer Chamfer Accent Ring
      const ringGeo = new THREE.TorusGeometry(0.53, 0.025, 12, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: item.accent,
        metalness: 0.8,
        roughness: 0.2
      });
      const satRing = new THREE.Mesh(ringGeo, ringMat);
      satRing.rotation.x = Math.PI / 2;
      satGroup.add(satRing);

      // Part D: Vertical Light Conduit Filament
      const beaconGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: item.accent,
        transparent: true,
        opacity: 0.7
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 0.45;
      satGroup.add(beacon);

      // Initial orbital coordinate calculation
      const x = Math.cos(item.angleOffset) * item.baseRadius;
      const z = Math.sin(item.angleOffset) * item.baseRadius;
      satGroup.position.set(x, item.elevation, z);

      nexusRoot.add(satGroup);
      satelliteMeshes.push({
        category: item.category,
        group: satGroup,
        basePos: new THREE.Vector3(x, item.elevation, z),
        accentColor: item.accent
      });
    });

    // Connecting orbital wireframe splines
    const orbitPathGeo = new THREE.RingGeometry(2.78, 2.82, 64);
    const orbitPathMat = new THREE.MeshBasicMaterial({
      color: 0x2F5BFF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const orbitPlane = new THREE.Mesh(orbitPathGeo, orbitPathMat);
    orbitPlane.rotation.x = Math.PI / 2;
    orbitPlane.position.y = 0;
    nexusRoot.add(orbitPlane);

    // Interactive Raycasting for node selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nexusRoot.children, true);

      if (intersects.length > 0) {
        let hitObject: THREE.Object3D | null = intersects[0].object;
        while (hitObject && hitObject.parent !== nexusRoot && hitObject.parent !== scene) {
          hitObject = hitObject.parent;
        }

        if (hitObject) {
          const matched = satelliteMeshes.find((s) => s.group === hitObject);
          if (matched) {
            setActiveCategoryNode(matched.category);
            if (onSelectCategory) {
              onSelectCategory(matched.category);
            }
          } else if (hitObject === coreGroup) {
            setActiveCategoryNode('core');
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Smooth Exponential Damping
    let clock = new THREE.Clock();
    let frameId = 0;

    function tick() {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Apply Material Finish Theme Dynamically
      if (finishRef.current === 'cobalt') {
        coreMat.color.setHex(0x1E293B);
        coreMat.metalness = 0.9;
        coreMat.roughness = 0.12;
      } else if (finishRef.current === 'titanium') {
        coreMat.color.setHex(0xE2E8F0);
        coreMat.metalness = 0.98;
        coreMat.roughness = 0.18;
      } else if (finishRef.current === 'brass') {
        coreMat.color.setHex(0xD97706);
        coreMat.metalness = 0.88;
        coreMat.roughness = 0.22;
      }

      // Smooth damped rotation on core gimbals
      gimbal1.rotation.y += 0.4 * dt;
      gimbal1.rotation.x += 0.2 * dt;
      gimbal2.rotation.y -= 0.3 * dt;
      gimbal2.rotation.z += 0.25 * dt;

      coreMesh.rotation.y += 0.2 * dt;
      innerMesh.rotation.x -= 0.5 * dt;

      // Auto-rotation of the whole nexus if enabled
      if (autoRotateRef.current) {
        nexusRoot.rotation.y += 0.12 * dt;
      }

      // Smooth separation of satellites according to Exploded Distance slider
      const targetSep = explodedRef.current;
      satelliteMeshes.forEach((sat, idx) => {
        const base = sat.basePos;
        _targetPos.set(base.x * targetSep, base.y + Math.sin(elapsed * 1.5 + idx) * 0.08, base.z * targetSep);
        // Exponential damping: current + (target - current) * (1 - e^(-k * dt))
        const k = 5.0;
        sat.group.position.lerp(_targetPos, 1 - Math.exp(-k * dt));
        sat.group.rotation.y += 0.3 * dt;
      });

      // Camera Damping towards Active Focus Node
      if (activeNodeRef.current === 'core') {
        _camTarget.set(0, 0, 0);
      } else {
        const activeSat = satelliteMeshes.find((s) => s.category === activeNodeRef.current);
        if (activeSat) {
          activeSat.group.getWorldPosition(_camTarget);
        }
      }

      camera.lookAt(_camTarget.x * 0.3, _camTarget.y * 0.3, _camTarget.z * 0.3);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full overflow-hidden select-none bg-slate-950 ${className}`}>
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full min-h-[420px]" />

      {/* Top Header Overlay Indicator (Minimal, static, no pulsating dot) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 text-xs text-slate-300 rounded-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#2F5BFF]" />
          <span className="font-medium text-slate-200">AI Constellation Nexus</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 font-mono text-[11px]">Three.js PBR</span>
        </div>
      </div>

      {/* Top Right Quick Hint */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 pointer-events-auto">
        <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 text-xs text-slate-400 rounded-md">
          <span>Click any satellite node to filter directory</span>
        </div>
      </div>

      {/* Unified Bottom Control Dock (<= 15% Viewport footprint, no backdrop-filter over WebGL) */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-2xl transition-transform duration-300 ease-out pointer-events-auto ${
          isControlsCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Tab */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-b-0 border-slate-800 text-[11px] font-medium text-slate-300 rounded-t-md hover:text-white transition-colors"
            aria-label={isControlsCollapsed ? 'Expand 3D scene controls' : 'Collapse 3D scene controls'}
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#2F5BFF]" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Solid Control Bar Surface (Borders & Clean Spacing) */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-b-lg rounded-tl-lg shadow-xl text-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Cluster Separation Slider */}
            <div className="flex items-center gap-2 min-w-[170px]">
              <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <label htmlFor="cluster-slider" className="text-slate-400 whitespace-nowrap">
                Cluster Spread
              </label>
              <input
                id="cluster-slider"
                type="range"
                min="0.5"
                max="2.2"
                step="0.05"
                value={explodedDist}
                onChange={(e) => setExplodedDist(parseFloat(e.target.value))}
                className="w-24 accent-[#2F5BFF] cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                {explodedDist.toFixed(1)}x
              </span>
            </div>

            {/* Material Finish Preset Swatches */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] mr-1">Finish:</span>
              <button
                onClick={() => setFinishTheme('cobalt')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  finishTheme === 'cobalt'
                    ? 'bg-[#2F5BFF] text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Cobalt
              </button>
              <button
                onClick={() => setFinishTheme('titanium')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  finishTheme === 'titanium'
                    ? 'bg-slate-200 text-slate-900 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Titanium
              </button>
              <button
                onClick={() => setFinishTheme('brass')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  finishTheme === 'brass'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Brass
              </button>
            </div>

            {/* Orbit Auto-Rotate Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                  autoRotate
                    ? 'bg-slate-800 border-slate-700 text-[#2F5BFF]'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Orbit className="w-3 h-3" />
                <span>{autoRotate ? 'Orbiting' : 'Paused'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveCategoryNode('core');
                  setExplodedDist(1.0);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded transition-colors"
                title="Reset Camera Target"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
