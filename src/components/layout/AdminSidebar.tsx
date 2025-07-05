import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FolderKanban, Settings, MessageSquare, Star, LogOut, Sliders, UserCog, Briefcase } from 'lucide-react';

interface AdminSidebarProps {
  closeSidebar: () => void;
}

const AdminSidebar = ({ closeSidebar }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderKanban size={20} /> },
    { name: 'Services', path: '/admin/services', icon: <Settings size={20} /> },
    { name: 'Work Experience', path: '/admin/experiences', icon: <Briefcase size={20} /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <Star size={20} /> },
    { name: 'Contact Messages', path: '/admin/contacts', icon: <MessageSquare size={20} /> },
  ];

  const settingsItems = [
    { name: 'UI Settings', path: '/admin/settings/ui', icon: <Sliders size={20} /> },
    { name: 'Profile', path: '/admin/settings/profile', icon: <UserCog size={20} /> },
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="font-display text-xl font-bold text-primary-600 dark:text-primary-400">
          Admin Panel
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
            onClick={closeSidebar}
            end={item.path === '/admin'}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Settings
          </div>
          {settingsItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;