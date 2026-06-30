import { useState, useRef } from "react";
import { X, Plus, ChevronDown, CheckCircle, ImagePlus, Loader2 } from "lucide-react";
import { addProduct, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryServices";
import { useEffect } from "react";

const inp = "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 hover:border-gray-300 transition-all";

export default function AddProduct({ mode = "add", product = null, onClose }) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        name: product?.name ?? "",
        description: product?.description ?? "",
        price: product?.price ?? "",
        stock: product?.stock ?? "",
        category: product?.category?._id ?? "",
        mrp: product?.mrp ?? "",
        isActive: product?.isActive ?? true,
    });

    const [coverImage, setCoverImage] = useState(null);
    const [images, setImages] = useState([]);
    const [coverPreview, setCoverPreview] = useState(product?.coverImage ?? null);
    const [imagePreviews, setImagePreviews] = useState(product?.images?.slice(0, 5) ?? []);
    const [tags, setTags] = useState(product?.tags ?? []);
    const [highlights, setHighlights] = useState(product?.highlights ?? []);
    const [tagInput, setTagInput] = useState("");
    const [hlInput, setHlInput] = useState("");
    const [catOpen, setCatOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const [categories, setCategories] = useState([]);

    const coverRef = useRef();
    const imgRef = useRef();

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(
                res.data.data.filter((cat) => cat.isActive)
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

    const addTag = (val, list, setList, setInput) => {
        const v = val.trim();
        if (v && !list.includes(v)) setList([...list, v]);
        setInput("");
    };

    const handleCover = e => {
        const f = e.target.files[0];
        if (!f) return;
        setCoverImage(f);
        setCoverPreview(URL.createObjectURL(f));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files).slice(
            0,
            5 - imagePreviews.length
        );

        setImages((prev) => [...prev, ...files].slice(0, 5));

        setImagePreviews((prev) => [
            ...prev,
            ...files.map((file) => URL.createObjectURL(file)),
        ].slice(0, 5));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);

        // Validation Check
        const sellingPrice = Number(form.price);
        const originalMrp = Number(form.mrp);

        if (originalMrp && originalMrp < sellingPrice) {
            setError("Validation Error: MRP cannot be lower than the Selling Price.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });

        formData.append("tags", JSON.stringify(tags));
        formData.append("highlights", JSON.stringify(highlights));

        if (coverImage) {
            formData.append("coverImage", coverImage);
        }

        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            if (isEdit) {
                await updateProduct(product._id, formData);
            } else {
                await addProduct(formData);
            }
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose?.(true);
            }, 1500);
        } catch (err) {
            const serverMessage = err?.response?.data?.message || err?.message;
            setError(serverMessage ?? "Something went wrong. Please try again.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const label = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
    const divider = "border-t border-gray-100 pt-6 mt-2";

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-3xl mx-auto px-4 py-10">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Products</p>
                        <h1 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Product" : "Add New Product"}</h1>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={loading || saved}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                            {loading ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                                : saved ? <><CheckCircle size={15} /> {isEdit ? "Updated!" : "Saved!"}</>
                                    : <><Plus size={15} /> {isEdit ? "Update" : "Save"}</>}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8 space-y-6">

                    {/* Images */}
                    <div>
                        <p className={label}>Images</p>
                        <div onClick={() => !coverPreview && coverRef.current.click()}
                            className={`relative w-full h-52 rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all
                ${coverPreview ? "border-indigo-300" : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 bg-gray-50"}`}>
                            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
                            {coverPreview
                                ? <>
                                    <img src={coverPreview} className="w-full h-full object-cover" alt="cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-3">
                                        <button type="button" onClick={e => { e.stopPropagation(); coverRef.current.click() }}
                                            className="bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition">Change</button>
                                        <button type="button" onClick={e => { e.stopPropagation(); setCoverPreview(null) }}
                                            className="bg-white/90 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition">Remove</button>
                                    </div>
                                </>
                                : <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                                    <ImagePlus size={28} className="text-gray-300" />
                                    <p className="text-sm">Click or drag to upload <span className="text-indigo-500 font-medium">cover image</span></p>
                                    <p className="text-xs text-gray-300">PNG, JPG, WEBP</p>
                                </div>
                            }
                        </div>

                        <div className="flex gap-2.5 mt-3">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="relative group w-[72px] h-[72px] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                    <img src={src} className="w-full h-full object-cover" alt={`img-${i}`} />
                                    <button type="button" onClick={() => setImagePreviews(p => p.filter((_, j) => j !== i))}
                                        className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm">
                                        <X size={11} className="text-gray-600" />
                                    </button>
                                </div>
                            ))}
                            {imagePreviews.length < 5 && (
                                <button type="button" onClick={() => imgRef.current.click()}
                                    className="w-[72px] h-[72px] rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 flex items-center justify-center text-gray-300 hover:text-indigo-400 transition flex-shrink-0">
                                    <Plus size={20} />
                                </button>
                            )}
                            <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                            <p className="self-end text-xs text-gray-400 ml-1">{imagePreviews.length}/5 images</p>
                        </div>
                    </div>

                    <div className={divider} />

                    {/* Basic info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        <div className="md:col-span-2">
                            <label className={label}>Product Name <span className="text-rose-400 normal-case">*</span></label>
                            <input className={inp} placeholder="e.g. Noise Air Buds Pro 3" value={form.name} onChange={set("name")} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className={label}>Category <span className="text-rose-400 normal-case">*</span></label>
                            <div className="relative">
                                <button type="button" onClick={() => setCatOpen(o => !o)}
                                    className={`${inp} flex items-center justify-between text-left ${!form.category && "text-gray-400"}`}>
                                    {
                                        categories.find((c) => c._id === form.category)?.name ||
                                        "Select category"
                                    }
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${catOpen ? "rotate-180" : ""}`} />
                                </button>
                                {catOpen && (
                                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                                        {categories.map(c => (
                                            <button key={c._id} type="button" onClick={() => { setForm(f => ({ ...f, category: c._id })); setCatOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${form.category === c._id ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className={label}>Description</label>
                            <textarea className={`${inp} resize-none`} rows={3} placeholder="Describe the product…" value={form.description} onChange={set("description")} />
                        </div>
                    </div>

                    <div className={divider} />

                    {/* Pricing & Inventory */}
                    <div>
                        <p className={label}>Pricing & Inventory</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                ["Price (Selling ₹)", "price", "2999"],
                                ["MRP (Original ₹)", "mrp", "3499"],
                                ["Stock", "stock", "120"],
                            ].map(([l, k, ph]) => (
                                <div key={k}>
                                    <label className={label}>{l}</label>
                                    <input className={inp} type="number" placeholder={ph} value={form[k]} onChange={set(k)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={divider} />

                    {/* Tags & Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            ["Tags", tags, setTags, tagInput, setTagInput, "e.g. Wireless, Smart…"],
                            ["Highlights", highlights, setHighlights, hlInput, setHlInput, "e.g. Fast charging…"],
                        ].map(([l, list, setList, inp2, setInp, ph]) => (
                            <div key={l}>
                                <label className={label}>{l}</label>
                                <div className="border border-gray-200 rounded-lg px-3 py-2 min-h-[44px] flex flex-wrap gap-1.5 items-center
                  focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 hover:border-gray-300 transition-all bg-white">
                                    {list.map(t => (
                                        <span key={t} className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 font-medium px-2.5 py-1 rounded-full">
                                            {t}<button type="button" onClick={() => setList(list.filter(x => x !== t))}><X size={10} /></button>
                                        </span>
                                    ))}
                                    <input className="flex-1 min-w-[80px] text-sm outline-none placeholder-gray-400 bg-transparent"
                                        placeholder={list.length === 0 ? ph : "Add more…"} value={inp2}
                                        onChange={e => setInp(e.target.value)}
                                        onKeyDown={e => (e.key === "Enter" || e.key === ",") && (e.preventDefault(), addTag(inp2, list, setList, setInp))}
                                        onBlur={() => addTag(inp2, list, setList, setInp)} />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add</p>
                            </div>
                        ))}
                    </div>

                    <div className={divider} />

                    {/* Active toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Active listing</p>
                            <p className="text-xs text-gray-400">Product will be visible to customers</p>
                        </div>
                        <button type="button" onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${form.isActive ? "bg-indigo-500" : "bg-gray-200"}`}>
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${form.isActive ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}