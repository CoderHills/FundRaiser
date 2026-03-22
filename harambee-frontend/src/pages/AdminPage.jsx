import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../utils/api';
import './AdminPage.css';

export default function AdminPage({ navigate }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteMessage, setPromoteMessage] = useState('');

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate('home');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await apiFetch('/admin/analytics');
        setAnalytics(res.analytics);
      } else if (activeTab === 'users') {
        const res = await apiFetch('/admin/users');
        setUsers(res.users);
      } else if (activeTab === 'campaigns') {
        const res = await apiFetch('/admin/campaigns');
        setCampaigns(res.campaigns);
      } else if (activeTab === 'donations') {
        const res = await apiFetch('/admin/donations');
        setDonations(res.donations);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.is_admin) {
      loadData();
    }
  }, [activeTab, user]);

  const handleToggleActive = async (userId) => {
    try {
      await apiFetch(`/admin/users/${userId}/toggle-active`, { method: 'PUT' });
      loadData();
    } catch (err) {
      console.error('Failed to toggle active:', err);
    }
  };

  const handlePromoteToAdmin = async (e) => {
    e.preventDefault();
    setPromoteMessage('');
    if (!promoteEmail.trim()) {
      setPromoteMessage('Please enter an email address');
      return;
    }
    try {
      const res = await apiFetch('/admin/users/promote', {
        method: 'POST',
        body: JSON.stringify({ email: promoteEmail })
      });
      setPromoteMessage(res.message);
      setPromoteEmail('');
      loadData();
    } catch (err) {
      setPromoteMessage(err.message || 'Failed to promote user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This will also delete all their campaigns and donations.')) return;
    try {
      await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleApproveCampaign = async (campaignId) => {
    try {
      await apiFetch(`/admin/campaigns/${campaignId}/approve`, { method: 'PUT' });
      loadData();
    } catch (err) {
      console.error('Failed to approve campaign:', err);
    }
  };

  const handleRejectCampaign = async (campaignId) => {
    try {
      await apiFetch(`/admin/campaigns/${campaignId}/reject`, { method: 'PUT' });
      loadData();
    } catch (err) {
      console.error('Failed to reject campaign:', err);
    }
  };

  const handleCompleteCampaign = async (campaignId) => {
    try {
      await apiFetch(`/admin/campaigns/${campaignId}/complete`, { method: 'PUT' });
      loadData();
    } catch (err) {
      console.error('Failed to complete campaign:', err);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await apiFetch(`/admin/campaigns/${campaignId}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user || !user.is_admin) {
    return (
      <div className="admin-container">
        <div className="admin-access-denied">
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
          <button onClick={() => navigate('home')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'users', label: 'Users' },
    { id: 'donations', label: 'Donations' },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('home')}>
            Back to Site
          </button>
          <button className="nav-item" onClick={() => { logout(); navigate('home'); }}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header-bar">
          <div className="header-title">
            <h1>{menuItems.find(m => m.id === activeTab)?.label || 'Admin'}</h1>
            <p>Welcome back, <strong>{user.name}</strong></p>
          </div>
          <div className="header-actions">
            <span className="admin-badge">Administrator</span>
          </div>
        </header>

        <div className="admin-content">
          {loading ? (
            <div className="loading-state">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {activeTab === 'dashboard' && analytics && (
                <div className="dashboard-view">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{analytics.total_users}</span>
                        <span className="stat-label">Total Users</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{analytics.active_users}</span>
                        <span className="stat-label">Active Users</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{analytics.total_campaigns}</span>
                        <span className="stat-label">Total Campaigns</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{analytics.active_campaigns}</span>
                        <span className="stat-label">Active Campaigns</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{analytics.total_donations}</span>
                        <span className="stat-label">Total Donations</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-content">
                        <span className="stat-value">{formatCurrency(analytics.total_donated)}</span>
                        <span className="stat-label">Total Raised</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Campaigns */}
              {activeTab === 'campaigns' && (
                <div className="data-view">
                  <div className="view-header">
                    <h2>All Campaigns ({campaigns.length})</h2>
                  </div>
                  {campaigns.length === 0 ? (
                    <div className="empty-state">
                      <p>No campaigns found</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Organizer</th>
                            <th>Target</th>
                            <th>Raised</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaigns.map(c => (
                            <tr key={c.id}>
                              <td>{c.id}</td>
                              <td className="cell-title">{c.title}</td>
                              <td>{c.organizer}</td>
                              <td>{formatCurrency(c.target)}</td>
                              <td>{formatCurrency(c.raised)}</td>
                              <td>
                                <span className={`badge badge-${c.status}`}>
                                  {c.status}
                                </span>
                              </td>
                              <td>{formatDate(c.created_at)}</td>
                              <td className="cell-actions">
                                {c.status === 'pending' && (
                                  <>
                                    <button onClick={() => handleApproveCampaign(c.id)} className="btn-action btn-approve">
                                      Approve
                                    </button>
                                    <button onClick={() => handleRejectCampaign(c.id)} className="btn-action btn-reject">
                                      Reject
                                    </button>
                                  </>
                                )}
                                {c.status === 'active' && (
                                  <button onClick={() => handleCompleteCampaign(c.id)} className="btn-action btn-complete">
                                    Complete
                                  </button>
                                )}
                                {c.status === 'rejected' && (
                                  <button onClick={() => handleApproveCampaign(c.id)} className="btn-action btn-approve">
                                    Re-approve
                                  </button>
                                )}
                                <button onClick={() => handleDeleteCampaign(c.id)} className="btn-action btn-delete">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Users */}
              {activeTab === 'users' && (
                <div className="data-view">
                  <div className="view-header">
                    <h2>All Users ({users.length})</h2>
                  </div>
                  <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <form onSubmit={handlePromoteToAdmin} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="email"
                        placeholder="Enter user email to promote as admin"
                        value={promoteEmail}
                        onChange={(e) => setPromoteEmail(e.target.value)}
                        style={{ flex: 1, minWidth: '200px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                      />
                      <button type="submit" className="btn-action btn-approve">Promote to Admin</button>
                    </form>
                    {promoteMessage && (
                      <p style={{ margin: '0.5rem 0 0', color: promoteMessage.includes('error') || promoteMessage.includes('Failed') ? 'var(--error)' : 'var(--grass-d)', fontSize: '0.9rem' }}>{promoteMessage}</p>
                    )}
                  </div>
                  {users.length === 0 ? (
                    <div className="empty-state">
                      <p>No users found</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Verified</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u.id}>
                              <td>{u.id}</td>
                              <td className="cell-name">{u.name}</td>
                              <td>{u.email}</td>
                              <td>{u.phone || '-'}</td>
                              <td>
                                <span className={`badge ${u.verified ? 'badge-active' : 'badge-inactive'}`}>
                                  {u.verified ? 'Verified' : 'Pending'}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${u.is_admin ? 'badge-active' : 'badge-inactive'}`}>
                                  {u.is_admin ? 'Admin' : 'User'}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${u.is_active ? 'badge-active' : 'badge-suspended'}`}>
                                  {u.is_active ? 'Active' : 'Suspended'}
                                </span>
                              </td>
                              <td>{formatDate(u.created_at)}</td>
                              <td className="cell-actions">
                                {u.id !== user.id && (
                                  <>
                                    <button 
                                      onClick={() => handleToggleActive(u.id)} 
                                      className={`btn-action ${u.is_active ? 'btn-warning' : 'btn-success'}`}
                                    >
                                      {u.is_active ? 'Suspend' : 'Activate'}
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteUser(u.id)} 
                                      className="btn-action btn-delete"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Donations */}
              {activeTab === 'donations' && (
                <div className="data-view">
                  <div className="view-header">
                    <h2>All Donations ({donations.length})</h2>
                  </div>
                  {donations.length === 0 ? (
                    <div className="empty-state">
                      <p>No donations found</p>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Donor</th>
                            <th>Amount</th>
                            <th>Campaign</th>
                            <th>Status</th>
                            <th>Anonymous</th>
                            <th>Message</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map(d => (
                            <tr key={d.id}>
                              <td>{d.id}</td>
                              <td>{d.anonymous ? 'Anonymous' : d.donor_name}</td>
                              <td className="cell-amount">{formatCurrency(d.amount)}</td>
                              <td>Campaign {d.campaign_id}</td>
                              <td>
                                <span className={`badge badge-${d.status}`}>
                                  {d.status}
                                </span>
                              </td>
                              <td>{d.anonymous ? 'Yes' : 'No'}</td>
                              <td className="cell-message">{d.message || '-'}</td>
                              <td>{formatDate(d.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
