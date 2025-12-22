import { Suspense } from 'react';
import Link from 'next/link';
import RegisterForm from '@/app/components/RegisterForm';
import { Brain, Shield } from 'lucide-react';

export const metadata = {
  title: 'Sign Up - MindCare AI',
  description: 'Register for MindCare AI mental health support platform',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Marketing */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Join MindCare AI
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Support mental health with our AI-powered platform. Whether you're a patient seeking support, a researcher studying mental health, or a data scientist analyzing patterns—find your role.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Patient/User</h3>
                    <p className="text-gray-600 text-sm mt-1">Access 24/7 AI mental health support and mood tracking</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Researcher</h3>
                    <p className="text-gray-600 text-sm mt-1">Conduct research on mental health patterns and insights</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0">
                    
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Scientist</h3>
                    <p className="text-gray-600 text-sm mt-1">Analyze and visualize mental health analytics</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">Admin</h3>
                    <p className="text-gray-600 text-sm mt-1">Manage users, resources, and platform settings</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-blue-600 font-semibold hover:text-blue-700">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600 mt-2">Fill in your details to get started</p>
            </div>

            <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
              <RegisterForm />
            </Suspense>

            <p className="text-center text-sm text-gray-600 mt-6">
              By signing up, you agree to our{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}