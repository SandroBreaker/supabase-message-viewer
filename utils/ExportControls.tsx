import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Download, Calendar, Loader2, FileJson, FileSpreadsheet, Database } from 'lucide-react';
import { jsonToCsv, downloadFile } from './exportUtils';

const ExportControls: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  // Helper para busca paginada exaustiva
  const fetchAllData = async (queryBuilder: any) => {
    let allData: any[] = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await queryBuilder.range(from, from + step - 1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += step;
        // Se retornar menos que o step, chegamos ao fim
        if (data.length < step) hasMore = false;
      } else {
        hasMore = false;
      }
    }
    return allData;
  };

  const handleRangeExport = async (format: 'json' | 'csv') => {
    if (!startDate || !endDate) return alert('Selecione o período.');
    setLoading('range');
    
    try {
      const query = supabase
        .from('messages')
        .select('*')
        .gte('created_at', `${startDate}T00:00:00Z`)
        .lte('created_at', `${endDate}T23:59:59Z`)
        .order('created_at', { ascending: true });

      const data = await fetchAllData(query);
      
      if (data.length === 0) return alert('Nenhum registro no período.');
      
      const fileName = `export_range_${startDate}_to_${endDate}`;
      processDownload(data, format, fileName);
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setLoading(null);
    }
  };

  const handleFullExport = async (format: 'json' | 'csv') => {
    setLoading('full');
    try {
      const query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      const data = await fetchAllData(query);
      
      const fileName = `export_full_db_${new Date().toISOString().split('T')[0]}`;
      processDownload(data, format, fileName);
    } catch (err: any) {
      alert('Erro na exportação completa: ' + err.message);
    } finally {
      setLoading(null);
    }
  };

  const processDownload = (data: any[], format: 'json' | 'csv', fileName: string) => {
    if (format === 'json') {
      downloadFile(JSON.stringify(data, null, 2), `${fileName}.json`, 'application/json');
    } else {
      downloadFile(jsonToCsv(data), `${fileName}.csv`, 'text/csv');
    }
  };

  return (
    <div className="bg-white dark:bg-[#121214] border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex flex-wrap items-center gap-8">
      {/* Filtro por Período */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:ring-2 ring-indigo-500 outline-none"
          />
        </div>
        <span className="text-zinc-400 text-[10px] font-black uppercase">Até</span>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:ring-2 ring-indigo-500 outline-none"
        />
        <div className="flex gap-1">
          <button
            onClick={() => handleRangeExport('json')}
            disabled={!!loading}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === 'range' ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <FileJson className="w-4 h-4 text-zinc-500" />}
          </button>
          <button
            onClick={() => handleRangeExport('csv')}
            disabled={!!loading}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === 'range' ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <FileSpreadsheet className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>
      </div>

      <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>

      {/* Exportação Completa */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Database Total</span>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => handleFullExport('json')}
              disabled={!!loading}
              className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading === 'full' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
              Full JSON
            </button>
            <button
              onClick={() => handleFullExport('csv')}
              disabled={!!loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {loading === 'full' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              Full CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportControls;
