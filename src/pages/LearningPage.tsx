import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { getGeometryConfig } from '../data/geometryData';
import { addPracticeRecord } from '../utils/storage';

export default function LearningPage() {
  const { type } = useParams<{ type: string }>();
  const config = type ? getGeometryConfig(type) : null;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

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

  // 生成练习题
  const generateQuestion = () => {
    const questions = [
      {
        type: 'surfaceArea',
        question: `如果一个${config.name}的边长为2，那么它的表面积是多少？`,
        answer: 24, // 6 * 2²
        formula: config.formula.surfaceArea
      },
      {
        type: 'volume',
        question: `如果一个${config.name}的边长为3，那么它的体积是多少？`,
        answer: 27, // 3³
        formula: config.formula.volume
      },
      {
        type: 'reverse',
        question: `一个${config.name}的表面积是54，那么它的边长是多少？`,
        answer: 3, // √(54/6)
        formula: config.formula.surfaceArea
      }
    ];
    
    return questions[currentQuestion % questions.length];
  };

  const question = generateQuestion();

  const handleSubmit = () => {
    const answer = parseFloat(userAnswer);
    const correct = Math.abs(answer - question.answer) < 0.01;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    // 记录练习结果
    addPracticeRecord({
      geometryType: type!,
      question: question.question,
      answer: question.answer,
      userAnswer: answer,
      isCorrect: correct
    });
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setUserAnswer('');
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.name} - 知识学习</h1>
            <p className="text-gray-600">{config.description}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/geometry/${type}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              📐 3D模型
            </Link>
            <Link
              to="/"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              🏠 返回首页
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 公式和性质 */}
        <div className="space-y-6">
          {/* 计算公式 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📐</span>
              计算公式
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">表面积公式</h4>
                <div className="text-lg font-mono text-blue-600">
                  {config.formula.surfaceArea}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">体积公式</h4>
                <div className="text-lg font-mono text-green-600">
                  {config.formula.volume}
                </div>
              </div>
            </div>
          </div>

          {/* 几何性质 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🔍</span>
              几何性质
            </h3>
            <ul className="space-y-3">
              {config.properties.map((property, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{property}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 学习要点 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              学习要点
            </h3>
            <ul className="space-y-3">
              {config.learningTips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-yellow-500 mt-1">💡</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 练习题 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2">✏️</span>
                互动练习
              </h3>
              <div className="text-sm text-gray-600">
                得分: {score}/{currentQuestion + (showResult ? 1 : 0)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">第 {currentQuestion + 1} 题</h4>
                <p className="text-gray-700 mb-4">{question.question}</p>
                
                {showResult && (
                  <div className={`p-3 rounded-lg mb-4 ${
                    isCorrect 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      <span className="mr-2">{isCorrect ? '✅' : '❌'}</span>
                      <span>
                        {isCorrect 
                          ? '回答正确！' 
                          : `回答错误。正确答案是 ${question.answer}`
                        }
                      </span>
                    </div>
                    <div className="text-sm mt-2">
                      使用公式: {question.formula}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="请输入答案"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={showResult}
                  />
                  
                  {!showResult ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!userAnswer}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      提交答案
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                    >
                      下一题
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 学习建议 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              解题提示
            </h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>• 仔细阅读题目，确定已知条件和要求</li>
              <li>• 选择合适的几何公式进行计算</li>
              <li>• 注意单位的统一和换算</li>
              <li>• 计算完成后检查结果是否合理</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}