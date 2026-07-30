import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminOverview } from '../components/admin/AdminOverview';
import { SettingsEditor } from '../components/admin/SettingsEditor';
import { PageManager } from '../components/admin/PageManager';
import { ProductManager } from '../components/admin/ProductManager';
import { ServiceManager } from '../components/admin/ServiceManager';
import { TrainingManager } from '../components/admin/TrainingManager';
import { TeamManager } from '../components/admin/TeamManager';
import { TestimonialManager } from '../components/admin/TestimonialManager';
import { MediaLibrary } from '../components/admin/MediaLibrary';
import { NavManager } from '../components/admin/NavManager';
import { SubmissionManager } from '../components/admin/SubmissionManager';
import { UserManager } from '../components/admin/UserManager';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 flex flex-col md:flex-row bg-[#0B1021]">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto custom-scrollbar h-[calc(100vh-80px)]">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/settings" element={<SettingsEditor />} />
          <Route path="/pages" element={<PageManager />} />
          <Route path="/work" element={<ServiceManager category="work" />} />
          <Route path="/studio" element={<ServiceManager category="studio" />} />
          <Route path="/skills" element={<ServiceManager category="skills" />} />
          <Route path="/labs" element={
            <div className="space-y-12">
              <ProductManager />
              <div className="pt-8 border-t border-white/10">
                <ServiceManager category="labs" />
              </div>
            </div>
          } />
          <Route path="/products" element={<ProductManager />} />
          <Route path="/testimonials" element={<TestimonialManager />} />
          <Route path="/team" element={<TeamManager />} />
          <Route path="/media" element={<MediaLibrary />} />
          <Route path="/navigation" element={<NavManager />} />
          <Route path="/leads" element={<SubmissionManager />} />
          <Route path="/users" element={<UserManager />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
