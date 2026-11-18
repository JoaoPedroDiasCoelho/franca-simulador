import { useState } from 'react';
import { apiAssetUrl } from '../api.js';

export default function MotoImage({ moto, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!moto.imagemUrl || failed) return <div className={`moto-placeholder ${className}`}><span>F</span><small>{moto.modelo}</small></div>;
  return <img className={className} src={apiAssetUrl(moto.imagemUrl)} alt={`${moto.marca} ${moto.modelo}`} loading="lazy" onError={() => setFailed(true)} />;
}
