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
    if (u > .33) uv.setX(i, THREE.MathUtils.lerp(.33 + (u - .33) * .66, u, smooth(.92, 1, u)));
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
  const normal = new THREE.Vector3();
  const across = new THREE.Vector3();
  const centers = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
  const frames = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
  const normals = Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3());
  let appliedProgress = -1;
  let lastFrame = -Infinity;
  function deform(p) {
    center.set(-7, 0, 0);

    // Arc-length integration preserves the lamina length as curvature increases.
    // Fixed irregularities + pure p => identical geometry going up or down.
    for (let i = 0; i <= SEGMENTS; i++) {
      const u = i / SEGMENTS;
      const t = Math.max(0, (u - .33) / .67);
      const curl = p * smooth(0, .12, t);
      const phase = t * Math.PI * 10 * p + .38 * p * Math.sin(t * 17) + .10 * p * Math.sin(t * 39);
      const axial = .16 + .055 * Math.sin(t * 23 + .8);
      tangent.set(1 - curl + curl * axial, curl * Math.sqrt(1 - axial * axial) * Math.cos(phase), curl * Math.sqrt(1 - axial * axial) * Math.sin(phase)).normalize();
      if (i) center.addScaledVector(tangent, (u < .33 ? 14 : 40) / SEGMENTS);
      normal.set(0, -Math.sin(phase), Math.cos(phase));
      across.crossVectors(tangent, normal).normalize();
      across.applyAxisAngle(tangent, .35 * p * Math.sin(u * Math.PI));
      centers[i].copy(center); frames[i].copy(across);
      normals[i].crossVectors(tangent, across).normalize();
    }
    const middle = (centers[0].x + centers[SEGMENTS].x) / 2;
    const position = geometry.attributes.position;
    const vertexNormal = geometry.attributes.normal;
    for (let j = 0; j <= ROWS; j++) for (let i = 0; i <= SEGMENTS; i++) {
      const u = i / SEGMENTS, v = .5 - j / ROWS;
      // Broad, veined left tip narrows into the coil, leaving open air gaps.
      const width = 2.7 * (1 - .79 * smooth(.27, .58, u));
      const ruffle = .035 * Math.sin(u * 147 + j * .7) * Math.pow(Math.abs(v) * 2, 2);
      const c = centers[i], f = frames[i], n = normals[i];
      vertexNormal.setXYZ(j * (SEGMENTS + 1) + i, n.x, n.y, n.z);
      position.setXYZ(j * (SEGMENTS + 1) + i,
        c.x - middle + f.x * v * width,
        c.y + f.y * v * width + .12 * Math.sin(u * 11) * (1 - smooth(.3, .5, u)) + ruffle,
        c.z + f.z * v * width + .035 * Math.cos(u * 87) * (1 - v * v));
    }
    position.needsUpdate = true;
    vertexNormal.needsUpdate = true;
    appliedProgress = p;
    const span = (centers[SEGMENTS].x - centers[0].x) + 1.5;
    camera.left = -span / 2; camera.right = span / 2;
    camera.top = span / aspect / 2; camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    mesh.position.y = -.3 * p;
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
      mesh.position.y = -.3 * Math.max(0, progress) + (value - .5) * .12;
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
