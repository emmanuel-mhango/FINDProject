
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-background text-white py-6 pl-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-find-red flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="find-logo text-2xl font-bold tracking-tight">FIND</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your unlimited platform for finding everything you need in one place
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/taxi" className="text-gray-300 hover:text-white hover:underline">Find My Taxi</Link></li>
              <li><Link to="/jobs" className="text-gray-300 hover:text-white hover:underline">Find My Job</Link></li>
              <li><Link to="/roommates" className="text-gray-300 hover:text-white hover:underline">Find My Roommate</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white hover:underline">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white hover:underline">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white hover:underline">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-6 text-center">
          <p className="text-gray-400">2025 FIND. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
