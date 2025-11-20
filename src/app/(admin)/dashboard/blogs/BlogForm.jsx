import React, { useState, useEffect } from 'react';

export default function BlogForm({ blog, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        bgImage: '',
        image: '',
        publishDate: '',
        overview: '',
        description: '',
        application: [{ title: '', description: '' }],
        challenges: [{ title: '', description: '' }],
        applications: [{ title: '', description: '' }],
        specifications: [{ title: '', value: '' }],
        images: [''],
        totalUsers: 0,
        isPublished: true,
        featured: false,
        metaTitle: '',
        metaDescription: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingBgImage, setUploadingBgImage] = useState(false);
    const [uploadingImages, setUploadingImages] = useState({});

    useEffect(() => {
        if (blog) {
            setFormData({
                name: blog.name || '',
                slug: blog.slug || '',
                bgImage: blog.bgImage || '',
                image: blog.image || '',
                publishDate: blog.publishDate || '',
                overview: blog.overview || '',
                description: blog.description || '',
                application: blog.application || [{ title: '', description: '' }],
                challenges: blog.challenges || [{ title: '', description: '' }],
                applications: blog.applications || [{ title: '', description: '' }],
                specifications: blog.specifications || [{ title: '', value: '' }],
                images: blog.images || [''],
                totalUsers: blog.totalUsers || 0,
                isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
                featured: blog.featured || false,
                metaTitle: blog.metaTitle || '',
                metaDescription: blog.metaDescription || ''
            });
        }
    }, [blog]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onCancel]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;


        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (index, field, value, arrayName) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addArrayItem = (arrayName) => {
        const newItem = arrayName === 'specifications'
            ? { title: '', value: '' }
            : { title: '', description: '' };

        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], newItem]
        }));
    };

    const removeArrayItem = (index, arrayName) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    const handleImageChange = (index, value) => {

        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => i === index ? value : img)
        }));
    };

    const addImage = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, '']
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // console.log('Main image upload started:', file.name, file.size, file.type);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (5MB limit for images)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file must be less than 5MB');
            return;
        }

        try {
            setUploadingImage(true);

            const formData = new FormData();
            formData.append('image', file);

            // console.log('Uploading to:', '/api/upload/image');

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();
            // console.log('Upload response:', result);

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    image: result.imageUrl
                }));
                // console.log('Main image uploaded successfully:', result.imageUrl);
            } else {
                console.error('Upload failed:', result.message);
                alert('Image upload failed: ' + result.message);
            }
        } catch (error) {
            console.error('Image upload error:', error);
            alert('Failed to upload image: ' + error.message);
        } finally {
            setUploadingImage(false);
            event.target.value = '';
        }
    };

    const handleBgImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // console.log('Background image upload started:', file.name, file.size, file.type);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (5MB limit for images)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file must be less than 5MB');
            return;
        }

        try {
            setUploadingBgImage(true);

            const formData = new FormData();
            formData.append('image', file);

            // console.log('Uploading background image to:', '/api/upload/image');

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();
            // console.log('Background upload response:', result);

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    bgImage: result.imageUrl
                }));
                // console.log('Background image uploaded successfully:', result.imageUrl);
            } else {
                console.error('Background upload failed:', result.message);
                alert('Background image upload failed: ' + result.message);
            }
        } catch (error) {
            console.error('Background image upload error:', error);
            alert('Failed to upload background image: ' + error.message);
        } finally {
            setUploadingBgImage(false);
            event.target.value = '';
        }
    };

    const handleAdditionalImageUpload = async (event, index) => {
        const file = event.target.files[0];
        if (!file) return;

        // console.log(`Additional image ${index} upload started:`, file.name, file.size, file.type);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (5MB limit for images)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file must be less than 5MB');
            return;
        }

        try {
            setUploadingImages(prev => ({ ...prev, [`additional-${index}`]: true }));

            const formData = new FormData();
            formData.append('image', file);

            // console.log(`Uploading additional image ${index} to:`, '/api/upload/image');

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();
            // console.log(`Additional image ${index} upload response:`, result);

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    images: prev.images.map((img, i) => i === index ? result.imageUrl : img)
                }));
                // console.log(`Additional image ${index} uploaded successfully:`, result.imageUrl);
            } else {
                console.error(`Additional image ${index} upload failed:`, result.message);
                alert('Image upload failed: ' + result.message);
            }
        } catch (error) {
            console.error(`Additional image ${index} upload error:`, error);
            alert('Failed to upload image: ' + error.message);
        } finally {
            setUploadingImages(prev => ({ ...prev, [`additional-${index}`]: false }));
            event.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        setLoading(true);

        try {
            // Clean arrays: remove empty items and empty image URLs
            const cleanedApplications = (formData.applications || []).filter(
                (item) => (item.title && item.title.trim()) || (item.description && item.description.trim())
            );
            const cleanedChallenges = (formData.challenges || []).filter(
                (item) => (item.title && item.title.trim()) || (item.description && item.description.trim())
            );
            const cleanedSpecifications = (formData.specifications || []).filter(
                (item) => (item.title && item.title.trim()) || (item.value && item.value.trim())
            );
            const cleanedImages = (formData.images || []).filter((url) => url && url.trim());

            // Build payload aligned with backend schema; drop unused 'application' if empty
            const { application, ...rest } = formData;
            const blogData = {
                ...rest,
                applications: cleanedApplications,
                challenges: cleanedChallenges,
                specifications: cleanedSpecifications,
                images: cleanedImages,
                publishDate: formData.publishDate || new Date().toISOString().split('T')[0]
            };

            await onSave(blogData);
        } catch (error) {
            console.error('Error saving blog:', error);
            const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.join('\n')
                : error.response?.data?.message || error.message || 'Unknown error';
            alert('Error saving blog:\n\n' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    return (
    
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
            // className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto"

            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onCancel();
                }
            }}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative">

                {/* <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative"> */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {blog ? 'Edit Blog' : 'Create New Blog'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {blog ? 'Update your blog content and settings' : 'Fill in the details to create a new blog post'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-2 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Blog Title *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter blog title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Slug *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="blog-url-slug"
                                    />
                                    <button
                                        type="button"
                                        onClick={generateSlug}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Publishing Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            Publishing Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publish Date
                                </label>
                                <input
                                    type="date"
                                    name="publishDate"
                                    value={formData.publishDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Users
                                </label>
                                <input
                                    type="number"
                                    name="totalUsers"
                                    value={formData.totalUsers}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            Content
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Overview *
                            </label>
                            <textarea
                                name="overview"
                                value={formData.overview}
                                onChange={handleChange}
                                rows={3}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Brief overview of the blog"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Detailed description"
                            />
                        </div>
                    </div>

                    {/* Applications Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                            Applications
                        </h3>
                        <div className="space-y-4">
                            {formData.applications.map((app, index) => (
                                <div key={index} className="border border-gray-300 rounded-md p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Application Title"
                                            value={app.title}
                                            onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'applications')}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Application Description"
                                            value={app.description}
                                            onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'applications')}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    {formData.applications.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem(index, 'applications')}
                                            className="mt-2 text-red-600 hover:text-red-900 text-sm"
                                        >
                                            Remove Application
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('applications')}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Add Application
                            </button>
                        </div>
                    </div>

                    {/* Challenges Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Challenges
                        </label>
                        {formData.challenges.map((challenge, index) => (
                            <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Challenge Title"
                                        value={challenge.title}
                                        onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'challenges')}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Challenge Description"
                                        value={challenge.description}
                                        onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'challenges')}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {formData.challenges.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'challenges')}
                                        className="mt-2 text-red-600 hover:text-red-900"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('challenges')}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Add Challenge
                        </button>
                    </div>

                    {/* Specifications Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specifications
                        </label>
                        {formData.specifications.map((spec, index) => (
                            <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Specification Title"
                                        value={spec.title}
                                        onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'specifications')}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Specification Value"
                                        value={spec.value}
                                        onChange={(e) => handleArrayChange(index, 'value', e.target.value, 'specifications')}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {formData.specifications.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'specifications')}
                                        className="mt-2 text-red-600 hover:text-red-900"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('specifications')}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Add Specification
                        </button>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Main Image
                        </label>
                        <div className="flex gap-2 mb-2 items-center">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={uploadingImage}
                                />
                                <button
                                    type="button"
                                    className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 relative ${uploadingImage ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? 'Uploading...' : 'Upload Main Image'}
                                </button>
                            </div>
                            {formData.image && (
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {formData.image && (
                            <div className="mt-2">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="h-24 object-cover rounded-md border"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Background Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Background Image
                        </label>
                        <div className="flex gap-2 mb-2 items-center">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBgImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={uploadingBgImage}
                                />
                                <button
                                    type="button"
                                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 relative ${uploadingBgImage ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                    disabled={uploadingBgImage}
                                >
                                    {uploadingBgImage ? 'Uploading...' : 'Upload Background Image'}
                                </button>
                            </div>
                            {formData.bgImage && (
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200"
                                    onClick={() => setFormData(prev => ({ ...prev, bgImage: '' }))}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {formData.bgImage && (
                            <div className="mt-2">
                                <img
                                    src={formData.bgImage}
                                    alt="Background Preview"
                                    className="h-24 object-cover rounded-md border"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Additional Images Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Images
                        </label>
                        {formData.images.map((img, index) => (
                            <div key={index} className="mb-4 p-3 border border-gray-300 rounded-md">
                                <div className="flex gap-2 mb-2">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleAdditionalImageUpload(e, index)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            disabled={uploadingImages[`additional-${index}`]}
                                        />
                                        <button
                                            type="button"
                                            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 relative ${uploadingImages[`additional-${index}`] ? 'opacity-75 cursor-not-allowed' : ''
                                                }`}
                                            disabled={uploadingImages[`additional-${index}`]}
                                        >
                                            {uploadingImages[`additional-${index}`] ? 'Uploading...' : 'Upload Image'}
                                        </button>
                                    </div>
                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {img && (
                                    <div className="mt-2">
                                        <img
                                            src={img}
                                            alt={`Additional image ${index + 1}`}
                                            className="h-24 object-cover rounded-md border"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImage}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Add Image
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleChange}
                                maxLength={60}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="SEO title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description
                            </label>
                            <input
                                type="text"
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleChange}
                                maxLength={160}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="SEO description"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Published
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Featured
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}