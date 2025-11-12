import { LearningProgress, PracticeRecord, AppConfig } from '../types/geometry';

// 本地存储键名常量
const STORAGE_KEYS = {
  PROGRESS: 'geometry_learning_progress',
  PRACTICE: 'geometry_practice_records',
  CONFIG: 'geometry_app_config',
  CURRENT_GEOMETRY: 'geometry_current_type'
} as const;

// 应用配置默认值
const DEFAULT_CONFIG: AppConfig = {
  theme: 'light',
  language: 'zh-CN',
  autoRotate: true,
  showGrid: true,
  version: '1.0.0'
};

/**
 * 获取应用配置
 */
export const getAppConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
  } catch (error) {
    console.warn('Failed to load app config:', error);
    return DEFAULT_CONFIG;
  }
};

/**
 * 保存应用配置
 */
export const saveAppConfig = (config: Partial<AppConfig>): void => {
  try {
    const currentConfig = getAppConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save app config:', error);
  }
};

/**
 * 获取学习进度
 */
export const getLearningProgress = (): LearningProgress[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load learning progress:', error);
    return [];
  }
};

/**
 * 更新学习进度
 */
export const updateLearningProgress = (geometryType: string): void => {
  try {
    const progress = getLearningProgress();
    const existing = progress.find(p => p.type === geometryType);
    
    if (existing) {
      // 更新现有记录
      existing.visitCount += 1;
      existing.lastVisit = new Date();
      existing.masteryLevel = Math.min(100, existing.masteryLevel + 2);
    } else {
      // 创建新记录
      progress.push({
        id: geometryType,
        type: geometryType,
        visitCount: 1,
        lastVisit: new Date(),
        practiceScore: 0,
        masteryLevel: 5
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to update learning progress:', error);
  }
};

/**
 * 获取练习记录
 */
export const getPracticeRecords = (): PracticeRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRACTICE);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load practice records:', error);
    return [];
  }
};

/**
 * 添加练习记录
 */
export const addPracticeRecord = (record: Omit<PracticeRecord, 'id' | 'timestamp'>): void => {
  try {
    const records = getPracticeRecords();
    const newRecord: PracticeRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.PRACTICE, JSON.stringify(records));
    
    // 同时更新学习进度
    updateLearningProgress(record.geometryType);
  } catch (error) {
    console.warn('Failed to add practice record:', error);
  }
};

/**
 * 获取当前几何体类型
 */
export const getCurrentGeometry = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_GEOMETRY) || 'cube';
  } catch (error) {
    console.warn('Failed to get current geometry:', error);
    return 'cube';
  }
};

/**
 * 设置当前几何体类型
 */
export const setCurrentGeometry = (geometryType: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_GEOMETRY, geometryType);
  } catch (error) {
    console.warn('Failed to set current geometry:', error);
  }
};

/**
 * 获取学习统计
 */
export const getLearningStats = () => {
  const progress = getLearningProgress();
  const records = getPracticeRecords();
  
  const totalVisits = progress.reduce((sum, p) => sum + p.visitCount, 0);
  const avgMastery = progress.length > 0 
    ? progress.reduce((sum, p) => sum + p.masteryLevel, 0) / progress.length 
    : 0;
  const totalPractices = records.length;
  const correctPractices = records.filter(r => r.isCorrect).length;
  const accuracy = totalPractices > 0 ? (correctPractices / totalPractices) * 100 : 0;
  
  return {
    totalVisits,
    avgMastery: Math.round(avgMastery),
    totalPractices,
    correctPractices,
    accuracy: Math.round(accuracy)
  };
};

/**
 * 清除所有数据
 */
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear data:', error);
  }
};

/**
 * 导出学习数据
 */
export const exportLearningData = () => {
  const data = {
    progress: getLearningProgress(),
    records: getPracticeRecords(),
    config: getAppConfig(),
    exportTime: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `geometry-learning-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};