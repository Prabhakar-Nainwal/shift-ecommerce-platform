import { useState, useEffect, useRef } from "react";
import { Pencil, Plus, ImagePlus } from "lucide-react";
import { getCategories, createCategory, updateCategory } from "../../services/categoryServices";
import Loader from "../layout/Loader";

const CategoryTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null | { mode: "add" } | { mode: "edit", category }
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();

      setCategories(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setName("");
    setImage(null);
    setPreview("");
    setIsActive(true);
    setForm({ mode: "add" });
  };

  const openEdit = (cat) => {
    setName(cat.name);
    setImage(null);
    setPreview(cat.image);
    setIsActive(cat.isActive);
    setForm({ mode: "edit", category: cat });
  };

  const closeForm = () => setForm(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (form.mode === "add" && !image) return;
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name", name);
      fd.append("isActive", isActive);
      if (image) fd.append("image", image);

      if (form.mode === "add") {
        await createCategory(fd);
      } else {
        await updateCategory(form.category._id, fd);
      }
      await fetchCategories();
      closeForm();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="absolute top-1/2 left-1/2"><Loader /></div>;
  }

  return (
    <div className="space-y-5 px-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* Inline form */}
      {form && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            {form.mode === "add" ? "New Category" : `Edit — ${form.category.name}`}
          </p>

          <input
            autoFocus
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Image picker */}
          <div
            onClick={() => fileRef.current.click()}
            className="flex items-center gap-4 bg-white border border-dashed border-gray-300 hover:border-blue-400 rounded-lg px-4 py-3 cursor-pointer transition group"
          >
            {preview ? (
              <img src={preview} alt="preview" className="h-12 w-12 object-contain rounded-lg border border-gray-100" />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-400 transition">
                <ImagePlus size={20} />
              </div>
            )}
            <span className="text-sm text-gray-400 group-hover:text-blue-500 transition">
              {preview ? "Change image" : "Upload image"}
            </span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
            <div
              onClick={() => setIsActive(v => !v)}
              className={`relative w-10 h-5 rounded-full transition ${isActive ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <div className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            <span className="text-sm text-gray-600">{isActive ? "Active" : "Inactive"}</span>
          </label>

          <div className="flex gap-2 justify-end">
            <button
              onClick={closeForm}
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !name.trim() || (form.mode === "add" && !image)}
              className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl border border-gray-100 shadow-sm bg-white divide-y divide-gray-50 overflow-hidden">
        {categories.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">No categories yet.</div>
        )}
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                <img src={cat.image} alt={cat.name} className="h-10 w-10 object-contain" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <button
              onClick={() => openEdit(cat)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg bg-white opacity-0 group-hover:opacity-100 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition"
            >
              <Pencil size={12} /> Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTab;