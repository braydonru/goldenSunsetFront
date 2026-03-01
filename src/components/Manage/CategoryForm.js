import React, { useState, useEffect } from 'react';
import { ENV } from "../../conf/env";

const CategoryForm = () => {

    const [category, setCategory] = useState({ name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory(prev => ({ ...prev, [name]: value }));
    };

    const clearForm = () => {
        setCategory({ name: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append('name', category.name);

            const response = await fetch(`${ENV.API_URL}/category/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Error creating category');
            }

            setSuccess(`✅ Category "${category.name}" created successfully`);
            clearForm();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title mb-0">Create New Category</h3>
                        </div>

                        <div className="card-body p-4">

                            {success && (
                                <div className="alert alert-success text-center fw-bold">
                                    {success}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger text-center fw-bold">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        Category Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control form-control-lg"
                                        value={category.name}
                                        onChange={handleChange}
                                        placeholder="Enter Category"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading || success}
                                >
                                    {loading ? 'Creating category...' : 'Create Category'}
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
