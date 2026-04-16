import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="bg-gray-900 dark:bg-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-700 flex items-center gap-3">
        <FontAwesomeIcon icon={faCheckCircle} className="text-amber-500 text-xl" />
        <p className="font-medium text-sm">{toastMessage}</p>
      </div>
    </div>
  );
}