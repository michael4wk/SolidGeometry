import * as THREE from 'three';
import { GeometryConfig, GeometryParams } from '../types/geometry';

/**
 * 创建几何体的函数映射
 */
const geometryCreators = {
  cube: (params: GeometryParams) => {
    const { width = 1, height = 1, depth = 1 } = params;
    return new THREE.BoxGeometry(width, height, depth);
  },
  sphere: (params: GeometryParams) => {
    const { radius = 1 } = params;
    return new THREE.SphereGeometry(radius, 32, 32);
  },
  cylinder: (params: GeometryParams) => {
    const { radius = 1, height = 1 } = params;
    return new THREE.CylinderGeometry(radius, radius, height, 32);
  },
  cone: (params: GeometryParams) => {
    const { radius = 1, height = 1 } = params;
    return new THREE.ConeGeometry(radius, height, 32);
  },
  torus: (params: GeometryParams) => {
    const { radius = 1, tube = 0.3 } = params;
    return new THREE.TorusGeometry(radius, tube, 16, 100);
  },
  tetrahedron: (params: GeometryParams) => {
    const { radius = 1 } = params;
    return new THREE.TetrahedronGeometry(radius);
  }
};

/**
 * 计算几何体属性
 */
export const calculateGeometryProperties = (
  type: string, 
  params: GeometryParams
): { surfaceArea: number; volume: number } => {
  switch (type) {
    case 'cube':
      const a = params.width || 1;
      return {
        surfaceArea: 6 * a * a,
        volume: a * a * a
      };
    case 'sphere':
      const r = params.radius || 1;
      return {
        surfaceArea: 4 * Math.PI * r * r,
        volume: (4 / 3) * Math.PI * r * r * r
      };
    case 'cylinder':
      const cr = params.radius || 1;
      const ch = params.height || 1;
      return {
        surfaceArea: 2 * Math.PI * cr * cr + 2 * Math.PI * cr * ch,
        volume: Math.PI * cr * cr * ch
      };
    case 'cone':
      const cor = params.radius || 1;
      const coh = params.height || 1;
      const slantHeight = Math.sqrt(cor * cor + coh * coh);
      return {
        surfaceArea: Math.PI * cor * cor + Math.PI * cor * slantHeight,
        volume: (1 / 3) * Math.PI * cor * cor * coh
      };
    case 'torus':
      const tr = params.radius || 1;
      const tt = params.tube || 0.3;
      return {
        surfaceArea: 4 * Math.PI * Math.PI * tr * tt,
        volume: 2 * Math.PI * Math.PI * tr * tt * tt
      };
    case 'tetrahedron':
      const tetRadius = params.radius || 1;
      const edgeLength = tetRadius * Math.sqrt(8 / 3);
      return {
        surfaceArea: Math.sqrt(3) * edgeLength * edgeLength,
        volume: (edgeLength * edgeLength * edgeLength * Math.sqrt(2)) / 12
      };
    default:
      return { surfaceArea: 0, volume: 0 };
  }
};

/**
 * 创建几何体
 */
export const createGeometry = (type: string, params: GeometryParams): THREE.BufferGeometry => {
  const creator = geometryCreators[type as keyof typeof geometryCreators];
  if (!creator) {
    throw new Error(`Unsupported geometry type: ${type}`);
  }
  return creator(params);
};

/**
 * 创建材质
 */
export const createMaterial = (type: string, color: number = 0x4f46e5): THREE.Material => {
  switch (type) {
    case 'basic':
      return new THREE.MeshBasicMaterial({ color });
    case 'phong':
      return new THREE.MeshPhongMaterial({ 
        color,
        shininess: 100,
        transparent: true,
        opacity: 0.8
      });
    case 'lambert':
      return new THREE.MeshLambertMaterial({ color });
    default:
      return new THREE.MeshPhongMaterial({ 
        color,
        shininess: 100,
        transparent: true,
        opacity: 0.8
      });
  }
};

/**
 * 创建场景基础设置
 */
export const createSceneSetup = (containerWidth: number = 800, containerHeight: number = 384): {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
} => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  // 使用容器的实际宽高比，而不是窗口的宽高比
  const aspect = containerWidth / containerHeight;
  const camera = new THREE.PerspectiveCamera(
    75,
    aspect,
    0.1,
    1000
  );
  camera.position.set(3, 3, 3);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(containerWidth, containerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // 确保renderer.domElement可以正确设置样式
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.maxWidth = '100%';
  renderer.domElement.style.height = 'auto';

  return { scene, camera, renderer };
};

/**
 * 添加基础光照
 */
export const addBasicLighting = (scene: THREE.Scene): void => {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  // 方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // 点光源
  const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
};

/**
 * 添加网格辅助线
 */
export const addGridHelper = (scene: THREE.Scene): THREE.GridHelper => {
  const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x444444);
  scene.add(gridHelper);
  return gridHelper;
};

/**
 * 创建几何体网格
 */
export const createGeometryMesh = (
  type: string, 
  params: GeometryParams, 
  color: number = 0x4f46e5
): THREE.Mesh => {
  const geometry = createGeometry(type, params);
  const material = createMaterial('phong', color);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};

/**
 * 更新几何体网格
 */
export const updateGeometryMesh = (
  mesh: THREE.Mesh,
  type: string,
  params: GeometryParams
): void => {
  const newGeometry = createGeometry(type, params);
  mesh.geometry.dispose();
  mesh.geometry = newGeometry;
};