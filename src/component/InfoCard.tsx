import React from 'react';
import { Link } from 'react-router-dom';

interface InfoCardProps {
  title: string;
  value: string | number;
  link: string; // Ganti dari onClick ke link
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, link }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xs text-center hover:shadow-lg transition">
      <h3 className="text-gray-600 font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold text-green-700">{value}</p>
      
      <Link
        to={link}
        className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full"
      >
        Selengkapnya
      </Link>
    </div>
  );
};

export default InfoCard;
