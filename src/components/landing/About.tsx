import React from 'react';
import { FaTwitter, FaEnvelope } from 'react-icons/fa';



const About: React.FC = () => {
  return (
    <section className="py-4 bg-gray-100" id="about">
      <div className="container mx-auto px-4">
        {/* <h2 className="text-3xl font-bold text-center mb-8">About Us</h2> */}
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <div className="flex items-center space-x-4 text-sm">
            <a href="mailto:support@chatsaas.net" className="flex items-center text-blue-600 hover:text-blue-800">
              <FaEnvelope className="mr-2" />
              support@chatsaas.net
            </a>
            <a href="https://x.com/AiExplore8" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-400 hover:text-blue-600">
              <FaTwitter className="mr-2" />
              @chatsaas.net
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
