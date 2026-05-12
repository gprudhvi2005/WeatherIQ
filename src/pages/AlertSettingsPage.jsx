import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiPlus, FiTrash2, FiThermometer, FiDroplet } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import useCitiesStore from '../store/citiesStore';
import * as alertsService from '../services/alertsService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function AlertSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { cities, fetchCities } = useCitiesStore();
  const [prefs, setPrefs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [running, setRunning] = useState(false);
  const [form, setForm] = useState({
    cityName: '', latitude: 0, longitude: 0,
    alertRain: true, alertHeat: true, temperatureThreshold: 38, rainThreshold: 70, emailEnabled: true,
  });

  useEffect(() => {
    if (isSupabaseConfigured && user) {
      fetchCities();
      loadData();
    } else { setLoading(false); }
  }, [user]);

  const loadData = async () => {
    try {
      const [p, l] = await Promise.all([alertsService.fetchAlertPreferences(), alertsService.fetchAlertLogs()]);
      setPrefs(p); setLogs(l);
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.cityName) { toast.error('Select a city'); return; }
    try {
      const saved = await alertsService.upsertAlertPreference(form);
      setPrefs(prev => [saved, ...prev.filter(p => p.id !== saved.id)]);
      setShowForm(false); toast.success('Alert preference saved');
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    try {
      await alertsService.deleteAlertPreference(id);
      setPrefs(prev => prev.filter(p => p.id !== id));
      toast.success('Alert removed');
    } catch { toast.error('Failed to remove'); }
  };

  const handleRunNow = async () => {
    setRunning(true);
    try {
      const res = await alertsService.runAlertsNow();
      toast.success(res?.message || 'Alerts check triggered');
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to run alerts');
    } finally {
      setRunning(false);
    }
  };

  const selectCity = (city) => {
    setForm(f => ({ ...f, cityName: city.city_name, latitude: city.latitude, longitude: city.longitude }));
  };

  if (!isSupabaseConfigured) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <FiBell className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Weather Alerts</h2>
        <p className="text-white/50">Configure Supabase to enable email weather alerts.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Weather Alerts</h1>
          <p className="text-white/50 mt-1">Get notified when weather conditions meet your thresholds</p>
          <p className="text-white/40 text-xs mt-1">Alerts are checked every 30 minutes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRunNow} disabled={running} className="btn-secondary text-sm">
            {running ? 'Running...' : 'Run Now'}
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus className="w-4 h-4" /> New Alert
          </button>
        </div>
      </div>

      {/* New alert form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="glass-card p-6 mb-6 overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-4">Configure Alert</h3>
            
            {/* City selector */}
            <div className="mb-4">
              <label className="text-sm text-white/60 block mb-2">Select City</label>
              <div className="flex flex-wrap gap-2">
                {cities.map(c => (
                  <button key={c.id} onClick={() => selectCity(c)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      form.cityName === c.city_name ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}>{c.city_name}</button>
                ))}
                {cities.length === 0 && <p className="text-white/40 text-sm">Save cities first on the dashboard.</p>}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <FiThermometer className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white">Heat Alert</span>
                </div>
                <input type="checkbox" checked={form.alertHeat} onChange={e => setForm(f => ({ ...f, alertHeat: e.target.checked }))}
                  className="w-5 h-5 rounded accent-primary-500" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <FiDroplet className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white">Rain Alert</span>
                </div>
                <input type="checkbox" checked={form.alertRain} onChange={e => setForm(f => ({ ...f, alertRain: e.target.checked }))}
                  className="w-5 h-5 rounded accent-primary-500" />
              </label>
            </div>

            {/* Thresholds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-white/60 block mb-1">Temperature Threshold (°C)</label>
                <input type="number" value={form.temperatureThreshold} onChange={e => setForm(f => ({ ...f, temperatureThreshold: +e.target.value }))}
                  className="input-field" min={20} max={50} />
              </div>
              <div>
                <label className="text-sm text-white/60 block mb-1">Rain Probability Threshold (%)</label>
                <input type="number" value={form.rainThreshold} onChange={e => setForm(f => ({ ...f, rainThreshold: +e.target.value }))}
                  className="input-field" min={10} max={100} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-primary text-sm">Save Alert</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active alerts */}
      <div className="space-y-3 mb-10">
        {prefs.map(p => (
          <motion.div key={p.id} layout className="glass-card p-4 flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-white">{p.city_name}</h4>
              <div className="flex gap-3 mt-1 text-xs text-white/50">
                {p.alert_heat && <span className="flex items-center gap-1"><FiThermometer className="text-red-400" /> &gt;{p.temperature_threshold}°C</span>}
                {p.alert_rain && <span className="flex items-center gap-1"><FiDroplet className="text-blue-400" /> &gt;{p.rain_threshold}%</span>}
                <span>{p.email_enabled ? '📧 Email on' : '📧 Email off'}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-2 text-white/40 hover:text-red-400 transition-colors">
              <FiTrash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
        {prefs.length === 0 && !loading && (
          <div className="text-center py-10 text-white/40">
            <FiBell className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No active alerts. Create one above.</p>
          </div>
        )}
      </div>

      {/* Alert logs */}
      {logs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alert History</h3>
          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="glass-card p-3 flex items-center gap-3 text-sm">
                <span className="text-white/40">{new Date(log.sent_at).toLocaleDateString()}</span>
                <span className="text-white font-medium">{log.city_name}</span>
                <span className="text-white/60">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
