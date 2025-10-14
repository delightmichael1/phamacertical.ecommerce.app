import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-strokedark mt-8">
      <div className="bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              Copyright &copy; 2025 PharmNex. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
