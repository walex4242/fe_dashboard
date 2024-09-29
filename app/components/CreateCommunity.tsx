"use client";
import { useState } from 'react';

interface CreateCommunityProps {
    onSubmit: (name: string) => void; // Function to call when submitting form
    onClose: () => void;              // Function to close the modal
    communityName?: string;           // Optional for editing an existing community
}

const CreateCommunity = ({ onSubmit, onClose, communityName = '' }: CreateCommunityProps) => {
    const [name, setName] = useState(communityName);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{communityName ? 'Edit Community' : 'Create Community'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-center text-gray-700">Community Name:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-between space-x-4">
                        <button type="button" className="px-4 py-2 bg-gray-500 hover:bg-black text-white rounded" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-gray-500 hover:bg-black text-white rounded">
                            {communityName ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCommunity;
