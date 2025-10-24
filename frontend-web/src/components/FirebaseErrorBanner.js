"use client";

import { useState } from 'react';
import { FaExclamationTriangle, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

export default function FirebaseErrorBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Firebase Database Not Configured
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Your app is running but the Firebase database needs to be set up. 
              Follow these quick steps to fix this:
            </p>
            <ol className="mt-2 list-decimal list-inside space-y-1">
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">
                Firebase Console <FaExternalLinkAlt className="inline h-3 w-3 ml-1" />
              </a></li>
              <li>Select your project: <code className="bg-yellow-200 px-1 rounded">skillchain-fe362</code></li>
              <li>Click "Firestore Database" → "Create database"</li>
              <li>Choose "Start in test mode" and select a location</li>
              <li>Refresh this page</li>
            </ol>
            <p className="mt-2">
              <strong>Need help?</strong> Check the <code className="bg-yellow-200 px-1 rounded">FIREBASE_QUICK_FIX.md</code> file in your project.
            </p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setIsVisible(false)}
            className="inline-flex text-yellow-500 hover:text-yellow-700 focus:outline-none"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
