import React, { useState, useEffect } from 'react';
import {ENV} from "../../conf/env";

const ProductForm = () => {
    // Estado para el producto
    const [product, setProduct] = useState({
        nombre: '',
        descripcion: '',
        price: '',
        category: ''
    });


    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Estado para la imagen
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Cargar categorías al montar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${ENV.API_URL}/category`);
                if (!response.ok) {
                    throw new Error('Failed to load categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error('Error loading categories:', err);
                setError('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    // Manejar selección de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validaciones
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File is too large. Maximum size is 5MB.');
                return;
            }

            setImageFile(file);

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append('nombre', product.nombre);
            formData.append('descripcion', product.descripcion || '');
            formData.append('price', String(product.price));
            formData.append('category', String(product.category));
            formData.append('img_url', imageFile);

            const response = await fetch(`${ENV.API_URL}/product/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // 🔥 FALTABA ESTO
                },
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Error creating product');
            }

            setSuccess('Product created successfully!');
            clearForm();

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    // Función para limpiar el formulario
    const clearForm = () => {
        setProduct({
            nombre: '',
            descripcion: '',
            price: '',
            category: ''
        });
        setImageFile(null);
        setImagePreview('');
        setError('');
        setSuccess('');
        const fileInput = document.getElementById('imageFile');
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="card-title mb-0">Create New Product</h3>
                        </div>
                        <div className="card-body p-4">
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <strong>Error:</strong> {error}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setError('')}
                                    ></button>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    {success}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSuccess('')}
                                    ></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* Nombre */}
                                <div className="mb-4">
                                    <label htmlFor="nombre" className="form-label fw-bold">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        className="form-control form-control-lg"
                                        value={product.nombre}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                    <div className="form-text">This is the name that customers will see</div>
                                </div>

                                {/* Descripción */}
                                <div className="mb-4">
                                    <label htmlFor="descripcion" className="form-label fw-bold">
                                        Description
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        className="form-control"
                                        rows="4"
                                        value={product.descripcion}
                                        onChange={handleChange}
                                        placeholder="Describe your product..."
                                    />
                                    <div className="form-text">Provide detailed information about the product</div>
                                </div>

                                {/* Precio */}
                                <div className="mb-4">
                                    <label htmlFor="price" className="form-label fw-bold">
                                        Price *
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            className="form-control"
                                            value={product.price}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0.01"
                                            required
                                        />
                                    </div>
                                    <div className="form-text">Enter the price in USD</div>
                                </div>

                                {/* IMAGEN - SELECTOR DE ARCHIVO */}
                                <div className="mb-4">
                                    <label htmlFor="imageFile" className="form-label fw-bold">
                                        Product Image *
                                    </label>

                                    {/* Vista previa */}
                                    {imagePreview && (
                                        <div className="mb-3">
                                            <p className="mb-2">Image Preview:</p>
                                            <div className="border rounded p-2 text-center">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '200px', maxWidth: '100%' }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Selector de archivo */}
                                    <input
                                        type="file"
                                        id="imageFile"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        required
                                    />

                                    <div className="form-text">
                                        Select an image file from your computer (Max 5MB, JPG, PNG, GIF, WebP)
                                    </div>

                                    {/* Info del archivo seleccionado */}
                                    {imageFile && (
                                        <div className="alert alert-info mt-2 p-2">
                                            <i className="bi bi-file-image me-2"></i>
                                            <strong>Selected:</strong> {imageFile.name}
                                            <span className="ms-2">
                                                ({(imageFile.size / 1024).toFixed(0)} KB)
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Categoría */}
                                <div className="mb-4">
                                    <label htmlFor="category" className="form-label fw-bold">
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="form-select"
                                        value={product.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name }
                                            </option>
                                        ))}
                                    </select>
                                    <div className="form-text">Choose the appropriate category for your product</div>
                                </div>

                                {/* Botones */}
                                <div className="d-flex gap-3 mt-5">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg flex-grow-1"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating Product...
                                            </>
                                        ) : (
                                            'Create Product'
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={clearForm}
                                        disabled={loading}
                                    >
                                        Clear Form
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Resumen del producto en tiempo real */}
                    <div className="card shadow mt-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Product Preview</h5>
                        </div>
                        <div className="card-body">
                            {product.nombre ? (
                                <div className="row">
                                    <div className="col-md-4">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Product"
                                                className="img-fluid rounded"
                                                style={{ height: '150px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="bg-light rounded d-flex align-items-center justify-content-center"
                                                 style={{ height: '150px' }}>
                                                <span className="text-muted">No image selected</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{product.nombre}</h5>
                                        <p className="text-muted">
                                            {product.descripcion || 'No description provided'}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="h4 text-primary">
                                                ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                                            </span>
                                            <span className="badge bg-secondary">
                                                {categories.find(c => c.id === parseInt(product.category))?.nombre || 'No category selected'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted mb-0">Start filling the form to see a preview here</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;