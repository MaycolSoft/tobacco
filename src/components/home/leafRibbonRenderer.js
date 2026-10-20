// Only imported near #recorrido on eligible desktop devices.
import * as THREE from 'three';

const BASE = '/img/art/leaf-ribbon/';
const SEGMENTS = 240;
const ROWS = 8;
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export async function init(root, { signal, onFailure }) {
  const loader = new THREE.TextureLoader();
  const loaded = await Promise.allSettled(['leaf-albedo.webp', 'leaf-alpha.webp', 'leaf-normal.webp'].map(name => loader.loadAsync(BASE + name)));
  const textures = loaded.filter(result => result.status === 'fulfilled').map(result => result.value);
  if (signal.aborted || loaded.some(result => result.status === 'rejected')) {
    textures.forEach(texture => texture.dispose());
    throw new Error('Leaf textures unavailable or cancelled');
  }
  const [map, alphaMap, normalMap] = textures;
  map.colorSpace = THREE.SRGBColorSpace;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch (error) { textures.forEach(texture => texture.dispose()); throw error; }
  textures.forEach(texture => { texture.anisotropy = Math.min(2, renderer.capabilities.getMaxAnisotropy()); });
  const canvas = renderer.domElement;
  canvas.className = 'leaf-ribbon__canvas';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 4, -4, .1, 100);
  camera.position.set(0, 0, 20);
  const geometry = new THREE.PlaneGeometry(14, 2, SEGMENTS, ROWS);
  geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i);
    if (u > .5) uv.setX(i, THREE.MathUtils.lerp(.5 + (u - .5) * .62, u, smooth(.92, 1, u)));
  }
  const idle = { value: 0 };
  const material = new THREE.MeshStandardMaterial({ map, alphaMap, normalMap, normalScale: new THREE.Vector2(.45, .45), roughness: .91, metalness: 0, side: THREE.DoubleSide, alphaTest: .32 });
  material.onBeforeCompile = shader => {
    shader.uniforms.uIdle = idle;
    shader.vertexShader = `uniform float uIdle;\n${shader.vertexShader}`.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.y += sin(uv.x * 14.0 + uIdle * 1.5) * 0.025 * (1.0 - smoothstep(0.0, 0.38, uv.x));');
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\nif (!gl_FrontFacing) diffuseColor.rgb *= vec3(0.72, 0.64, 0.55);');
  };
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.set(.18, -.16, .04);
  mesh.frustumCulled = false;
  scene.add(mesh);
  scene.add(new THREE.HemisphereLight(0xc8d0dc, 0x382313, 2.0));
  const key = new THREE.DirectionalLight(0xffe4c5, 2.3);
  key.position.set(-5, 4, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0xe9a85c, 1.2);
  rim.position.set(3, 2, -5); scene.add(rim);
  let disposed = false;
  let progress = -1;
  let dirty = true;
  let aspect = 2;
  const center = new THREE.Vector3();
  const tangent = new THREE.Vector3();
    const across = new THREE.Vector3();
  const centers = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
  const frames = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
  const normals = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
  const widths = new Float32Array(SEGMENTS + 1);
  let appliedProgress = -1;
  let lastFrame = -Infinity;
  // Coil tuning: radius, helix slope (pitch > coiled width => open gaps), arc stretch of the coiled strip.
  const FLAT = .5, RADIUS = 1.1, SLOPE = .34, STRETCH = 2.7, COIL_WIDTH = .62;
  const AXIS = new THREE.Vector3(1, 0, 0);
  const UP = new THREE.Vector3(0, 1, 0);
  const helix = new THREE.Vector3();
  const box = new THREE.Box3();
  function deform(p) {
    center.set(0, 0, 0);
    // The coil grows from the tip: `front` slides from the tip to FLAT as p goes 0 -> 1.
    // Arc-length integration (the coiled strip is stretched by STRETCH) + fixed irregularities
    // + pure p => identical geometry going up or down.
    const front = 1 - p * (1 - FLAT);
    const fade = smooth(0, .08, p);
    let phi = -.6;
    for (let i = 0; i <= SEGMENTS; i++) {
      const u = i / SEGMENTS;
      const b = fade * smooth(front - .03, front + .09, u);
      const ds = 14 / SEGMENTS * (1 + (STRETCH - 1) * b);
      const radius = RADIUS * (1 + .08 * Math.sin(phi * .8 + .6) + .04 * Math.sin(phi * 2.3));
      const slope = SLOPE * (1 + .1 * Math.sin(phi * 1.3 + 2));
      const ring = Math.sqrt(1 - slope * slope);
      helix.set(slope, -ring * Math.sin(phi), ring * Math.cos(phi));
      tangent.copy(AXIS).lerp(helix, b).normalize();
      if (i) { center.addScaledVector(tangent, ds); phi += b * ring * ds / radius; }
      // Width turns from screen-vertical (flat leaf) to along the coil axis (rolled band): the mid twist.
      across.copy(AXIS).addScaledVector(tangent, -tangent.x);
      if (across.lengthSq() < 1e-6) across.copy(UP); else across.normalize();
      across.lerp(UP, 1 - smooth(0, .7, b));
      across.addScaledVector(tangent, -across.dot(tangent));
      if (across.lengthSq() < 1e-6) across.copy(frames[Math.max(0, i - 1)]); else across.normalize();
      across.applyAxisAngle(tangent, .12 * Math.sin(u * 9 + 1) * b);
      centers[i].copy(center); frames[i].copy(across);
      normals[i].crossVectors(tangent, across).normalize();
      widths[i] = 2.7 * (1 - (1 - COIL_WIDTH) * smooth(.1, 1, b));
    }
    const position = geometry.attributes.position;
    const vertexNormal = geometry.attributes.normal;
    box.makeEmpty();
    for (let j = 0; j <= ROWS; j++) for (let i = 0; i <= SEGMENTS; i++) {
      const u = i / SEGMENTS, v = .5 - j / ROWS;
      const flat = 1 - smooth(.2, .6, frames[i].dot(AXIS) ** 2);
      const ruffle = .035 * Math.sin(u * 147 + j * .7) * Math.pow(Math.abs(v) * 2, 2);
      const c = centers[i], f = frames[i], n = normals[i], width = widths[i];
      const k = j * (SEGMENTS + 1) + i;
      vertexNormal.setXYZ(k, n.x, n.y, n.z);
      position.setXYZ(k,
        c.x + f.x * v * width,
        c.y + f.y * v * width + .12 * Math.sin(u * 11) * flat * (1 - smooth(.3, .5, u)) + ruffle,
        c.z + f.z * v * width + .035 * Math.cos(u * 87) * (1 - v * v));
      box.expandByPoint(center.set(position.getX(k), position.getY(k), position.getZ(k)));
    }
    position.needsUpdate = true;
    vertexNormal.needsUpdate = true;
    appliedProgress = p;
    // Fixed scale (no zoom while scrolling); only recentre on the deformed bounds.
    box.getCenter(center);
    const span = 15.5;
    camera.left = -span / 2; camera.right = span / 2;
    camera.top = span / aspect / 2; camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    mesh.position.copy(center).applyQuaternion(mesh.quaternion).negate();
    dirty = true;
  }
  function resize() {
    if (disposed) return;
    const { width, height } = root.getBoundingClientRect();
    aspect = width / Math.max(1, height);
    renderer.setSize(width, height, false);
    deform(Math.max(0, progress));
    render();
  }
  function render() {
    const now = performance.now();
    // Thirty frames per second is enough for this slow sculpture and bounds GPU work.
    if (!disposed && !document.hidden && dirty && now - lastFrame >= 1000 / 30) {
      if (appliedProgress !== Math.max(0, progress)) deform(Math.max(0, progress));
      renderer.render(scene, camera); dirty = false; lastFrame = now;
    }
  }
  const contextLost = event => { event.preventDefault(); onFailure(); };
  canvas.addEventListener('webglcontextlost', contextLost);
  const observer = new ResizeObserver(resize);
  root.appendChild(canvas);
  observer.observe(root);
  resize();
  return {
    setProgress(p) { const next = Math.max(0, Math.min(1, p)); if (next !== progress && !disposed) { progress = next; dirty = true; } },
    setIdle(value) {
      if (disposed || idle.value === value) return;
      idle.value = value;
      mesh.rotation.z = .04 + (value - .5) * .02;
      dirty = true;
    },
    render, resize,
    dispose() {
      if (disposed) return;
      disposed = true; observer.disconnect();
      canvas.removeEventListener('webglcontextlost', contextLost);
      geometry.dispose(); material.dispose(); textures.forEach(texture => texture.dispose());
      scene.clear(); renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
