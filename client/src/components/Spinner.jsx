import React from 'react';
import { ClipLoader } from 'react-spinners'; 

const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <ClipLoader color="#0070f3" size={50} />
    </div>
  );
};

export default Spinner;