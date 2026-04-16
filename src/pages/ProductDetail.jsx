// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCartPlus,
  faMinus,
  faPlus,
  faShoppingCart,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtifact = async () => {
      try {
        // Fetching from Firestore collection 'products'
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Artifact lost to the gray mist!");
        }
      } catch (error) {
        console.error("Error divining item:", error);
      } finally {
        setLoading(false);
      }
    };

    // For testing, if no DB is set up yet, fallback to the Slumber Charm
    if (id === "slumber-charm") {
      setProduct({
        id: "slumber-charm",
        name: "Slumber Charm",
        price: "150 Pounds",
        tag: "Artifact",
        sequence: "Sequence 7 - Nightmare",
        description:
          "Crafted under the light of the Crimson Moon. Induces immediate, deep sleep in the target within a 10-meter radius. A must-have for discreet operations. Warning: Do not carry near unstable spiritual entities.",
        stock: 5,
        specs: [
          { label: "Material", value: "Silver, Night-bloom extract" },
          { label: "Duration", value: "2-4 Hours" },
          { label: "Side Effects", value: "Mild grogginess" },
        ],
      });
      setLoading(false);
    } else {
      fetchArtifact();
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-amber-500 animate-pulse">
        <FontAwesomeIcon icon={faMoon} spin size="3x" />
      </div>
    );
  if (!product)
    return (
      <div className="text-center text-red-500 mt-20">
        Item not found in this epoch.
      </div>
    );

  const increment = () =>
    setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors mb-8 font-medium">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Archives
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Image */}
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 group">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700 transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <span className="text-xs uppercase tracking-widest font-bold">No visual record found</span>
            </div>
          )}
          
          <div className="absolute top-6 left-6 bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest border border-gray-200 dark:border-white/10 shadow-lg">
            {product.tag}
          </div>
        </div>

        {/* RIGHT COLUMN: Details */}
        <div className="flex flex-col justify-center">
          
          {/* Header Info */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {product.name}
            </h1>
            {product.sequence && (
              <p className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-500 font-bold rounded-lg text-sm tracking-wide border border-amber-200 dark:border-amber-500/20 mb-6">
                {product.sequence}
              </p>
            )}
            <p className="text-3xl font-black text-amber-600 dark:text-amber-500">
              {product.price}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Dynamic Properties (Specs) Grid */}
          {product.specs && product.specs.length > 0 && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                {product.tag} Properties
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex justify-between sm:block border-b sm:border-0 border-gray-200 dark:border-gray-700 pb-2 sm:pb-0">
                      <dt className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        {spec.label}
                      </dt>
                      <dd className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* Action Section */}
          <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Availability</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-lg inline-block w-max ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20' 
                  : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
              }`}>
                {product.stock > 0 ? `${product.stock} Units in Vault` : 'Completely Depleted'}
              </span>
            </div>

            <button 
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              className={`flex-1 py-4 px-8 rounded-xl font-extrabold text-lg shadow-lg transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-3
                ${product.stock > 0 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white hover:shadow-amber-500/25' 
                  : 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed shadow-none'}`}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {product.stock > 0 ? `Acquire ${product.tag}` : 'Out of Stock'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
