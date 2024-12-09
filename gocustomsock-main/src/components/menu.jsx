import React from 'react';

function Menu() {
  return (
    <div className="absolute bottom-72 left-0 right-0 p-4 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-lg font-semibold text-red-600 flex-1 mr-4">
        <a href="#">1. Upload Logo</a>
      </h1>
      <h1 className="text-lg font-semibold text-gray-500 flex-1 ml-4 text-right">
        <a href="#">2. Select Design Template</a>
      </h1>
    </div>
  );
}

export default Menu;
