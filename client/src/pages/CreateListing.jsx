import { useState } from "react";
import { app } from "../firebase";
import {useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
// import {app} from

export default function CreateListing() {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state)=>state.user)
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms:1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    
  });
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploading, setUploading]=useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        setUploading(true)
        setimageUploadError(false)
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setimageUploadError(false);
          setUploading(false);

          
        })
        .catch((error) => {
          setimageUploadError("Image Upload failed(2mb max image size)");
          setUploading(false);
        });
    } else {
      setimageUploadError("You can only upload max 6 images");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress} done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleDeleteImage = (urlToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((url) => url !== urlToDelete),
    }));
  };
  const handleChange = (e) => {
if (e.target.id === "sale" || e.target.id === "rent"){
  setFormData({...formData, type:e.target.id})
}
if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
  setFormData({ ...formData, [e.target.id]: e.target.value });
}
if (
  e.target.id === "parking" ||
  e.target.id === "furnished" ||
  e.target.id === "offer"
) {
  setFormData({ ...formData, [e.target.id]: e.target.checked });
}

  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      if(formData.imageUrls.length < 1) return setError("You must upload at least one Image");
      if (+formData.regularPrice < +formData.discountedPrice ) return setError("Discount must be lower than regular price")
      setLoading(true)
      setError(false)
      const res = await fetch ("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData,userRef:currentUser._id}),
      });
        const data = await res.json();
        setLoading(false)
        if(data.success === false){
          setError(data.message)
        }
        navigate(`/listing/${data._id}`)
      
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className=" border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className=" border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className=" border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="font-semibold">Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="font-semibold">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking === true}
              />
              <span className="font-semibold">Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished === true}
              />
              <span className="font-semibold">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer === true}
              />
              <span className="font-semibold">Offer</span>
            </div>
          </div>
          <div className="flex  flex-wrap gap-6 ">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="50"
                max="100000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            {formData.offer && ( <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountedPrice"
                min="0"
                max="100000"
                required
                onChange={handleChange}
                value={formData.discountedPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>)}
           
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded-lg w-full "
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border"
              >
                <img
                  src={url}
                  alt={`listing image ${index + 1}`}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleDeleteImage(url)}
                  className="text-red-700 p-3 rounded-lg  hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading || uploading } className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
