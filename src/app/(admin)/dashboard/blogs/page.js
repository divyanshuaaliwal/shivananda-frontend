"use client";

import React, { useState, useEffect } from "react";
import { getBlogs, deleteBlog, createBlog, updateBlog, getBlog } from "../../utils/api.js";
import BlogForm from './BlogForm';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pendingId, setPendingId] = useState(null);

    useEffect(() => {
        loadBlogs();
    }, [currentPage]);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const res = await getBlogs({ page: currentPage, limit: 10 });
            if (res.data.status === 'success') {
                setBlogs(res.data.data.blogs);
                setTotalPages(res.data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Failed to load blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingBlog(null);
        setShowForm(true);
    };

    const handleEdit = async (id) => {
        try {
            const res = await getBlog(id);
            if (res.data.status === 'success') {
                setEditingBlog(res.data.data.blog);
                setShowForm(true);
            }
        } catch (error) {
            console.error('Failed to load blog:', error);
            alert('Failed to load blog for editing');
        }
    };

    const handleSave = async (blogData) => {
        try {
            if (editingBlog) {
                await updateBlog(editingBlog._id, blogData);
                alert('Blog updated successfully!');
            } else {
                await createBlog(blogData);
                alert('Blog created successfully!');
            }
            setShowForm(false);
            setEditingBlog(null);
            await loadBlogs();
        } catch (error) {
            console.error('Failed to save blog:', error);
            throw error;
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingBlog(null);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            setPendingId(id);
            await deleteBlog(id);
            await loadBlogs();
        } catch (error) {
            console.error('Failed to delete blog:', error);
            alert('Failed to delete blog');
        } finally {
            setPendingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Blog
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {blogs.map((blog) => (
                                <tr key={blog._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{blog.name}</div>
                                        <div className="text-sm text-gray-500">{blog.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                blog.isPublished
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {blog.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(blog._id)}
                                            disabled={pendingId === blog._id}
                                            className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            disabled={pendingId === blog._id}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {pendingId === blog._id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showForm && (
                <BlogForm
                    blog={editingBlog}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}