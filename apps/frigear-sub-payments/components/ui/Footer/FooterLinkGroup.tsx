// FooterLinkGroup.tsx
import Link from "next/link";
import React from "react";

interface LinkItem {
  href: string;
  label: string;
}

interface FooterLinkGroupProps {
  links: LinkItem[];
}

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ links }) => {
  return (
    <ul className="flex flex-col md:flex-row md:space-x-4">
      {links.map((link, index) => (
        <li key={index} className="py-1 md:py-0">
          <Link href={link.href}>
            <span className="text-white transition duration-150 ease-in-out hover:text-indigo-500 cursor-pointer">
              {link.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default FooterLinkGroup;
