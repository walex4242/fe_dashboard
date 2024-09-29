import { useState, useEffect } from 'react';

interface Level {
    _id: string;
    name: string;
}


interface LevelModalProps {
    isOpen: boolean;
    onClose: () => void;
    level: Level | null; // Use the Level interface
    isEditing: boolean;
    communityId: string;
    onLevelCreated: (newLevel: Level) => void;  // Change return type to void
    onLevelUpdated: (updatedLevel: Level) => void; // Change return type to void
}

const LevelModal = ({ isOpen, onClose, level, isEditing, communityId, onLevelCreated, onLevelUpdated }: LevelModalProps) => {
    const [levelName, setLevelName] = useState('');

    useEffect(() => {
        if (isEditing && level) {
            setLevelName(level.name);
        } else {
            setLevelName('');
        }
    }, [isEditing, level]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && level) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/level/${level._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: levelName }),
            });
            if (response.ok) {
                const updatedLevel: Level = await response.json();
                onLevelUpdated(updatedLevel); // Call the update function
                onClose();
            } else {
                console.error('Failed to update level');
            }
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/level/${communityId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: levelName }),
            });
            if (response.ok) {
                const newLevel: Level = await response.json();
                onLevelCreated(newLevel); // Call the create function
                onClose();
            } else {
                console.error('Failed to create level');
            }
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded shadow-md">
                    <h2 className="text-lg font-bold">{isEditing ? 'Edit Level' : 'Create Level'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={levelName}
                            onChange={(e) => setLevelName(e.target.value)}
                            placeholder="Level Name"
                            required
                            className="border p-2 w-full mt-2"
                        />
                        <div className="flex justify-between mt-4">
                            <button type="button" onClick={onClose} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black">
                                Cancel
                            </button>
                            <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black">
                                {isEditing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default LevelModal;

