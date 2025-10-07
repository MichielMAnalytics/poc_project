'use client';

import Link from 'next/link';
import MobilePreview from '../components/MobilePreview';

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Live Preview</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          This preview updates automatically every 5 seconds. Edit campaigns to see changes instantly.
        </p>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-8">
        <MobilePreview />
      </div>
    </div>
  );
}
