import React from 'react';
import { User, Mail, Building2, Briefcase, Edit2, Camera } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

const Profile = () => {
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
              <div className="w-32 h-32 bg-violet-600/10 border-2 border-violet-500/20 rounded-full flex items-center justify-center">
                <User size={64} className="text-violet-400" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-violet-600 rounded-full text-white hover:bg-violet-500 transition">
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">John Doe</h2>
              <p className="text-zinc-400 text-sm">john.doe@example.com</p>
            </div>
            <Button variant="primary" size="sm">
              <Edit2 size={14} className="mr-2" />
              Change Avatar
            </Button>
          </CardBody>
        </Card>

        {/* Personal Information */}
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                <div className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                  <User size={18} className="text-zinc-500" />
                  <span className="text-white">John Doe</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Email Address</label>
                <div className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                  <Mail size={18} className="text-zinc-500" />
                  <span className="text-white">john.doe@example.com</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Company</label>
                <div className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                  <Building2 size={18} className="text-zinc-500" />
                  <span className="text-white">Acme Corporation</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Designation</label>
                <div className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                  <Briefcase size={18} className="text-zinc-500" />
                  <span className="text-white">Senior Developer</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Bio</label>
              <div className="p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl min-h-[100px]">
                <p className="text-zinc-300 text-sm">
                  Passionate developer with 5+ years of experience in building scalable web applications.
                  Love working with modern technologies and solving complex problems.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary">
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
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
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
            <div>
              <p className="font-medium text-white">Two-Factor Authentication</p>
              <p className="text-sm text-zinc-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
