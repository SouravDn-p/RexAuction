import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ProfileSettings = () => {
    const { user, dbUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (user?.email) {
                    const response = await axiosSecure.get(`/user/${user.email}`);
                    setProfileData(response.data);
                    setFormData(response.data || {});
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user, axiosSecure]);

    const openModal = (section) => {
        setActiveSection(section);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosSecure.patch(`/user/${user.email}`, formData);
            setProfileData(response.data);
            closeModal();
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    if (loading) return <div className="flex justify-center py-8">Loading profile...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!profileData) return <div className="p-4">No profile data found</div>;

    const userData = profileData || dbUser;
    const userPhoto = userData?.photoURL || user?.photoURL;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Profile Header with Photo */}
            <div className="relative rounded-lg p-4 border border-gray-400">
                <button 
                    onClick={() => openModal('photo')}
                    className="absolute top-4 right-4 flex items-center gap-1 text-gray-500 hover:text-blue-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="text-sm">Edit</span>
                </button>
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {userPhoto ? (
                                <img 
                                    src={userPhoto} 
                                    alt="Profile" 
                                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = 'https://via.placeholder.com/150';
                                    }}
                                />
                            ) : (
                                <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white shadow-md">
                                    {userData?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                                </div>
                            )}
                            <button 
                                onClick={() => openModal('photo')}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        <button 
                            onClick={() => openModal('photo')}
                            className="text-blue-600 text-sm font-medium hover:text-blue-800"
                        >
                            Change photo
                        </button>
                    </div>

                    <div className="flex-1 space-y-2">
                        <h1 className="text-2xl font-bold">{userData?.name || 'No name'}</h1>
                        <p className="text-gray-600 capitalize">{userData?.role || 'No role'}</p>
                        <p className="text-gray-500">
                            {userData?.city ? `${userData.city}, ${userData.country}` : 'No location'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Information Section */}
            <div className="relative space-y-6 border border-gray-400 p-4 rounded-lg">
                <button 
                    onClick={() => openModal('personal')}
                    className="absolute top-4 right-4 flex items-center gap-1 text-gray-500 hover:text-blue-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="text-sm">Edit</span>
                </button>
                <h2 className="text-lg font-semibold border-b pb-2">Personal information</h2>
                
                <div className="flex gap-14">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                        <p className="font-medium">
                            {userData?.name?.split(' ')[0] || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                        <p className="font-medium">
                            {userData?.name?.split(' ').slice(1).join(' ') || 'Not provided'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email address</label>
                        <p className="font-medium">{userData?.email || 'Not provided'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                        <p className="font-medium">{userData?.phone || 'Not provided'}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                    <p className="font-medium">{userData?.bio || 'Not provided'}</p>
                </div>
            </div>

            {/* Address Section */}
            <div className="relative space-y-6 border border-gray-400 rounded-lg p-4">
                <button 
                    onClick={() => openModal('address')}
                    className="absolute top-4 right-4 flex items-center gap-1 text-gray-500 hover:text-blue-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="text-sm">Edit</span>
                </button>
                <h2 className="text-lg font-semibold border-b pb-2">Address</h2>
                
                <div className="flex gap-10">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
                        <p className="font-medium">{userData?.country || 'Not provided'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">City/State</label>
                        <p className="font-medium">{userData?.city || 'Not provided'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Postal Code</label>
                        <p className="font-medium">{userData?.postalCode || 'Not provided'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">TAX ID</label>
                        <p className="font-medium">{userData?.taxId || 'Not provided'}</p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Edit {activeSection === 'photo' ? 'Profile Photo' : 
                                            activeSection === 'personal' ? 'Personal Information' : 'Address'}
                                    </Dialog.Title>

                                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                        {activeSection === 'photo' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center">
                                                    <div className="relative">
                                                        {userPhoto ? (
                                                            <img 
                                                                src={userPhoto} 
                                                                alt="Profile" 
                                                                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                                                            />
                                                        ) : (
                                                            <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white shadow-md">
                                                                {userData?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Upload new photo
                                                    </label>
                                                    <input 
                                                        type="file" 
                                                        className="block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-md file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-blue-50 file:text-blue-700
                                                        hover:file:bg-blue-100"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (event) => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        photoURL: event.target.result
                                                                    }));
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {activeSection === 'personal' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            value={formData.name?.split(' ')[0] || ''}
                                                            onChange={(e) => {
                                                                const lastName = formData.name?.split(' ').slice(1).join(' ') || '';
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    name: `${e.target.value} ${lastName}`.trim()
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            value={formData.name?.split(' ').slice(1).join(' ') || ''}
                                                            onChange={(e) => {
                                                                const firstName = formData.name?.split(' ')[0] || '';
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    name: `${firstName} ${e.target.value}`.trim()
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        disabled
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone || ''}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Bio
                                                    </label>
                                                    <textarea
                                                        name="bio"
                                                        value={formData.bio || ''}
                                                        onChange={handleChange}
                                                        rows="3"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {activeSection === 'address' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Country
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="country"
                                                            value={formData.country || ''}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            City/State
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="city"
                                                            value={formData.city || ''}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Postal Code
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="postalCode"
                                                            value={formData.postalCode || ''}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            TAX ID
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="taxId"
                                                            value={formData.taxId || ''}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ProfileSettings;