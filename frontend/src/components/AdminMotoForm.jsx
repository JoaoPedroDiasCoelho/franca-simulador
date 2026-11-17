import { useEffect, useState } from 'react';
import Field from './Field.jsx';
import MotoImage from './MotoImage.jsx';

const emptyMoto = {
  marca: '',
  modelo: '',
  categoria: '',
  cilindrada: '',
  anoModelo: String(new Date().getFullYear()),
  preco: '',
  imagemUrl: '',
  descricao: ''
};

const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatMoneyInput = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  return moneyFormatter.format(Number(value));
};
const parseMoneyInput = (value) => Number(value.replace(/\D/g, '')) / 100;

export default function AdminMotoForm({ moto, saving, onCancel, onSubmit }) {
  const [values, setValues] = useState(emptyMoto);
  const [priceInput, setPriceInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const next = moto ? {
      marca: moto.marca ?? '',
      modelo: moto.modelo ?? '',
      categoria: moto.categoria ?? '',
      cilindrada: String(moto.cilindrada ?? ''),
      anoModelo: String(moto.anoModelo ?? ''),
      preco: moto.preco ?? '',
      imagemUrl: moto.imagemUrl ?? '',
      descricao: moto.descricao ?? ''
    } : emptyMoto;
    setValues(next);
    setPriceInput(formatMoneyInput(next.preco));
    setImageFile(null);
    setImageUrl(next.imagemUrl);
    setRemoveImage(false);
    setFormError('');
  }, [moto]);

  useEffect(() => {
    if (!imageFile) {
      setFilePreview('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setFilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const changeImageFile = (event) => {
    const file = event.target.files?.[0] ?? null;
    setFormError('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setFormError('Escolha uma imagem JPEG, PNG, WebP ou GIF.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('A imagem deve ter no máximo 5 MB.');
      event.target.value = '';
      return;
    }
    setImageFile(file);
    setImageUrl('');
    setRemoveImage(false);
  };
  const changeImageUrl = (event) => {
    setImageUrl(event.target.value);
    setImageFile(null);
    setRemoveImage(false);
  };
  const clearImage = () => {
    setImageFile(null);
    setImageUrl('');
    setRemoveImage(true);
  };
  const submit = async (event) => {
    event.preventDefault();
    setFormError('');
    const price = parseMoneyInput(priceInput);
    if (!Number.isFinite(price) || price <= 0) {
      setFormError('Informe um preço válido para a moto.');
      return;
    }
    try {
      await onSubmit({
        marca: values.marca.trim(),
        modelo: values.modelo.trim(),
        categoria: values.categoria.trim(),
        cilindrada: Number(values.cilindrada),
        anoModelo: Number(values.anoModelo),
        preco: price,
        imagemUrl: imageFile || removeImage ? null : imageUrl.trim() || null,
        descricao: values.descricao.trim() || null
      }, imageFile);
    } catch (error) {
      setFormError(error.message);
    }
  };

  return <section className="admin-workspace">
    <div className="admin-page-heading">
      <div><span className="eyebrow">{moto ? 'EDIÇÃO DO CATÁLOGO' : 'NOVO ITEM'}</span><h1>{moto ? 'Editar moto' : 'Cadastrar moto'}</h1><p>{moto ? `Atualize os dados de ${moto.marca} ${moto.modelo}.` : 'Preencha as informações para adicionar um modelo ao catálogo.'}</p></div>
      <button type="button" className="button button-outline-dark" onClick={onCancel}>← Voltar ao catálogo</button>
    </div>
    <form className="admin-moto-form" onSubmit={submit}>
      <div className="admin-form-section">
        <div className="admin-form-section-heading"><span className="admin-section-number">01</span><div><h2>Informações da moto</h2><p>Dados principais e preço à vista.</p></div></div>
        <div className="admin-moto-fields">
          <Field label="Marca *"><input name="marca" maxLength="50" placeholder="Ex.: Honda" value={values.marca} onChange={update} required /></Field>
          <Field label="Modelo *"><input name="modelo" maxLength="100" placeholder="Ex.: CG 160 Titan" value={values.modelo} onChange={update} required /></Field>
          <Field label="Categoria *"><input name="categoria" maxLength="50" placeholder="Ex.: Street" value={values.categoria} onChange={update} required /></Field>
          <Field label="Cilindrada *"><div className="admin-input-suffix"><input name="cilindrada" type="number" min="1" step="1" placeholder="160" value={values.cilindrada} onChange={update} required /><span>cc</span></div></Field>
          <Field label="Ano do modelo *"><input name="anoModelo" type="number" min="1900" max="2100" placeholder="2026" value={values.anoModelo} onChange={update} required /></Field>
          <Field label="Preço à vista *"><input inputMode="numeric" autoComplete="off" placeholder="R$ 0,00" value={priceInput} onChange={(event) => setPriceInput(formatMoneyInput(event.target.value.replace(/\D/g, '') / 100))} aria-describedby="price-help" required /><small id="price-help">Digite apenas os números; os centavos são preenchidos automaticamente.</small></Field>
          <Field label="Descrição" className="admin-description-field"><textarea name="descricao" maxLength="3000" rows="4" placeholder="Detalhes importantes sobre o modelo..." value={values.descricao} onChange={update} /></Field>
        </div>
      </div>
      <div className="admin-form-section admin-photo-section">
        <div className="admin-form-section-heading"><span className="admin-section-number">02</span><div><h2>Foto da moto</h2><p>Envie uma imagem ou informe um endereço web.</p></div></div>
        <div className="admin-photo-layout">
          <div className="admin-photo-preview">{filePreview || imageUrl ? <img src={filePreview || imageUrl} alt="Prévia da foto da moto" onError={() => setFormError('Não foi possível carregar a imagem informada.')} /> : <div className="admin-photo-empty"><span aria-hidden="true">▧</span><strong>Prévia da imagem</strong><small>JPG, PNG, WebP ou GIF</small></div>}</div>
          <div className="admin-photo-controls">
            <label className="admin-upload-button"><span aria-hidden="true">↑</span><strong>{imageFile ? 'Trocar arquivo' : 'Escolher imagem'}</strong><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={changeImageFile} /></label>
            <small className="admin-photo-hint">Tamanho máximo: 5 MB.</small>
            <div className="admin-photo-divider"><span>ou use um link</span></div>
            <Field label="URL da imagem"><input type="url" maxLength="500" placeholder="https://exemplo.com/moto.jpg" value={imageUrl.startsWith('/api/motos/') ? '' : imageUrl} onChange={changeImageUrl} /></Field>
            {(imageFile || imageUrl) && <button className="admin-remove-photo" type="button" onClick={clearImage}>Remover foto</button>}
          </div>
        </div>
      </div>
      {formError && <p className="admin-form-error" role="alert">{formError}</p>}
      <div className="admin-form-footer"><span>* Campos obrigatórios</span><div><button type="button" className="button button-outline-dark" onClick={onCancel}>Cancelar</button><button type="submit" className="button button-red" disabled={saving}>{saving ? 'Salvando…' : moto ? 'Salvar alterações' : 'Cadastrar moto'} <span aria-hidden="true">↗</span></button></div></div>
    </form>
  </section>;
}
