import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (questionText: string) => void;
    initialText?: string; // Optional for editing
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, initialText }) => {
    const [questionText, setQuestionText] = React.useState<string>('');

    // Update questionText whenever the modal opens with a new initialText
    useEffect(() => {
        if (isOpen) {
            setQuestionText(initialText || ''); // Set the initial text when modal opens
        }
    }, [isOpen, initialText]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(questionText);
        setQuestionText(''); // Reset after submission
        onClose(); // Close modal after submission
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-bold mb-4">{initialText ? 'Edit Question' : 'Create Question'}</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="border border-gray-300 rounded p-2 w-full mb-4"
                        rows={4}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                    />
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="bg-gray-700 text-white px-4 py-2 rounded mr-2 hover:bg-black"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black"
                        >
                            {initialText ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
