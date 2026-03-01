import React, {useState, useEffect} from 'react';
import {FaSearch, FaTimes, FaUserEdit, FaUserCog, FaUser, FaEnvelope, FaIdCard, FaCheck, FaBan} from 'react-icons/fa';
import {ENV} from '../../conf/env';
import {useAuthStore} from '../../store/auth.store';
import './UserManager.css';

const UsersManager = () => {
    const {user: currentUser, access_token} = useAuthStore();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    // Estados para mensajes
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    // Cargar usuarios
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtrar usuarios cuando cambia el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = users.filter(user =>
                user.name?.toLowerCase().includes(term) ||
                user.username?.toLowerCase().includes(term) ||
                user.email?.toLowerCase().includes(term)
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${ENV.API_URL}/Login/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Error fetching users');

            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleMakeAdmin = async (userId) => {
        if (userId === currentUser?.id) {
            showErrorMessage("You cannot modify your own admin status");
            return;
        }

        setUpdatingId(userId);

        try {
            const response = await fetch(`${ENV.API_URL}/Login/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error updating user');
            }

            // Actualizar la lista local
            setUsers(users.map(u =>
                u.id === userId
                    ? {...u, is_superuser: true}
                    : u
            ));

            showSuccessMessage(`User promoted to admin successfully`);
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage(error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemoveAdmin = async (userId) => {
        if (userId === currentUser?.id) {
            showErrorMessage("You cannot modify your own admin status");
            return;
        }

        setUpdatingId(userId);

        try {
            const response = await fetch(`${ENV.API_URL}/Login/removeAdmin/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error removing admin');
            }

            // Actualizar la lista local
            setUsers(users.map(u =>
                u.id === userId
                    ? {...u, is_superuser: false}
                    : u
            ));

            showSuccessMessage(`Admin privileges removed successfully`);
        } catch (error) {
            console.error('Error:', error);
            showErrorMessage(error.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSuccessMessage('');
        }, 3000);
    };

    const showErrorMessage = (message) => {
        setErrorMessage(message);
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
            setErrorMessage('');
        }, 3000);
    };

    if (loading) {
        return (
            <div className="users-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="users-container">
            {/* Header */}
            <div className="users-header">
                <h1 className="users-title">
                    <FaUserCog/> User Management
                </h1>
                <div className="search-box">
                    <FaSearch className="search-icon"/>
                    <input
                        type="text"
                        placeholder="Search by name, username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            <FaTimes/>
                        </button>
                    )}
                </div>
            </div>

            {/* Mensajes */}
            {showSuccess && (
                <div className="success-message">
                    <FaCheck/> {successMessage}
                    <button onClick={() => setShowSuccess(false)}>×</button>
                </div>
            )}

            {showError && (
                <div className="error-message">
                    <FaBan/> {errorMessage}
                    <button onClick={() => setShowError(false)}>×</button>
                </div>
            )}

            {/* Estadísticas */}
            <div className="users-stats">
                <div className="stat-card">
                    <span className="stat-value">{users.length}</span>
                    <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{users.filter(u => u.is_superuser).length}</span>
                    <span className="stat-label">Administrators</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{filteredUsers.length}</span>
                    <span className="stat-label">Filtered</span>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="users-table-container">
                {filteredUsers.length === 0 ? (
                    <div className="no-results">
                        <p>No users found</p>
                        {searchTerm && (
                            <button className="clear-filter" onClick={() => setSearchTerm('')}>
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className={user.id === currentUser?.id ? 'current-user' : ''}>
                                <td>
                                    <span className="user-id">#{user.id}</span>
                                </td>
                                <td>
                                    <div className="user-name-cell">
                                        <div className="user-avatar">
                                            <FaUser/>
                                        </div>
                                        <span>{user.name}</span>
                                        {user.id === currentUser?.id && (
                                            <span className="you-badge">You</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className="user-username">@{user.username}</span>
                                </td>
                                <td>
                                    <a href={`mailto:${user.email}`} className="user-email">
                                        <FaEnvelope/> {user.email}
                                    </a>
                                </td>
                                <td>
                                    {user.is_superuser ? (
                                        <span className="role-badge admin">
                                                <FaUserCog/> Admin
                                            </span>
                                    ) : (
                                        <span className="role-badge user">
                                                <FaUser/> User
                                            </span>
                                    )}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {user.is_superuser ? (
                                            <button
                                                className="action-btn remove-admin"
                                                onClick={() => handleRemoveAdmin(user.id)}
                                                disabled={updatingId === user.id || user.id === currentUser?.id}
                                                title={user.id === currentUser?.id ? "Cannot modify yourself" : "Remove admin privileges"}
                                            >
                                                {updatingId === user.id ? (
                                                    '...'
                                                ) : (
                                                    <>
                                                        <FaBan/> Remove Admin
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                className="action-btn make-admin"
                                                onClick={() => handleMakeAdmin(user.id)}
                                                disabled={updatingId === user.id || user.id === currentUser?.id}
                                                title={user.id === currentUser?.id ? "Cannot modify yourself" : "Make admin"}
                                            >
                                                {updatingId === user.id ? (
                                                    '...'
                                                ) : (
                                                    <>
                                                        <FaUserCog/> Make Admin
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Información adicional */}
            <div className="users-footer">
                <p className="info-note">
                    <FaUserCog/> Only administrators can modify user roles. You cannot modify your own admin status.
                </p>
            </div>
        </div>
    );
};

export default UsersManager;