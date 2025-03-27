import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ProfileSettings = () => {
    const { user, dbUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (user?.email) {
                    const response = await axiosSecure.get(`/user/${user.email}`);
                    setProfileData(response.data);
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

    if (loading) return <div className="flex justify-center py-8">Loading profile...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!profileData) return <div className="p-4">No profile data found</div>;

    // Fallback to dbUser if profileData is incomplete
    const userData = profileData || dbUser;
    
    // Determine the photo source - prioritize database photo, then auth provider photo
    const userPhoto = userData?.photoURL || user?.photoURL;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Profile Header with Photo */}
            <div className="relative rounded-lg p-4 border border-gray-400">
                <button className="absolute top-4 right-4 flex items-center gap-1 text-gray-500 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="text-sm">Edit</span>
                </button>
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    {/* Profile Photo Section */}
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
                            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                            Change photo
                        </button>
                    </div>

                    {/* Profile Info */}
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
                <button className="absolute top-4 right-4 flex items-center gap-1 text-gray-500 hover:text-blue-600">
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
                <button className="absolute top-4 right-4 flex items-center gap-1 text-gray-500 hover:text-blue-600">
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
        </div>
    );
};

export default ProfileSettings;