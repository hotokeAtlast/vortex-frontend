import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // If someone manually types /profile without logging in
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">You must be anchored to view this page.</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  
  const ADMIN_EMAIL = "hotoke.atlast@gmail.com";
  const isAdmin = currentUser.email === ADMIN_EMAIL;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        
        {/* Header/Cover Area */}
        <div className="h-32 bg-gradient-to-r from-amber-600 to-amber-900"></div>
        
        <div className="px-8 pb-8 relative">
          
          {/* Profile Picture */}
          <div className="absolute -top-12 border-4 border-white dark:border-gray-900 rounded-full bg-gray-100 dark:bg-gray-800 h-24 w-24 flex items-center justify-center overflow-hidden shadow-lg">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} className="text-5xl text-gray-400" />
            )}
          </div>

          <div className="pt-16">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {currentUser.displayName || "Unknown Wanderer"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{currentUser.email}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 my-8"></div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/orders" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <div className="bg-amber-100 dark:bg-amber-500/10 p-3 rounded-lg text-amber-600 dark:text-amber-500">
                <FontAwesomeIcon icon={faBox} size="lg" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">Order History</h3>
                <p className="text-xs text-gray-500">View your past transactions</p>
              </div>
            </Link>

            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <div className="bg-purple-100 dark:bg-purple-500/10 p-3 rounded-lg text-purple-600 dark:text-purple-500">
                  <span className="font-bold font-serif text-lg leading-none">A</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">The Forge (Admin)</h3>
                  <p className="text-xs text-gray-500">Add new artifacts</p>
                </div>
              </Link>
            )}
          </div>

          <button onClick={handleLogout} className="mt-8 w-full py-4 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors flex justify-center items-center gap-2">
            <FontAwesomeIcon icon={faSignOutAlt} /> Disengage Anchor
          </button>

        </div>
      </div>
    </div>
  );
}