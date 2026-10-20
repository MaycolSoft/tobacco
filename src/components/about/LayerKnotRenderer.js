import * as THREE from 'three';

const initial = [[12, -8, -12], [58, -28, 24], [-32, 58, -24]];
export function init(root, { onFailure }) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const canvas = renderer.domElement;
  canvas.className = 'layer-knot__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.85, 1.85, 1.24, -1.24, 0.1, 20);
  camera.position.z = 6;
  const ambient = new THREE.HemisphereLight(0xf4e5cd, 0x3a3028, 2.1);
  const key = new THREE.DirectionalLight(0xffddae, 3.5); key.position.set(-3, 4, 5);
  const fill = new THREE.DirectionalLight(0xa4b1ae, 1.2); fill.position.set(3, -1, 3);
  scene.add(ambient, key, fill);
  const specs = [[1, .03, '#c7a479', .58, .5], [.8, .06, '#4c4939', .92, .12], [.55, .14, '#754337', .83, .04]];
  const meshes = specs.map(([radius, tube, color, roughness, metalness]) => {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 96), new THREE.MeshStandardMaterial({ color, roughness, metalness }));
    scene.add(mesh); return mesh;
  });
  let active = true;
  let visible = false;
  let timer = 0;
  let lastFrame = 0;
  let emphasis = -1;
  const schedule = () => {
    if (!active || !visible || timer) return;
    timer = setTimeout(() => {
      timer = 0;
      if (!active || !visible) return;
      renderer.render(scene, camera);
      lastFrame = performance.now();
    }, Math.max(0, 34 - (performance.now() - lastFrame)));
  };
  const lost = event => { event.preventDefault(); onFailure(); };
  canvas.addEventListener('webglcontextlost', lost);
  root.append(canvas);
  return {
    setProgress(progress) {
      meshes.forEach((mesh, index) => {
        const amount = 1 - THREE.MathUtils.clamp(progress * 3 - index, 0, 1);
        mesh.rotation.set(...initial[index].map(degrees => THREE.MathUtils.degToRad(degrees * amount)));
      }); schedule();
    },
    setEmphasis(selected) {
      if (emphasis === selected) return;
      emphasis = selected;
      meshes.forEach((mesh, index) => {
        mesh.position.z = index === selected ? .08 : 0;
        mesh.material.color.set(specs[index][2]);
        if (selected >= 0 && index !== selected) mesh.material.color.multiplyScalar(.4);
      }); schedule();
    },
    resize() {
      renderer.setSize(root.clientWidth, root.clientHeight, false);
      schedule();
    },
    setVisible(value) { visible = value; schedule(); },
    dispose() {
      active = false; clearTimeout(timer);
      canvas.removeEventListener('webglcontextlost', lost);
      meshes.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); });
      scene.clear(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
