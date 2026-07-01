import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Building2 } from 'lucide-react';
import { useProfile } from '../hooks/useProfile.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import AvatarUploader from '../components/ui/AvatarUploader.jsx';
import toast from 'react-hot-toast';

/**
 * Profile page - User profile management
 */
const Profile = () => {
  const { profile, isLoading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    company: '',
    designation: '',
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        company: profile.company || '',
        designation: profile.designation || '',
      });
    }
  }, [profile]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  // Handle avatar upload success
  const handleAvatarUpload = () => {
    toast.success('Avatar uploaded successfully');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Profile"
          subtitle="Manage your profile information"
        />
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  // Error state is handled by the hook - profile will be null on error
  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Profile"
          subtitle="Manage your profile information"
        />
        <Card glass>
          <CardBody>
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">Failed to load profile</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Manage your profile information"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card glass>
          <CardBody className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center overflow-hidden">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-zinc-600" />
                )}
              </div>
              <AvatarUploader onUploadSuccess={handleAvatarUpload} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">{profile?.fullName || 'User'}</h3>
              <p className="text-zinc-400 text-sm">{profile?.email}</p>
            </div>
          </CardBody>
        </Card>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card glass>
            <CardBody>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      maxLength="500"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Designation
                    </label>
                    <div className="relative">
                      <Briefcase size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" variant="primary" className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-zinc-900/50 rounded-xl">
                    <User size={20} className="text-zinc-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-zinc-400">Full Name</p>
                      <p className="text-white font-medium">{profile?.fullName || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-zinc-900/50 rounded-xl">
                    <Mail size={20} className="text-zinc-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-zinc-400">Email</p>
                      <p className="text-white font-medium">{profile?.email || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-zinc-900/50 rounded-xl">
                    <Briefcase size={20} className="text-zinc-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-zinc-400">Designation</p>
                      <p className="text-white font-medium">{profile?.designation || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-zinc-900/50 rounded-xl">
                    <Building2 size={20} className="text-zinc-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-zinc-400">Company</p>
                      <p className="text-white font-medium">{profile?.company || 'Not set'}</p>
                    </div>
                  </div>

                  {profile?.bio && (
                    <div className="p-4 bg-zinc-900/50 rounded-xl">
                      <p className="text-sm text-zinc-400 mb-2">Bio</p>
                      <p className="text-white">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;