import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, SunMoon, Palette, Type } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const UISettings = () => {
  const { settings, toggleTheme, setFontSize, setPrimaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState<'theme' | 'colors' | 'typography'>('theme');
  
  const colorOptions: { name: string; value: 'blue' | 'purple' | 'green' | 'indigo' | 'rose' }[] = [
    { name: 'Blue', value: 'blue' },
    { name: 'Purple', value: 'purple' },
    { name: 'Green', value: 'green' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Rose', value: 'rose' },
  ];
  
  const fontSizeOptions: { name: string; value: 'small' | 'medium' | 'large' }[] = [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' },
  ];
  
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-8">
        UI Settings
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-4">
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === 'theme'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('theme')}
          >
            <div className="flex items-center">
              <SunMoon size={18} className="mr-2" />
              Theme
            </div>
          </button>
          
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === 'colors'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('colors')}
          >
            <div className="flex items-center">
              <Palette size={18} className="mr-2" />
              Colors
            </div>
          </button>
          
          <button
            className={`px-4 py-3 font-medium ${
              activeTab === 'typography'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('typography')}
          >
            <div className="flex items-center">
              <Type size={18} className="mr-2" />
              Typography
            </div>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === 'theme' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Light / Dark Mode
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'light'
                      ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                  onClick={() => {
                    if (settings.theme !== 'light') toggleTheme();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Light Mode
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Bright theme for day use
                      </div>
                    </div>
                    {settings.theme === 'light' && (
                      <div className="text-primary-600 dark:text-primary-400">
                        <Check size={20} />
                      </div>
                    )}
                  </div>
                </button>
                
                <button
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'dark'
                      ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                  onClick={() => {
                    if (settings.theme !== 'dark') toggleTheme();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Dark Mode
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Dark theme for night use
                      </div>
                    </div>
                    {settings.theme === 'dark' && (
                      <div className="text-primary-600 dark:text-primary-400">
                        <Check size={20} />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'colors' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Primary Color
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {colorOptions.map((color) => {
                  const colorClass = `bg-primary-${color.value}-500`;
                  return (
                    <button
                      key={color.value}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.primaryColor === color.value
                          ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      }`}
                      onClick={() => setPrimaryColor(color.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className={`w-6 h-6 rounded-full mr-3 ${colorClass}`}
                            style={{
                              backgroundColor: 
                                color.value === 'blue' ? '#0ea5e9' :
                                color.value === 'purple' ? '#a855f7' :
                                color.value === 'green' ? '#22c55e' :
                                color.value === 'indigo' ? '#6366f1' :
                                '#f43f5e'  // rose
                            }}
                          />
                          <div className="font-medium text-gray-900 dark:text-white">
                            {color.name}
                          </div>
                        </div>
                        {settings.primaryColor === color.value && (
                          <div className="text-primary-600 dark:text-primary-400">
                            <Check size={20} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'typography' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Font Size
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fontSizeOptions.map((size) => (
                  <button
                    key={size.value}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.fontSize === size.value
                        ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                    onClick={() => setFontSize(size.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div 
                          className="font-medium text-gray-900 dark:text-white"
                          style={{
                            fontSize: 
                              size.value === 'small' ? '0.9rem' :
                              size.value === 'large' ? '1.1rem' :
                              '1rem'
                          }}
                        >
                          {size.name}
                        </div>
                        <div 
                          className="text-sm text-gray-600 dark:text-gray-400"
                          style={{
                            fontSize: 
                              size.value === 'small' ? '0.8rem' :
                              size.value === 'large' ? '1rem' :
                              '0.875rem'
                          }}
                        >
                          Text example
                        </div>
                      </div>
                      {settings.fontSize === size.value && (
                        <div className="text-primary-600 dark:text-primary-400">
                          <Check size={20} />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Preview
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  This is how your text will look with the selected font size.
                </p>
                <h4 className="text-xl font-medium text-gray-900 dark:text-white mt-4 mb-2">
                  Heading Example
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                  <span>Current setting:</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {settings.fontSize.charAt(0).toUpperCase() + settings.fontSize.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UISettings; 