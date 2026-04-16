import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // <-- Added new imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faUpload, faCircleNotch, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Admin() {
  const { currentUser } = useAuth();
  const ADMIN_EMAIL = "hotoke.atlast@gmail.com"; // Keep your real email here

  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  
  // New States for Edit/Delete functionality
  const [artifacts, setArtifacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [product, setProduct] = useState({
    name: '', price: '', tag: '', sequence: '', description: '', stock: 1
  });
  const [specs, setSpecs] = useState([{ label: '', value: '' }]);

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return <div className="text-center mt-20 text-red-500 font-bold">Access Denied. You are not the Fool.</div>;
  }

  // Fetch all artifacts on load
  const fetchArtifacts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    setArtifacts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };
  const addSpecRow = () => setSpecs([...specs, { label: '', value: '' }]);
  const removeSpecRow = (index) => setSpecs(specs.filter((_, i) => i !== index));

  // Populate form for editing
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setProduct({
      name: item.name, price: item.price, tag: item.tag, sequence: item.sequence || '', description: item.description, stock: item.stock
    });
    setSpecs(item.specs && item.specs.length > 0 ? item.specs : [{ label: '', value: '' }]);
    setExistingImageUrl(item.imageUrl || "");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to top form
  };

  // Cancel edit mode
  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setProduct({ name: '', price: '', tag: '', sequence: '', description: '', stock: 1 });
    setSpecs([{ label: '', value: '' }]);
    setImageUpload(null);
    setExistingImageUrl("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to banish this artifact to the void?")) {
      await deleteDoc(doc(db, "products", id));
      fetchArtifacts(); // Refresh list
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = existingImageUrl;

      // Only upload a new image if they selected one
      if (imageUpload) {
        const formData = new FormData();
        formData.append("file", imageUpload);
        formData.append("upload_preset", "vortex_artifacts"); 
        formData.append("cloud_name", "dp4op4jg1"); // <-- Keep your Cloudinary name here

        const response = await fetch("https://api.cloudinary.com/v1_1/dp4op4jg1/image/upload", {
          method: "POST",
          body: formData,
        });

        const uploadedImageData = await response.json();
        imageUrl = uploadedImageData.secure_url; 
      }

      const cleanedSpecs = specs.filter(spec => spec.label !== '' && spec.value !== '');

      const productData = {
        ...product,
        stock: Number(product.stock),
        specs: cleanedSpecs,
        imageUrl: imageUrl
      };

      if (isEditing) {
        // UPDATE existing document
        const productRef = doc(db, "products", editId);
        await updateDoc(productRef, productData);
        alert("Artifact updated successfully!");
      } else {
        // CREATE new document
        await addDoc(collection(db, "products"), productData);
        alert("Artifact successfully forged!");
      }
      
      resetForm();
      fetchArtifacts(); // Refresh the list at the bottom

    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">The Forge</h1>
        {isEditing && (
          <button onClick={resetForm} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200 flex items-center gap-2">
            <FontAwesomeIcon icon={faTimes} /> Cancel Edit
          </button>
        )}
      </div>

      {/* --- THE FORM --- */}
      <form onSubmit={handleSubmit} className={`bg-white dark:bg-gray-900 p-8 rounded-2xl border ${isEditing ? 'border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.2)]' : 'border-gray-200 dark:border-gray-800'} shadow-xl space-y-8 mb-12`}>
        
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Artifact Image</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative overflow-hidden">
              
              {/* Show existing image if editing and no new image is selected */}
              {existingImageUrl && !imageUpload && (
                <div className="absolute inset-0 opacity-30">
                   <img src={existingImageUrl} alt="Current" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                <FontAwesomeIcon icon={faUpload} className="text-2xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {imageUpload ? <span className="text-amber-500">{imageUpload.name}</span> : 
                   existingImageUrl ? "Click to upload a replacement image" : "Click to upload an image"}
                </p>
              </div>
              <input type="file" className="hidden" onChange={(e) => setImageUpload(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input required type="text" placeholder="Artifact Name" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500" />
          <input required type="text" placeholder="Price (e.g., 150 Pounds)" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500" />
          <input required type="text" placeholder="Tag (e.g., Artifact)" value={product.tag} onChange={e => setProduct({...product, tag: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500" />
          <input type="text" placeholder="Sequence (Optional)" value={product.sequence} onChange={e => setProduct({...product, sequence: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500" />
          <input required type="number" min="0" placeholder="Stock Quantity" value={product.stock} onChange={e => setProduct({...product, stock: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500" />
        </div>

        <textarea required placeholder="Deep Description" rows="4" value={product.description} onChange={e => setProduct({...product, description: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500"></textarea>

        {/* Dynamic Specs Array */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Properties (Specs)</h3>
            <button type="button" onClick={addSpecRow} className="text-sm font-bold text-amber-500 hover:text-amber-400 flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} /> Add Property
            </button>
          </div>
          
          <div className="space-y-4">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-4">
                <input type="text" placeholder="Label" value={spec.label} onChange={(e) => handleSpecChange(index, 'label', e.target.value)} className="w-1/3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500" />
                <input type="text" placeholder="Value" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500" />
                <button type="button" onClick={() => removeSpecRow(index)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex justify-center items-center gap-3 ${loading ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : isEditing ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'}`}>
          {loading ? <><FontAwesomeIcon icon={faCircleNotch} spin /> Processing...</> : isEditing ? 'Update Artifact' : 'Publish Artifact'}
        </button>

      </form>

      {/* --- ARTIFACT MANAGEMENT LIST --- */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">Archive Management</h2>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {artifacts.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No artifacts found in the database.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {artifacts.map((item) => (
              <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.price} • Stock: {item.stock}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}