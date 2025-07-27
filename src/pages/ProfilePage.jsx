import React, { useState, useEffect } from 'react';
import { FiCamera, FiMail, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/auth';
import toast from 'react-hot-toast';
import supabase from '../lib/supabase';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // Fetch user profile info
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile(user.id);
      if (profile) {
        setUsername(profile.username);
        setAvatarUrl(profile.avatar_url); // Fetch the avatar URL
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size is too large", { position: "top-right" });
        return;
      }
      setAvatar(file);
      const previewURL = URL.createObjectURL(file);
      setAvatarUrl(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let updates = { username };

      // If avatar file selected, upload first
      if (avatar) {
        const fileExt = avatar.name.split(".").pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}`;
        const filePath = `avatars/${fileName}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, avatar);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        updates = { ...updates, avatar_url: data.publicUrl };
        setAvatarUrl(data.publicUrl);  // Update the avatar URL
      }

      const { error, data } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select('username, avatar_url')
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);  // Set the updated avatar URL
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Error updating user profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex flex-col items-center">
              <div className="relative group">
                {/* Profile Picture */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={avatarUrl || 'https://avatars.githubusercontent.com/u/181145677?s=400&u=aa46c62b649793143c2c0dad215ba94c160511d2&v=4'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Input Image Upload */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer
                            transform transition-transform duration-200 hover:scale-110"
                >
                  <FiCamera className="w-5 h-5 text-blue-600" />
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* User Info */}
              <h2 className="mt-4 text-2xl font-bold text-white">
                {username || 'Your Profile'}
              </h2>
              <p className="text-white">{user?.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium
                            rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                            focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
