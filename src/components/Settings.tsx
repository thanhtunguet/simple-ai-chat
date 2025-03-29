import React from 'react';
import { Settings } from '../types';

interface SettingsProps {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  availableModels: string[];
}

export function SettingsDialog({ settings, onUpdate, availableModels }: SettingsProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold">Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => onUpdate({ ...settings, apiKey: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Base URL</label>
          <input
            type="text"
            value={settings.baseUrl}
            onChange={(e) => onUpdate({ ...settings, baseUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={settings.model}
            onChange={(e) => onUpdate({ ...settings, model: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}