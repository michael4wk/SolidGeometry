import { GeometryConfig } from '../types/geometry';

// 几何体配置数据
export const geometryConfigs: Record<string, GeometryConfig> = {
  cube: {
    type: 'cube',
    name: '立方体',
    description: '六个面都是正方形的立体几何体，是最基础的几何体之一',
    defaultParams: { width: 2, height: 2, depth: 2 },
    formula: {
      surfaceArea: 'S = 6a²',
      volume: 'V = a³'
    },
    properties: [
      '六个面都是正方形',
      '十二条棱长度相等',
      '八个顶点',
      '对角线长度为 a√3',
      '具有高度的对称性'
    ],
    learningTips: [
      '观察立方体的展开图，理解面与面的关系',
      '通过实际测量理解边长与表面积、体积的关系',
      '想象立方体的截面形状'
    ]
  },
  sphere: {
    type: 'sphere',
    name: '球体',
    description: '所有点到中心距离相等的几何体，是自然界中最常见的形状',
    defaultParams: { radius: 1 },
    formula: {
      surfaceArea: 'S = 4πr²',
      volume: 'V = (4/3)πr³'
    },
    properties: [
      '所有点到球心距离相等',
      '截面都是圆形',
      '具有完美的对称性',
      '表面积与半径平方成正比',
      '体积与半径立方成正比'
    ],
    learningTips: [
      '观察球体的截面变化',
      '理解球体与圆的关系',
      '通过实验理解球体的表面积和体积公式'
    ]
  },
  cylinder: {
    type: 'cylinder',
    name: '圆柱体',
    description: '由两个平行的圆形底面和一个曲面组成的几何体',
    defaultParams: { radius: 1, height: 2 },
    formula: {
      surfaceArea: 'S = 2πr² + 2πrh',
      volume: 'V = πr²h'
    },
    properties: [
      '两个底面是全等的圆',
      '侧面展开是矩形',
      '轴线垂直于底面',
      '具有旋转对称性',
      '截面形状多样'
    ],
    learningTips: [
      '观察圆柱体的展开图',
      '理解圆柱体与圆的关系',
      '通过实际物体理解圆柱体的特征'
    ]
  },
  cone: {
    type: 'cone',
    name: '圆锥体',
    description: '由一个圆形底面和一个顶点组成的几何体',
    defaultParams: { radius: 1, height: 2 },
    formula: {
      surfaceArea: 'S = πr² + πrl',
      volume: 'V = (1/3)πr²h'
    },
    properties: [
      '底面是圆形',
      '顶点与底面圆心连线垂直于底面',
      '侧面展开是扇形',
      '具有旋转对称性',
      '体积是同底同高圆柱体的1/3'
    ],
    learningTips: [
      '观察圆锥体的展开图',
      '理解圆锥体与圆柱体的关系',
      '通过实验验证体积公式'
    ]
  },
  torus: {
    type: 'torus',
    name: '圆环体',
    description: '由圆绕轴旋转形成的几何体，形状类似甜甜圈',
    defaultParams: { radius: 1, tube: 0.3 },
    formula: {
      surfaceArea: 'S = 4π²Rr',
      volume: 'V = 2π²Rr²'
    },
    properties: [
      '由圆绕轴旋转形成',
      '具有环形结构',
      '截面形状复杂',
      '具有高度的对称性',
      '在自然界和工程中常见'
    ],
    learningTips: [
      '想象圆环体的形成过程',
      '观察圆环体的截面变化',
      '理解旋转体的概念'
    ]
  },
  tetrahedron: {
    type: 'tetrahedron',
    name: '四面体',
    description: '由四个三角形面组成的多面体，是最简单的多面体',
    defaultParams: { radius: 2 },
    formula: {
      surfaceArea: 'S = √3a²',
      volume: 'V = (a³√2)/12'
    },
    properties: [
      '四个面都是三角形',
      '六条棱',
      '四个顶点',
      '最简单的多面体',
      '具有高度的对称性'
    ],
    learningTips: [
      '观察四面体的展开图',
      '理解多面体的基本概念',
      '通过模型制作理解结构'
    ]
  }
};

// 几何体分类数据
export const geometryCategories = [
  {
    id: 'basic',
    name: '基础几何体',
    icon: '📦',
    description: '最常见的立体几何体',
    geometries: ['cube', 'sphere', 'cylinder']
  },
  {
    id: 'advanced',
    name: '进阶几何体',
    icon: '🔬',
    description: '稍复杂的立体几何体',
    geometries: ['cone', 'torus', 'tetrahedron']
  }
];

// 获取几何体配置
export const getGeometryConfig = (type: string): GeometryConfig | undefined => {
  return geometryConfigs[type];
};

// 获取所有几何体类型
export const getAllGeometryTypes = (): string[] => {
  return Object.keys(geometryConfigs);
};

// 获取分类下的几何体
export const getGeometriesByCategory = (categoryId: string): string[] => {
  const category = geometryCategories.find(cat => cat.id === categoryId);
  return category?.geometries || [];
};