import React from 'react';
import { Bell, Shield, Palette, Globe, HelpCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

const Settings = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your application preferences and configurations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                <Bell size={20} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-zinc-400">Receive meeting reminders via email</p>
              </div>
              <div className="w-12 h-6 bg-violet-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
              <div>
                <p className="font-medium text-white">Push Notifications</p>
                <p className="text-sm text-zinc-400">Receive in-app notifications</p>
              </div>
              <div className="w-12 h-6 bg-violet-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
              <div>
                <p className="font-medium text-white">Meeting Reminders</p>
                <p className="text-sm text-zinc-400">Get notified before meetings start</p>
              </div>
              <div className="w-12 h-6 bg-zinc-700 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-400 rounded-full" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Privacy & Security */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl">
                <Shield size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
              <div>
                <p className="font-medium text-white">Profile Visibility</p>
                <p className="text-sm text-zinc-400">Control who can see your profile</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
              <div>
                <p className="font-medium text-white">Data Export</p>
                <p className="text-sm text-zinc-400">Download your meeting data</p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
              <div>
                <p className="font-medium text-white">Delete Account</p>
                <p className="text-sm text-zinc-400">Permanently delete your account</p>
              </div>
              <Button variant="danger" size="sm">
                Delete
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Appearance */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                <Palette size={20} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Appearance</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium text-white">Theme</p>
              <div className="flex space-x-3">
                <div className="flex-1 p-3 bg-zinc-950 border-2 border-violet-500 rounded-xl cursor-pointer">
                  <p className="text-sm text-white text-center">Dark</p>
                </div>
                <div className="flex-1 p-3 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer opacity-50">
                  <p className="text-sm text-zinc-400 text-center">Light</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-white">Accent Color</p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-violet-600 rounded-full cursor-pointer border-2 border-white" />
                <div className="w-8 h-8 bg-blue-600 rounded-full cursor-pointer opacity-50" />
                <div className="w-8 h-8 bg-emerald-600 rounded-full cursor-pointer opacity-50" />
                <div className="w-8 h-8 bg-amber-600 rounded-full cursor-pointer opacity-50" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Language & Region */}
        <Card glass>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-600/10 border border-amber-500/20 rounded-xl">
                <Globe size={20} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Language & Region</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium text-white">Language</p>
              <select className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-white">Timezone</p>
              <select className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+1 (Central European)</option>
              </select>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Help & Support */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-600/10 border border-zinc-500/20 rounded-xl">
              <HelpCircle size={20} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Help & Support</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="secondary" className="justify-start">
              Documentation
            </Button>
            <Button variant="secondary" className="justify-start">
              Contact Support
            </Button>
            <Button variant="secondary" className="justify-start">
              Report a Bug
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;
