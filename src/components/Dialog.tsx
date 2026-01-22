import React from 'react';
import { Dialog } from '@headlessui/react';

const CustomDialog = ({ isOpen, onClose, title, message }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg p-6 z-20">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          <Dialog.Description className="mt-2">{message}</Dialog.Description>
          <div className="mt-4">
            <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CustomDialog;