import React from 'react';
import { ArrowRight, Users, Shield, Clock, Zap, CheckCircle, Target, Globe, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Real-time Support
              <span className="block text-blue-400">Coordination Platform</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect supporters with communities in need. Submit offers, get routed to the right teams, and track impact in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/submit"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Plus className="mr-2 h-5 w-5" />
                Get Started
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-300 font-semibold rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-all duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple steps to connect your support with those who need it most
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Submit Your Offer</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your skills, time, or resources through our simple form
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. Smart Routing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our system matches you with teams that need your specific help
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Make Impact</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your contributions and see the real-time impact you're making
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for efficiency, security, and maximum impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor support requests and responses in real-time with live updates
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <Shield className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure Login</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Protected access with secure authentication and user verification
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <CheckCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Image Moderation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automated content review ensures appropriate and safe submissions
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <Users className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Team Coordination</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seamless communication between supporters and coordination teams
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <Globe className="h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Global Reach</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect supporters worldwide with local and international needs
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <Target className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Smart Matching</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered routing to match skills with specific needs efficiently
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of supporters making real impact in communities worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;