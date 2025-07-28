import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Users, Menu, X, Home, Info, LayoutDashboard, Mail, FilePlus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { FaUserAlt } from 'react-icons/fa'; // Default user icon

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false); // Dropdown state for user profile
  const { isLoggedIn, logout, profile } = useAuth(); // Get the user profile from context

  // Get the avatar URL from the profile, or use default icon
  const avatarUrl = profile?.avatar_url || null;

  // Public nav items
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="inline h-5 w-5 mr-1" /> },
    { path: '/about', label: 'About', icon: <Info className="inline h-5 w-5 mr-1" /> },
    { path: '/contact', label: 'Contact', icon: <Mail className="inline h-5 w-5 mr-1" /> },
  ];

  // Protected nav items
  const protectedNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="inline h-5 w-5 mr-1" /> },
    { path: '/submit', label: 'Submit Report', icon: <FilePlus className="inline h-5 w-5 mr-1" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">
              CrowdReport
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  location.pathname === item.path
                    ? 'text-blue-400 bg-blue-900/20'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {/* Protected Links */}
            {isLoggedIn && protectedNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  location.pathname === item.path
                    ? 'text-blue-400 bg-blue-900/20'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* Profile and Sign Out */}
            {isLoggedIn && (
              <div className="relative">
                <button 
                  onClick={() => setIsDropDownOpen(!isDropDownOpen)} // Dropdown toggle onClick
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className="flex items-center">
                    {/* User Profile */}
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                      <FaUserAlt className="text-gray-400 w-8 h-8" />
                    )}
                    <span className="ml-2 text-white">{profile?.username || 'Profile'}</span>
                  </div>
                </button>
                {/* Show dropdown only on click */}
                {isDropDownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-700">Your Profile</Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-700">Manage Reports</Link>
                    <button 
                      onClick={logout} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SignUp/Login/Logout Button */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 ml-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors ml-2"
              >
                Logout
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* User Profile */}
            {isLoggedIn && (
              <div className="flex items-center space-x-2">
                <div>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <FaUserAlt className="text-gray-400 w-8 h-8" />
                  )}
                </div>
                <span className="text-white">{profile?.username}</span>
              </div>
            )}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-300"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center ${
                  location.pathname === item.path
                    ? 'text-blue-400 bg-blue-900/20'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {/* Protected Links */}
            {isLoggedIn && protectedNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center ${
                  location.pathname === item.path
                    ? 'text-blue-400 bg-blue-900/20'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {/* Signup/Login/Logout Button */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 mt-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 mt-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full px-3 py-2 mt-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-center"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
