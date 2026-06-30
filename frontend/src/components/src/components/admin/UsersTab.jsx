import React, { useState } from "react";

import { Search, X, UserPlus, Loader2 } from "lucide-react";
import Loader from "../Loader";
import { usersData } from "../../data/dashboardData";
import { useEffect } from "react";
import { getUsers, addUser } from "../../services/userServices";

const UsersTab = () => {
  const [search, setSearch] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
    confirmPassword: "",
    adminPassword: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getUsers();
      setUsersData(res.data.data);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = usersData.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {

      setLoading(true);
      setError("");

      await addUser(form);

      await fetchUsers();

      setShowModal(false);

      setForm({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        confirmPassword: "",
        adminPassword: "",
      });

    } catch (err) {

      setError(err.response?.data?.message || "Failed");

    } finally {

      setLoading(false);

    }
  };
  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    )
  }
  return (
    <div className="space-y-5">
      <div className="relative max-w-xl mx-auto">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Search Users"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-blue-600 font-semibold text-base">Add new user</span>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        ><UserPlus size={16} />
          ADD
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Name", "Phone Number", "Email", "Created On"].map(h => (
                <th key={h} className="text-blue-600 font-semibold text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-700">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.phone}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">

            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-xl">Add User</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className={inp} />
              <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inp} />
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className={inp} />

              <select name="role" value={form.role} onChange={handleChange} cla ssName={inp}>

                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <input type="password" name="password" placeholder="User Password" value={form.password} onChange={handleChange} className={inp} />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className={inp} />
              <input type="password" name="adminPassword" placeholder="Your Password" value={form.adminPassword} onChange={handleChange} className={inp} />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Create User"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab