"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface HeroCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
  external?: boolean;
}

export default function HeroCard({
  icon,
  title,
  description,
  href = "#",
  external = false
}: HeroCardProps) {
  const CardContent = (

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition">
            {icon}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
            {title}
          </h3>
          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {CardContent}
      </a>
    );
  } else {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );

  }
}
