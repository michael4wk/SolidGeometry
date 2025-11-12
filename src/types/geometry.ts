// 几何体配置接口
export interface GeometryConfig {
  type: string;                 // 几何体类型
  name: string;                 // 显示名称
  description: string;          // 描述信息
  defaultParams: GeometryParams; // 默认参数
  formula: {                    // 计算公式
    surfaceArea: string;        // 表面积公式
    volume: string;            // 体积公式
  };
  properties: string[];         // 几何性质列表
  learningTips: string[];      // 学习要点
}

// 几何体参数接口
export interface GeometryParams {
  radius?: number;      // 半径（球体、圆柱、圆锥等）
  width?: number;       // 宽度（立方体）
  height?: number;      // 高度（立方体、圆柱、圆锥等）
  depth?: number;       // 深度（立方体）
  tube?: number;       // 圆环体内径
}

// 学习进度接口
export interface LearningProgress {
  id: string;           // 几何体类型ID
  type: string;         // 几何体名称
  visitCount: number;   // 访问次数
  lastVisit: Date;      // 最后访问时间
  practiceScore: number; // 练习得分
  masteryLevel: number;  // 掌握程度(0-100)
}

// 练习记录接口
export interface PracticeRecord {
  id: string;
  geometryType: string; // 几何体类型
  question: string;     // 题目内容
  answer: number;       // 正确答案
  userAnswer: number;   // 用户答案
  isCorrect: boolean;   // 是否正确
  timestamp: Date;      // 答题时间
}

// 应用配置接口
export interface AppConfig {
  theme: 'light' | 'dark';      // 主题设置
  language: 'zh-CN';            // 语言设置
  autoRotate: boolean;          // 3D模型自动旋转
  showGrid: boolean;            // 显示网格
  version: string;              // 应用版本
}

// 几何体分类接口
export interface GeometryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  geometries: string[]; // 包含的几何体类型
}