/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import CBTModule from './pages/CBTModule';
import Grading from './pages/Grading';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h2 className="text-4xl font-bold text-on-surface">{title}</h2>
      <p className="text-on-surface-variant font-medium">Modul ini sedang dalam tahap pengembangan.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/hrm" element={<Placeholder title="HRM Module" />} />
          <Route path="/academic" element={<Placeholder title="Academic Module" />} />
          <Route path="/cbt" element={<CBTModule />} />
          <Route path="/grading" element={<Grading />} />
        </Routes>
      </Layout>
    </Router>
  );
}
