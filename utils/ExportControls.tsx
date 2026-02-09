import React, { useState } from 'react';
import { supabase } from '../supabase'; // 
import { Download, Calendar, Loader2 } from 'lucide-react'; // [cite: 28, 55]
import { jsonToCsv, downloadFile } from '../utils/exportUtils';

const ExportControls: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'json' | 'csv') => {
    if (!startDate || !endDate) return alert('Selecione o período.');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .gte('created_at', `${startDate}T00:00:00Z`)
        .lte('created_at', `${endDate}T23:59:59Z`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) return alert('Nenhum dado encontrado no período.');

      const fileName = `export_messages_${startDate}_to_${endDate}`;

      if (format === 'json') {
        downloadFile(JSON.stringify(data, null, 2), `${fileName}.json`, 'application/json');
      } else {
        const csv = jsonToCsv(data);
        downloadFile(csv, `${fileName}.csv`, 'text/csv');
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6 flex flex-wrap items-end gap-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Início</label>
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-primary-500 outline-none w-full"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fim</label>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-2 ring-primary-500 outline-none w-full"
        />
      </div>

      <div className="flex gap-2 ml-auto">
        <button
          onClick={() => handleExport('json')}
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          JSON
        </button>
        <button
          onClick={() => handleExport('csv')}
          disabled={loading}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          CSV
        </button>
      </div>
    </div>
  );
};

export default ExportControls;
