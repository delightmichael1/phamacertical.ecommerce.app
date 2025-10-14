import {
  FaFacebook,
  FaMapMarkerAlt,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import React from "react";
import Link from "next/link";
import { BiPhone } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa6";

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
}

interface FooterLink {
  label: string;
  href: string;
}

const Footer: React.FC = () => {
  const informationLinks: FooterLink[] = [
    { label: "Newsroom", href: "#" },
    { label: "Sell Your Pharmacy", href: "#" },
    { label: "Affiliate Program", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Investor Relations", href: "#" },
  ];

  const categoryLinks: FooterLink[] = [
    { label: "Devices", href: "#" },
    { label: "Family Care", href: "#" },
    { label: "Fitness", href: "#" },
    { label: "Lifestyle", href: "#" },
    { label: "Personal care", href: "#" },
  ];

  const servicesLinks: FooterLink[] = [
    { label: "Shipping", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Product Recalls", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      icon: <FaFacebook size={20} />,
      url: "#",
    },
    {
      name: "Twitter",
      icon: <FaTwitter size={20} />,
      url: "#",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={20} />,
      url: "#",
    },
    {
      name: "Pinterest",
      icon: <FaPinterest size={20} />,
      url: "#",
    },
    {
      name: "Email",
      icon: <MdEmail size={20} />,
      url: "#",
    },
  ];

  const bottomLinks: FooterLink[] = [
    { label: "BLOG", href: "#" },
    { label: "CONTACT", href: "#" },
    { label: "FAQ", href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-strokedark mt-8">
      {/* <div className="border-b border-strokedark py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary rounded-full p-3 flex-shrink-0">
                <FaMapMarkerAlt size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-gray-600 text-sm">
                  9066 Green Lake Drive Chevy Chase, MD 20815
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-full p-3 flex-shrink-0">
                <BiPhone size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  WHATSAPP US
                </h3>
                <p className="text-primary font-semibold text-lg mb-1">
                  (1800)-88-66-990
                </p>
                <p className="text-gray-600 text-sm">demo@demo.com</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="border-b border-strokedark py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Medilazar
              </h2>
              <p className="text-xs text-card0 mb-4">Online Pharmacy</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Medilazar Shop is proud of being a best Pharmacy Online shops in
                USA with high-quality medicines, supplements, healthcare
                product...
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">INFORMATION</h3>
              <ul className="space-y-3">
                {informationLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary text-sm transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">CATEGORIES</h3>
              <ul className="space-y-3">
                {categoryLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary text-sm transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">OUR SERVICES</h3>
              <ul className="space-y-3">
                {servicesLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary text-sm transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">SOCIALS</h3>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.url}
                      className="flex items-center gap-2 text-primary hover:text-teal-600 transition text-sm"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              Copyright &copy; 2025 Medilazar. All Rights Reserved.
            </p>
            {/* <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
              {bottomLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 hover:text-primary text-sm transition"
                >
                  {link.label}
                </Link>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
