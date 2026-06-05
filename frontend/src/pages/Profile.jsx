import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar, { avatars } from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { useUserActions } from '../hooks/useUserActions';
import { Edit2, Save, Trash2, Shield, Calendar, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile, logout, error, clearError } = useAuthStore();
  const { useHistory } = useUserActions();
  const { data: history = [] } = useHistory();
  
  const navigate = useNavigate();

  // Local form states
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'avatar1');
  const [selectedPlan, setSelectedPlan] = useState(user?.plan || 'standard');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    clearError();
    setSaveSuccess(false);

    if (!name.trim()) return;

    const res = await updateUserProfile({
      name,
      avatar: selectedAvatar,
      plan: selectedPlan,
    });

    if (res.success) {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000); // clear banner
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-brand-black text-white pb-24">
      {/* Header */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-28 space-y-12">
        {/* Banner Alert Success */}
        {saveSuccess && (
          <div className="bg-green-600/20 border border-green-600/50 text-green-200 px-4 py-3.5 rounded flex items-center gap-2 text-sm animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Profile updated successfully!
          </div>
        )}

        {/* Top Header */}
        <div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-netflix-sans select-none">
            Account Settings
          </h2>
          <p className="text-sm text-brand-gray mt-1">Manage your profiles, plan selections, and view your watch logs.</p>
        </div>

        {/* Profile Details Card */}
        <section className="bg-brand-darkGray/60 border border-white/5 rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Avatar selector col */}
          <div className="md:col-span-1 flex flex-col items-center space-y-3">
            <img 
              src={avatars[selectedAvatar] || avatars.avatar1} 
              alt="Profile avatar" 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded object-cover shadow-lg border border-white/10"
            />
            {isEditing && (
              <p className="text-xs text-brand-red font-bold uppercase tracking-wider select-none animate-pulse">
                Click below to change
              </p>
            )}
          </div>

          {/* Configuration form col */}
          <div className="md:col-span-3 space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Display Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Display Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full sm:max-w-md bg-zinc-800 border border-zinc-700 focus:border-brand-red focus:outline-none px-4 py-3 rounded text-white text-sm"
                    required
                  />
                ) : (
                  <div className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    {user?.name}
                    <button 
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-brand-gray hover:text-white p-1 hover:bg-white/5 rounded transition"
                      aria-label="Edit Name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar Grid (if editing) */}
              {isEditing && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select Avatar Icon</label>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(avatars).map((key) => (
                      <img 
                        key={key}
                        src={avatars[key]}
                        alt="Avatar choice"
                        onClick={() => setSelectedAvatar(key)}
                        className={`w-12 h-12 rounded cursor-pointer border-2 transition object-cover hover:scale-105 ${
                          selectedAvatar === key ? 'border-brand-red scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Plan Management */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Subscription Plan</label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-3 sm:max-w-md">
                    {['basic', 'standard', 'premium'].map((planKey) => (
                      <button
                        key={planKey}
                        type="button"
                        onClick={() => setSelectedPlan(planKey)}
                        className={`flex-1 px-4 py-2.5 rounded text-xs font-bold capitalize border transition ${
                          selectedPlan === planKey 
                            ? 'bg-brand-red text-white border-brand-red' 
                            : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {planKey}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/30 px-3.5 py-1.5 rounded text-xs font-bold uppercase text-brand-red tracking-wider">
                    <Shield className="w-3.5 h-3.5" />
                    {user?.plan || 'Standard'} Member
                  </div>
                )}
              </div>

              {/* Action save/cancel triggers */}
              {isEditing ? (
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-100 text-black font-semibold text-xs px-5 py-2.5 rounded flex items-center gap-1.5 transition shadow"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setName(user?.name || '');
                      setSelectedAvatar(user?.avatar || 'avatar1');
                      setSelectedPlan(user?.plan || 'standard');
                      setIsEditing(false);
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-5 py-2.5 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </form>
          </div>
        </section>

        {/* Watch History Log Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-brand-red" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-netflix-sans">
              Watch History Logs
            </h3>
          </div>

          {history.length > 0 ? (
            <div className="bg-brand-darkGray/60 border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
              {history.map((log) => (
                <div 
                  key={log._id} 
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-4">
                    {log.posterPath ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${log.posterPath}`} 
                        alt={log.title} 
                        className="w-12 h-18 rounded object-cover shadow border border-white/10"
                      />
                    ) : (
                      <div className="w-12 h-18 bg-zinc-800 rounded flex items-center justify-center text-[9px] uppercase font-bold text-gray-500">
                        Poster
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-white">{log.title}</h4>
                      <p className="text-xs text-brand-gray capitalize mt-0.5">{log.mediaType}</p>
                      
                      {/* Progress bar container */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-24 sm:w-36 bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-red h-full" 
                            style={{ width: `${log.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{log.progress}% watched</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-brand-gray font-semibold self-end sm:self-center">
                    Watched on {new Date(log.watchedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-brand-darkGray/50 border border-white/5 rounded-lg p-8 text-center text-brand-gray text-xs">
              No recent playback records found. Watch content on CineStream to log playback logs.
            </div>
          )}
        </section>

        {/* Global Exit Buttons */}
        <div className="pt-4 flex items-center justify-between border-t border-zinc-800">
          <p className="text-xs text-zinc-500">
            Current account: <strong className="text-zinc-300">{user?.email}</strong>
          </p>
          <button 
            onClick={handleLogout}
            className="border border-brand-red text-brand-red hover:bg-brand-red/10 font-bold text-xs px-6 py-2.5 rounded transition"
          >
            Sign Out of CineStream
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
export { avatars };
