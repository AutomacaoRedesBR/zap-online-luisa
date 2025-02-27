
import React from 'react';

interface HomeProps {
  userData: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
  };
  onLogout: () => void;
}

const Home = ({ userData, onLogout }: HomeProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <h1 className="text-4xl font-bold">Home</h1>
    </div>
  );
};

export default Home;
