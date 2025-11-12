import { Link } from 'react-router-dom';
import { geometryCategories, getAllGeometryTypes, getGeometryConfig } from '../data/geometryData';
import { getLearningProgress, getLearningStats } from '../utils/storage';
import { useEffect, useState } from 'react';

export default function Home() {
  const [learningProgress, setLearningProgress] = useState(getLearningProgress());
  const [stats, setStats] = useState(getLearningStats());

  useEffect(() => {
    // 监听存储变化，更新进度
    const handleStorageChange = () => {
      setLearningProgress(getLearningProgress());
      setStats(getLearningStats());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getProgressForGeometry = (geometryType: string) => {
    const progress = learningProgress.find(p => p.type === geometryType);
    return progress ? progress.masteryLevel : 0;
  };

  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">欢迎来到立体几何学习世界</h1>
        <p className="text-xl opacity-90 mb-6">
          通过3D可视化模型，让抽象的立体几何变得直观易懂
        </p>
        <div className="flex justify-center space-x-8 text-sm">
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <div className="font-semibold">{stats.totalVisits}</div>
            <div>总访问次数</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <div className="font-semibold">{stats.avgMastery}%</div>
            <div>平均掌握程度</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <div className="font-semibold">{stats.totalPractices}</div>
            <div>练习题目数</div>
          </div>
        </div>
      </div>

      {/* 几何体分类 */}
      <div className="space-y-6">
        {geometryCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{category.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.geometries.map((geometryType) => {
                const config = getGeometryConfig(geometryType);
                const progress = getProgressForGeometry(geometryType);
                
                if (!config) return null;
                
                return (
                  <div key={geometryType} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {config.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {config.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl mb-1">📐</div>
                        <div className="text-xs text-gray-500">
                          掌握度: {progress}%
                        </div>
                      </div>
                    </div>
                    
                    {/* 进度条 */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/geometry/${geometryType}`}
                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm text-center hover:bg-blue-600 transition-colors"
                      >
                        3D查看
                      </Link>
                      <Link
                        to={`/learn/${geometryType}`}
                        className="flex-1 bg-green-500 text-white px-3 py-2 rounded-md text-sm text-center hover:bg-green-600 transition-colors"
                      >
                        学习
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 学习建议 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          学习建议
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
          <div>
            <h4 className="font-medium mb-2">🎯 循序渐进</h4>
            <p>建议从基础几何体开始，逐步学习进阶内容</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">🔄 多角度观察</h4>
            <p>使用鼠标拖拽旋转3D模型，从不同角度观察几何体</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">📏 参数调节</h4>
            <p>尝试调节几何体的参数，观察形状和属性的变化</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">✏️ 动手练习</h4>
            <p>完成练习题，巩固对几何体性质的理解</p>
          </div>
        </div>
      </div>
    </div>
  );
}