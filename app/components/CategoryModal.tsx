import React from 'react';

interface ModalProps {
    title: string;
    // onCancel: () => void;
    children: React.ReactNode; // This allows you to pass in the children
}

const Modal: React.FC<ModalProps> = ({ title, children }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="font-bold my-2">{title}</h2>
                {/* <button onClick={onCancel} className="text-red-500 mb-4">Cancel</button> */}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
