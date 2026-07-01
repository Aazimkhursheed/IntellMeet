import React, { useState, useEffect } from 'react';
import { User, Mail, Building2, Briefcase, Edit2, Camera, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, uploadAvatar, isUpdating } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    designation: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        company: user.company || '',
        designation: user.designation || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Profile"
          subtitle="Manage your personal information and preferences"
        />
        <Card glass>
          <CardBody>
            <LoadingSpinner size="lg" text="Loading profile..." />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card glass>
          <CardBody className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 bg-violet-600/10 border-2 border-violet-500/20 rounded-full flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-violet-400" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-violet-600 rounded-full text-white hover:bg-violet-500 transition cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploadingAvatar}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
              <p className="text-zinc-400 text-sm">{user.email}</p>
            </div>
            <div className="text-xs text-zinc-500">
              Role: <span className="text-violet-400 capitalize">{user.role}</span>
            </div>
          </CardBody>
        </Card>

        {/* Personal Information */}
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={14} className="mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-2.5 bg-zinc-950/60 border border-zinc-800/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition resize-none"
                  />
                  <p className="text-xs text-zinc-500">{formData.bio.length}/500 characters</p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: user.fullName || '',
                        email: user.email || '',
                        company: user.company || '',
                        designation: user.designation || '',
                        bio: user.bio || '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Full Name</label>
                    <div className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                      <User size={18} className="text-zinc-500" />
                      <span className="text-white">{user.fullName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Email Address</label>
                    <div className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                      <Mail size={18} className="text-zinc-500" />
                      <span className="text-white">{user.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Company</label>
                    <div className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                      <Building2 size={18} className="text-zinc-500" />
                      <span className="text-white">{user.company || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Designation</label>
                    <div className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                      <Briefcase size={18} className="text-zinc-500" />
                      <span className="text-white">{user.designation || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Bio</label>
                  <div className="p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl min-h-[100px]">
                    <p className="text-zinc-300 text-sm">
                      {user.bio || 'No bio added yet. Click edit to add your bio.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Account Settings */}
      <Card glass>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Account Settings</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
            <div>
              <p className="font-medium text-white">Change Password</p>
              <p className="text-sm text-zinc-400">Update your password to keep your account secure</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('Password change coming soon!')}>
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
            <div>
              <p className="font-medium text-white">Two-Factor Authentication</p>
              <p className="text-sm text-zinc-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('2FA coming soon!')}>
              Enable
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;