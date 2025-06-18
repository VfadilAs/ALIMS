import React from "react";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeletePopup: React.FC<Props> = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 text-center w-full max-w-sm text-black">
        <p className="text-lg font-semibold mb-4">Yakin ingin menghapus data ini..?</p>
        <div className="flex justify-center gap-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>No</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
