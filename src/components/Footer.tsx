
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 md:px-8 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-postcraft-primary">PostCraft</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create engaging LinkedIn posts and images with AI assistance.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-postcraft-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-sm text-gray-600 hover:text-postcraft-primary">
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 hover:text-postcraft-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/settings" className="text-sm text-gray-600 hover:text-postcraft-primary">
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-postcraft-primary">
                  Help & FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} PostCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
