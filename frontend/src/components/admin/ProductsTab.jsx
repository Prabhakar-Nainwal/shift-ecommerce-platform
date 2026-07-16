import React, { useEffect, useState } from "react";
import { Search, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../../services/productService";
import AddProduct from "./AddProduct";
import Loader from "../layout/Loader";
import { getCategories } from "../../services/categoryServices";

const PAGE_SIZE = 12;

const ProductsTab = () => {
  const [search, setSearch] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState(null);
  const [loading, setloading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true); // Added for first-time load
  const [categories, setCategories] = useState([]);

  const fetchProductsData = async () => {
    try {
      setloading(true);
      const res = await getProducts(search, activeCategory, page);
      setProductsData(res.data.data);
      setTotalPages(Math.ceil(res.data.totalProducts / PAGE_SIZE));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setloading(false);
      setInitialLoading(false); // Turn off initial loader after the first fetch
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, [search, activeCategory, page]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories([
        { _id: "All", name: "All" },
        ...res.data.data.filter(cat => cat.isActive),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  if (!productsData) {
    return <div className="absolute top-1/2 left-1/2">Loading…</div>;
  }

  if (view) {
    return (
      <AddProduct
        mode={view.mode}
        product={view.product ?? null}
        onClose={(shouldRefresh) => {
          setView(null);
          if (shouldRefresh) fetchProductsData();
        }}
      />
    );
  }

  // Only block the entire screen on the very first load
  if (initialLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-1">
      {/* Search + Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            placeholder="Search by name"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <button
          onClick={() => setView({ mode: "add" })}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition whitespace-nowrap"
        >
          <Package size={15} /> Add Product
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryChange(cat._id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition whitespace-nowrap ${activeCategory === cat._id
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
        {productsData.length} {productsData.length === 1 ? "product" : "products"}
      </p>

      {/* Table Area */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white relative">

        {/* Subtle overlay when filtering/searching instead of breaking the layout */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-xs font-medium text-gray-500 bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-lg animate-pulse">
              Updating list...
            </span>
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Image", "Name", "Category", "Price", "Stock", "Rating", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productsData.map((p) => (
              <tr key={p._id} className="hover:bg-blue-50/40 transition-colors group" onClick={() => setView({ mode: "edit", product: p })}>
                <td className="px-5 py-3">
                  <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={p.coverImage} alt={p.name} className="h-10 w-10 object-contain" />
                  </div>
                </td>
                <td className="px-5 py-3 font-semibold text-gray-800">{p.name}</td>
                <td className="px-5 py-3">
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                    {p.category.name}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-gray-800"> ₹{p.price}
                  {p.mrp && p.mrp > p.price && (
                    <span className="text-xs text-gray-400 line-through ml-1.5">₹{p.mrp}</span>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-500">{p.stock}</td>
                <td className="px-5 py-3 text-amber-400 tracking-tight">{"★".repeat(Math.round(p.rating))}</td>
                <td className="px-5 py-3"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {productsData.length === 0 && !loading && (
          <div className="py-16 text-center text-gray-400 text-sm">
            No products match your search.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 bg-white hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={13} /> Prev
          </button>
          <span className="text-xs text-gray-400 font-medium px-1">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 bg-white hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;