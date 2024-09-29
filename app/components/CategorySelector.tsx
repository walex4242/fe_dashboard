"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './CategoryModal';
import Image from 'next/image';

interface Category {
    _id: string;
    name: string;
}

interface CategorySelectorProps {
    community: string;
    level: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ community, level }) => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [isEditCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editCategoryName, setEditCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category/${community}/${level}`);
            const data = await response.json();
            setCategories(data);
        };

        fetchCategories();
    }, [community, level]);

    const handleCategorySelect = (categoryId: string) => {
        router.push(`/community/${community}/level/${level}/category/${categoryId}`); // Update the URL here
    };

    const openAddCategoryModal = () => setAddCategoryModalOpen(true);
    const closeAddCategoryModal = () => {
        setAddCategoryModalOpen(false);
        setNewCategoryName('');
    };

    const openEditCategoryModal = (category: Category) => {
        setEditingCategoryId(category._id);
        setEditCategoryName(category.name);
        setEditCategoryModalOpen(true);
    };

    const closeEditCategoryModal = () => {
        setEditCategoryModalOpen(false);
        setEditingCategoryId(null);
        setEditCategoryName('');
    };

    const handleAddCategory = async () => {
        const response = await fetch(`${ process.env.NEXT_PUBLIC_BASE_URL }/category/${level}`, { // Ensure `level` is the correct levelId here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newCategoryName, community, level }), // Make sure you're sending the correct payload
        });


        if (response.ok) {
            closeAddCategoryModal();
            const newCategory = await response.json();
            setCategories([...categories, newCategory]);
        } else {
            // Handle error
            const errorData = await response.json();
            console.error('Failed to create category:', errorData);
        }
    };

    const handleEditCategory = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category/${editingCategoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: editCategoryName, community, level }),
        });

        if (response.ok) {
            const updatedCategory = await response.json();
            setCategories(categories.map(cat => (cat._id === updatedCategory._id ? updatedCategory : cat)));
            closeEditCategoryModal();
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this category?");
        if (!confirmDelete) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category/${categoryId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setCategories(categories.filter(cat => cat._id !== categoryId));
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <div className='flex gap-2'>
                    <button onClick={() => router.back()} className="bg-gray-700 text-white px-4 py-2 rounded ml-3 hover:bg-black">
                        Back
                    </button>
                    <button onClick={() => router.push('/')} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black">
                        Home
                    </button>
                </div>
                <button onClick={openAddCategoryModal} className="bg-gray-700 text-white px-4 py-2 rounded mr-3 hover:bg-black">
                    Create Category
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <div key={category._id} className="border p-4 rounded shadow-md">
                        <h3 onClick={() => handleCategorySelect(category._id)} className="text-lg font-semibold cursor-pointer text-center">
                            {category.name}
                        </h3>
                        <div className="flex justify-between mt-2">
                            <button onClick={() => openEditCategoryModal(category)}>
                                <Image src='/edit.svg' alt='' width={20} height={20} className='w-6 h-6' />
                            </button>
                            <button onClick={() => handleDeleteCategory(category._id)}>
                                <Image src='/delete.svg' alt='' width={20} height={20} className='w-7 h-7' />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Category Modal */}
            {isAddCategoryModalOpen && (
                <Modal title=" Create Category">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category Name"
                        className="border rounded px-2 py-1 mb-2 w-full"
                    />
                    <div className="flex justify-between mt-4">
                        <button onClick={closeAddCategoryModal} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-black">
                            Cancel
                        </button>
                        <button onClick={handleAddCategory} className="bg-gray-700 text-white px-4 py-2 rounded mr-2 hover:bg-black">
                            Create
                        </button>
                    </div>
                </Modal>
            )}

            {/* Edit Category Modal */}
            {isEditCategoryModalOpen && (
                <Modal title="">
                    <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        placeholder="Category Name"
                        className="border rounded px-2 py-1 mb-2 w-full"
                    />
                    <div className="flex justify-between mt-4">
                        <button onClick={handleEditCategory} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            Save
                        </button>
                        <button onClick={closeEditCategoryModal} className="bg-gray-500 text-white px-4 py-2 rounded">
                            X
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CategorySelector;
