import { Link, useLocation } from 'react-router-dom';
import { getLearningStats } from '../utils/storage';

export default function Navigation() {
  const location = useLocation();
  const stats = getLearningStats();

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/progress', label: '学习进度', icon: '📊' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">📐</span>
              <span className="text-xl font-bold text-gray-800">立体几何学习</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>📈</span>
              <span>总体进度: {stats.avgMastery}%</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>✅</span>
              <span>练习正确率: {stats.accuracy}%</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}