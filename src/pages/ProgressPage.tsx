import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getLearningProgress, 
  getPracticeRecords, 
  getLearningStats, 
  clearAllData, 
  exportLearningData 
} from '../utils/storage';
import { getGeometryConfig } from '../data/geometryData';

export default function ProgressPage() {
  const [progress, setProgress] = useState(getLearningProgress());
  const [records, setRecords] = useState(getPracticeRecords());
  const [stats, setStats] = useState(getLearningStats());

  useEffect(() => {
    // 监听存储变化
    const handleStorageChange = () => {
      setProgress(getLearningProgress());
      setRecords(getPracticeRecords());
      setStats(getLearningStats());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleClearData = () => {
    if (confirm('确定要清除所有学习数据吗？此操作不可恢复。')) {
      clearAllData();
      setProgress([]);
      setRecords([]);
      setStats(getLearningStats());
    }
  };

  const handleExportData = () => {
    exportLearningData();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">学习进度</h1>
            <p className="text-gray-600">查看你的学习轨迹和掌握情况</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleExportData}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              📥 导出数据
            </button>
            <button
              onClick={handleClearData}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              🗑️ 清除数据
            </button>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalVisits}</div>
            <div className="text-sm text-gray-600">总访问次数</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.avgMastery}%</div>
            <div className="text-sm text-gray-600">平均掌握度</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalPractices}</div>
            <div className="text-sm text-gray-600">练习次数</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.accuracy}%</div>
            <div className="text-sm text-gray-600">正确率</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 学习进度 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📚</span>
            几何体学习进度
          </h3>
          
          {progress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📖</div>
              <p>还没有学习记录，快去开始学习吧！</p>
              <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
                开始学习
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {progress.map((item) => {
                const config = getGeometryConfig(item.type);
                if (!config) return null;
                
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📐</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{config.name}</h4>
                          <p className="text-sm text-gray-600">
                            访问 {item.visitCount} 次
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {item.masteryLevel}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(item.lastVisit)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.masteryLevel}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <Link
                        to={`/geometry/${item.type}`}
                        className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm text-center hover:bg-blue-600 transition-colors"
                      >
                        3D查看
                      </Link>
                      <Link
                        to={`/learn/${item.type}`}
                        className="flex-1 bg-green-500 text-white px-3 py-1 rounded text-sm text-center hover:bg-green-600 transition-colors"
                      >
                        学习
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 练习记录 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">✏️</span>
            最近练习记录
          </h3>
          
          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <p>还没有练习记录</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {records.slice(-10).reverse().map((record) => (
                <div 
                  key={record.id} 
                  className={`border rounded-lg p-3 ${
                    record.isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {record.isCorrect ? '✅' : '❌'}
                      </span>
                      <span className="font-medium text-gray-800">
                        {getGeometryConfig(record.geometryType)?.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(record.timestamp)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-2">
                    {record.question}
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    你的答案: {record.userAnswer} | 
                    正确答案: {record.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 学习建议 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          个性化学习建议
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.avgMastery < 50 && (
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 基础巩固</h4>
              <p className="text-sm text-blue-700">
                你的平均掌握度较低，建议多花时间观察3D模型，理解基本概念和公式。
              </p>
            </div>
          )}
          
          {stats.accuracy < 70 && (
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">✏️ 练习加强</h4>
              <p className="text-sm text-orange-700">
                练习正确率有待提高，建议多做练习题，注意计算过程和单位换算。
              </p>
            </div>
          )}
          
          {progress.length === 0 && (
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🚀 开始学习</h4>
              <p className="text-sm text-green-700">
                你还没有开始学习，建议从立方体开始，逐步探索其他几何体。
              </p>
            </div>
          )}
          
          {stats.avgMastery >= 80 && (
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🏆 进阶挑战</h4>
              <p className="text-sm text-purple-700">
                你的掌握度很高！可以尝试更复杂的几何体，或挑战更难的计算题。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}