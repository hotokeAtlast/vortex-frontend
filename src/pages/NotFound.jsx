import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-700 px-4 text-center">
      <div className="relative mb-8">
        <FontAwesomeIcon icon={faGhost} className="text-9xl text-gray-200 dark:text-gray-800 animate-bounce" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-black text-amber-500 drop-shadow-md">404</span>
        </div>
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
        Lost in the Void
      </h1>
      
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mb-8">
        The artifact or dimension you are searching for does not exist in the Vortex Archives. It may have been destroyed, or it never existed at all.
      </p>
      
      <Link 
        to="/" 
        className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center gap-3 active:scale-95"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Return to Reality
      </Link>
    </div>
  );
}