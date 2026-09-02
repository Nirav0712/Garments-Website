import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

const SpecBuilder = ({ specs = {}, features = [], onChangeSpecs, onChangeFeatures }) => {
  // Key-value specifications
  const specEntries = Object.entries(specs || {});
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');

  // Feature bullets
  const [newFeature, setNewFeature] = useState('');

  const handleAddSpec = () => {
    if (!newKey.trim()) return;
    const updated = { ...specs, [newKey.trim()]: newVal.trim() };
    onChangeSpecs(updated);
    setNewKey('');
    setNewVal('');
  };

  const handleRemoveSpec = (keyToRemove) => {
    const updated = { ...specs };
    delete updated[keyToRemove];
    onChangeSpecs(updated);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    const updated = [...(features || []), newFeature.trim()];
    onChangeFeatures(updated);
    setNewFeature('');
  };

  const handleRemoveFeature = (index) => {
    const updated = (features || []).filter((_, i) => i !== index);
    onChangeFeatures(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Specifications Builder */}
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
          Technical Specifications (Key-Value)
        </h4>

        {specEntries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
            {specEntries.map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <span style={{ fontWeight: 600, color: '#A5B4FC', width: '35%', fontSize: '0.875rem' }}>{k}</span>
                <span style={{ color: '#CBD5E1', flex: 1, fontSize: '0.875rem' }}>{v}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(k)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#F87171',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Spec Name (e.g. Battery Life, Weight)"
            className="input-field"
            style={{ width: '40%', height: '38px', fontSize: '0.85rem' }}
          />
          <input
            type="text"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            placeholder="Value (e.g. 45 Hours, 280g)"
            className="input-field"
            style={{ flex: 1, height: '38px', fontSize: '0.85rem' }}
          />
          <button
            type="button"
            onClick={handleAddSpec}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0 14px' }}
          >
            <Plus size={16} /> Add Spec
          </button>
        </div>
      </div>

      {/* Features Checklist Builder */}
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
          Key Features & Highlights
        </h4>

        {(features || []).length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
            {(features || []).map((feat, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <Check size={16} color="#34D399" style={{ flexShrink: 0 }} />
                <span style={{ color: '#CBD5E1', flex: 1, fontSize: '0.875rem' }}>{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#F87171',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add key feature bullet (e.g. Adaptive Noise Cancellation with Real-time Tuning)..."
            className="input-field"
            style={{ flex: 1, height: '38px', fontSize: '0.85rem' }}
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0 14px' }}
          >
            <Plus size={16} /> Add Feature
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecBuilder;
