import { useState } from "react";

export default function Settings() {
  const [profile, setProfile] = useState({
    fullName: "",
    company: "",
  });

  const handleSave = () => {
    // TODO: Connect to API
    console.log("Saving profile:", profile);
    alert("Changes saved!");
  };

  return (
    <div className="p-6 space-y-6 text-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">
          Customize your dashboard experience
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal and organization details.
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              className="w-full mt-2 px-4 py-2 rounded-xl border bg-white outline-none"
              placeholder="Your name"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Company</label>
            <input
              className="w-full mt-2 px-4 py-2 rounded-xl border bg-white outline-none"
              placeholder="Company name"
              value={profile.company}
              onChange={(e) =>
                setProfile({ ...profile, company: e.target.value })
              }
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
