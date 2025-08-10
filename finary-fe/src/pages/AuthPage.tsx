import React, { useState } from 'react';
import LoginForm from '../components/auth/Login';
import SignupForm from '../components/auth/Signup';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Take Control of Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Track expenses, set budgets, achieve goals, and make informed financial decisions with our comprehensive dashboard.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-green-600 mb-2">$2M+</div>
                <div className="text-gray-600">Money Managed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {isLogin ? (
              <LoginForm onToggleMode={toggleMode} />
            ) : (
              <SignupForm onToggleMode={toggleMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;