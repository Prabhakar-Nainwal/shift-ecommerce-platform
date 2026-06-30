import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; // Added for navigation hook

export default function Security() {
  const navigate = useNavigate(); // Navigation interface initialization
  const { 
    user, 
    fetchUser, 
    handleChangePassword, 
    handleVerifyChangePassword,
    updateProfile 
  } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const [editingField, setEditingField] = useState(null); 
  const [draftValue, setDraftValue] = useState("");       
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const [passwordStep, setPasswordStep] = useState(1); 
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordOtp, setPasswordOtp] = useState("");

  const fields = [
    { key: "name",     label: "Name",          type: "text",     displayValue: formData.name },
    { key: "email",    label: "Email",          type: "email",    displayValue: formData.email },
    { key: "mobile",   label: "Mobile Number",  type: "tel",      displayValue: formData.mobile },
    { key: "password", label: "Password",       type: "password", displayValue: "••••••••••••" },
  ];

  function validate(key, value) {
    if (!value.trim() && key !== "password") return `${key.charAt(0).toUpperCase() + key.slice(1)} cannot be empty.`;
    if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    if (key === "mobile" && !/^\+?[\d\s\-()]{7,15}$/.test(value)) return "Enter a valid mobile number.";
    return null;
  }

  function handleEdit(key) {
    setEditingField(key);
    setStatusMessage("");
    setErrors({});
    if (key === "password") {
      setPasswordStep(1);
      setOldPassword("");
      setNewPassword("");
      setPasswordOtp("");
    } else {
      setDraftValue(formData[key] || "");
    }
  }

  function handleCancel() {
    setEditingField(null);
    setDraftValue("");
    setErrors({});
    setStatusMessage("");
  }

  async function handleSaveStandardField(key) {
    const error = validate(key, draftValue);
    if (error) {
      setErrors({ [key]: error });
      return;
    }

    try {
      await updateProfile({ [key]: draftValue });
      setFormData((prev) => ({ ...prev, [key]: draftValue }));
      setStatusMessage(`${key.charAt(0).toUpperCase() + key.slice(1)} updated successfully.`);
      setEditingField(null);
      await fetchUser(); 
    } catch (err) {
      setErrors({ [key]: err.response?.data?.message || "Failed to update field." });
    }
  }

  async function handlePasswordSubmitStep1(e) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrors({ password: "New password must be at least 8 characters long." });
      return;
    }
    try {
      setErrors({});
      await handleChangePassword(oldPassword, newPassword);
      setPasswordStep(2);
      setStatusMessage("Verification security code dispatched to your email address.");
    } catch (err) {
      setErrors({ password: err.response?.data?.message || "Verification of current password failed." });
    }
  }

  async function handlePasswordVerifyStep2(e) {
    e.preventDefault();
    if (!passwordOtp.trim()) {
      setErrors({ password: "OTP field is required." });
      return;
    }
    try {
      setErrors({});
      await handleVerifyChangePassword(passwordOtp);
      setStatusMessage("Password changed successfully.");
      setEditingField(null);
    } catch (err) {
      setErrors({ password: err.response?.data?.message || "Invalid or expired verification token." });
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold text-gray-800">Login & Security</h2>
      
      {statusMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
          {statusMessage}
        </div>
      )}

      {fields.map(({ key, label, type, displayValue }) => {
        const isEditing = editingField === key;

        return (
          <div
            key={key}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-start gap-4 bg-white"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>

              {isEditing ? (
                <div className="mt-1.5 space-y-2">
                  {key !== "password" ? (
                    <>
                      <input
                        autoFocus
                        type={type}
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveStandardField(key)}
                        className={`w-full text-sm border rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 transition
                          ${errors[key] ? "border-red-400" : "border-gray-300"}`}
                      />
                      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveStandardField(key)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 font-medium">Save</button>
                        <button onClick={handleCancel} className="text-sm text-gray-500 px-3 py-1 rounded-md hover:bg-gray-100">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      {passwordStep === 1 ? (
                        <div className="space-y-2">
                          {/* Added fallback toggle helper link if current password is forgotten */}
                          <div className="text-right">
                            <button 
                              type="button" 
                              onClick={() => navigate("/forgot-password")}
                              className="text-xs text-blue-600 hover:underline font-medium"
                            >
                              Don't know your current password?
                            </button>
                          </div>
                          
                          <input
                            type="password"
                            placeholder="Current Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className={`w-full text-sm border rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500
                              ${errors.password ? "border-red-400" : "border-gray-300"}`}
                          />
                          <input
                            type="password"
                            placeholder="New Secure Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full text-sm border rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500
                              ${errors.password ? "border-red-400" : "border-gray-300"}`}
                          />
                          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                          <div className="flex gap-2">
                            <button onClick={handlePasswordSubmitStep1} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 font-medium">Next</button>
                            <button onClick={handleCancel} className="text-sm text-gray-500 px-3 py-1 rounded-md hover:bg-gray-100">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 font-medium">Type the 6-digit confirmation pin sent to your inbox:</p>
                          <input
                            autoFocus
                            type="text"
                            maxLength="6"
                            placeholder="000000"
                            value={passwordOtp}
                            onChange={(e) => setPasswordOtp(e.target.value)}
                            className={`w-full text-sm border rounded-md px-3 py-1.5 tracking-widest font-bold outline-none focus:ring-2 focus:ring-blue-500 text-center
                              ${errors.password ? "border-red-400" : "border-gray-300"}`}
                          />
                          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                          <div className="flex gap-2">
                            <button onClick={handlePasswordVerifyStep2} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 font-medium">Confirm Changes</button>
                            <button onClick={() => setPasswordStep(1)} className="text-sm text-gray-500 px-3 py-1 rounded-md hover:bg-gray-100">Back</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="font-medium text-gray-800 mt-0.5 truncate">{displayValue}</p>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={() => handleEdit(key)}
                className="text-sm text-blue-600 hover:underline font-medium shrink-0"
              >
                Edit
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}