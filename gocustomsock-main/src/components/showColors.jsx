import React from 'react';

const ShowColors = ({ colors, onClose }) => {
  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center'>
      <div className='bg-white p-4 rounded-lg shadow-lg'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-600 hover:text-gray-900'
        >
          &times;
        </button>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>More Colors</h2>
        <div className='flex flex-row flex-wrap gap-2'>
          {colors.map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              className='w-8 h-8 rounded-full border-2 border-gray-300'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowColors;
