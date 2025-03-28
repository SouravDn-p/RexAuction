import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import SettingsNav from './SettingsNav';
import ThemeContext from '../Context/ThemeContext';

const SettingsLayout = () => {
    const { isDarkMode } = useContext(ThemeContext);
    
    return (
        <div className={`max-w-8xl mx-auto px-4 py-8 ${
            isDarkMode 
                ? 'bg-gray-800 text-gray-100' 
                : 'bg-white text-gray-800'
        }`}>
            <h1 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-black'
            }`}>
                Settings
            </h1>
            <p className={`mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
                Manage your account settings and preferences.
            </p>
            
            <SettingsNav />
            
            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
};

export default SettingsLayout;