import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getGeometryConfig } from '../data/geometryData';
import { updateLearningProgress } from '../utils/storage';
import { 
  createSceneSetup, 
  addBasicLighting, 
  addGridHelper, 
  createGeometryMesh, 
  updateGeometryMesh,
  calculateGeometryProperties 
} from '../utils/threeUtils';
import * as THREE from 'three';

export default function GeometryViewer() {
  const { type } = useParams<{ type: string }>();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number | null>(null);
  
  const [params, setParams] = useState(() => {
    // 根据当前几何体类型设置默认参数
    const defaultParams = { width: 2, height: 2, depth: 2, radius: 2, tube: 0.3 };
    if (type) {
      const config = getGeometryConfig(type);
      if (config?.defaultParams) {
        return { ...defaultParams, ...config.defaultParams };
      }
    }
    return defaultParams;
  });
  const [properties, setProperties] = useState({ surfaceArea: 0, volume: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const config = type ? getGeometryConfig(type) : null;

  useEffect(() => {
    if (!config || !mountRef.current) return;

    // 记录学习进度
    updateLearningProgress(type!);

    // 初始化场景 - 使用容器的实际尺寸
    const containerWidth = 800;
    const containerHeight = 384;
    const { scene, camera, renderer } = createSceneSetup(containerWidth, containerHeight);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // 添加光照和网格
    addBasicLighting(scene);
    if (showGrid) {
      addGridHelper(scene);
    }

    // 创建几何体
    const mesh = createGeometryMesh(type!, config.defaultParams);
    scene.add(mesh);
    meshRef.current = mesh;

    // 设置控制器
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let lastTouchDistance = 0; // 用于双指缩放

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseDown || !meshRef.current) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      // 统一所有几何体的旋转逻辑，确保丝滑的旋转体验
      switch (type) {
        case 'sphere':
          // 球体：使用更自然的旋转方式，避免"锁定"效果
          meshRef.current.rotation.y += deltaX * 0.01;
          meshRef.current.rotation.x += deltaY * 0.01;
          // 允许Z轴旋转，让球体看起来更自然
          meshRef.current.rotation.z += (deltaX + deltaY) * 0.005;
          break;
        default:
          // 立方体、圆环、四面体、圆柱体、圆锥体：统一使用标准旋转
          // 这样可以确保所有几何体都有相同的丝滑旋转体验
          meshRef.current.rotation.y += deltaX * 0.01;
          meshRef.current.rotation.x += deltaY * 0.01;
          // 添加Z轴旋转，让旋转更加自然和多维度
          meshRef.current.rotation.z += (deltaX - deltaY) * 0.003;
      }
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    // 触摸事件处理函数
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        mouseDown = true;
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
        event.preventDefault(); // 防止页面滚动
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!mouseDown || !meshRef.current || event.touches.length !== 1) return;
      
      const deltaX = event.touches[0].clientX - mouseX;
      const deltaY = event.touches[0].clientY - mouseY;
      
      // 统一所有几何体的旋转逻辑，确保丝滑的旋转体验
      switch (type) {
        case 'sphere':
          meshRef.current.rotation.y += deltaX * 0.01;
          meshRef.current.rotation.x += deltaY * 0.01;
          meshRef.current.rotation.z += (deltaX + deltaY) * 0.005;
          break;
        default:
          // 立方体、圆环、四面体、圆柱体、圆锥体：统一使用标准旋转
          // 这样可以确保所有几何体都有相同的丝滑旋转体验
          meshRef.current.rotation.y += deltaX * 0.01;
          meshRef.current.rotation.x += deltaY * 0.01;
          // 添加Z轴旋转，让旋转更加自然和多维度
          meshRef.current.rotation.z += (deltaX - deltaY) * 0.003;
      }
      
      mouseX = event.touches[0].clientX;
      mouseY = event.touches[0].clientY;
      event.preventDefault(); // 防止页面滚动
    };

    const handleTouchEnd = (event: TouchEvent) => {
      mouseDown = false;
      lastTouchDistance = 0; // 重置触摸距离
      event.preventDefault();
    };

    const handleTouchZoom = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !cameraRef.current) return;
      
      event.preventDefault();
      
      // 计算两个触摸点的距离
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (lastTouchDistance > 0) {
        const delta = distance - lastTouchDistance;
        const scale = delta > 0 ? 0.95 : 1.05; // 放大或缩小
        cameraRef.current.position.multiplyScalar(scale);
        cameraRef.current.lookAt(0, 0, 0);
      }
      
      lastTouchDistance = distance;
    };

    const handleMouseUp = () => {
      mouseDown = false;
    };

    const handleDoubleClick = () => {
      if (!cameraRef.current) return;
      // 重置相机位置到初始视角
      cameraRef.current.position.set(3, 3, 3);
      cameraRef.current.lookAt(0, 0, 0);
      // 重置几何体旋转
      if (meshRef.current) {
        meshRef.current.rotation.set(0, 0, 0);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!cameraRef.current) return;
      
      const delta = event.deltaY > 0 ? 1.1 : 0.9;
      cameraRef.current.position.multiplyScalar(delta);
      cameraRef.current.lookAt(0, 0, 0);
    };

    // 设置3D画布样式，确保正确嵌入
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    
    // 添加鼠标事件监听器
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);
    renderer.domElement.addEventListener('dblclick', handleDoubleClick);
    
    // 添加触摸事件监听器（iPad/手机支持）
    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    renderer.domElement.addEventListener('touchmove', handleTouchZoom, { passive: false }); // 双指缩放

    // 清空容器并添加3D画布
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      
      // 添加加载提示
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'absolute inset-0 flex items-center justify-center text-gray-400 text-center text-sm z-10';
      loadingDiv.innerHTML = `
        <div>
          <div class="text-2xl mb-2 animate-spin">🔄</div>
          <div>3D模型加载中...</div>
        </div>
      `;
      mountRef.current.appendChild(loadingDiv);
      
      // 添加3D画布
      mountRef.current.appendChild(renderer.domElement);
      
      // 2秒后移除加载提示
      setTimeout(() => {
        if (loadingDiv.parentNode) {
          loadingDiv.parentNode.removeChild(loadingDiv);
        }
      }, 2000);
    }

    // 动画循环
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      if (meshRef.current && autoRotate) {
        // 统一的自动旋转逻辑，让所有几何体旋转更自然
        switch (type) {
          case 'sphere':
            // 球体：多轴旋转，看起来更自然
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.x += 0.002;
            meshRef.current.rotation.z += 0.001;
            break;
          default:
            // 所有其他几何体：统一的旋转方式
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.x += 0.001;
            meshRef.current.rotation.z += 0.0005;
        }
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 计算初始属性
    const initialProps = calculateGeometryProperties(type!, config.defaultParams);
    setProperties(initialProps);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      // 移除鼠标事件监听器
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('dblclick', handleDoubleClick);
      
      // 移除触摸事件监听器
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      renderer.domElement.removeEventListener('touchmove', handleTouchZoom);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [config, type, showGrid, autoRotate]);

  // 更新几何体参数
  const updateParams = (newParams: Partial<typeof params>) => {
    if (!config || !meshRef.current) return;
    
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    
    // 更新几何体
    updateGeometryMesh(meshRef.current, type!, updatedParams);
    
    // 重新计算属性
    const newProps = calculateGeometryProperties(type!, updatedParams);
    setProperties(newProps);
  };

  if (!config) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">几何体类型不存在</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.name}</h1>
            <p className="text-gray-600">{config.description}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/learn/${type}`}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              📚 学习知识
            </Link>
            <Link
              to="/"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              🏠 返回首页
            </Link>
          </div>
        </div>

        {/* 几何属性 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {properties.surfaceArea.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">表面积</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {properties.volume.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">体积</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {config.formula.surfaceArea}
            </div>
            <div className="text-sm text-gray-600">表面积公式</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {config.formula.volume}
            </div>
            <div className="text-sm text-gray-600">体积公式</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D视图 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">3D模型展示</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    autoRotate 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {autoRotate ? '⏸️ 停止旋转' : '▶️ 自动旋转'}
                </button>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    showGrid 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showGrid ? '❌ 隐藏网格' : '➕ 显示网格'}
                </button>
              </div>
            </div>
            <div 
              ref={mountRef} 
              className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden relative select-none"
              style={{ touchAction: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
            >
              {/* 3D画布将在这里动态插入 */}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>💡 提示：拖拽鼠标/手指旋转模型，滚轮/双指缩放，双击重置视角</p>
            </div>
          </div>
        </div>

        {/* 参数控制面板 */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">参数调节</h3>
            
            {type === 'cube' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    宽度: {params.width.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={params.width}
                    onChange={(e) => updateParams({ width: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    高度: {params.height.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={params.height}
                    onChange={(e) => updateParams({ height: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    深度: {params.depth.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={params.depth}
                    onChange={(e) => updateParams({ depth: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {(type === 'sphere' || type === 'cylinder' || type === 'cone' || type === 'tetrahedron') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  半径: {params.radius.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={params.radius}
                  onChange={(e) => updateParams({ radius: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}

            {(type === 'cylinder' || type === 'cone') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  高度: {params.height.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.1"
                  value={params.height}
                  onChange={(e) => updateParams({ height: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}

            {type === 'torus' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主半径: {params.radius.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="3"
                    step="0.1"
                    value={params.radius}
                    onChange={(e) => updateParams({ radius: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    管半径: {params.tube.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={params.tube}
                    onChange={(e) => updateParams({ tube: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 几何性质 */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">几何性质</h3>
            <ul className="space-y-2">
              {config.properties.map((property, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{property}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}