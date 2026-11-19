import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { routeHref } from '../utils/routes.js';

export function HomePage({ clientName, onLogout }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const video = document.querySelector('.hero-video');
    const story = document.querySelector('.hero');
    if (!video || !story) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let current = 0;
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const update = () => {
      frame = 0;
      const bounds = story.getBoundingClientRect();
      const travel = bounds.height - window.innerHeight;
      const target = reducedMotion.matches || travel <= 0 ? 0 : clamp(-bounds.top / travel);
      current += (target - current) * 0.075;
      if (Math.abs(target - current) < 0.0005) current = target;
      if (!reducedMotion.matches && video.duration && !video.seeking) {
        const time = current * Math.max(0, video.duration - 0.04);
        if (Math.abs(video.currentTime - time) > 0.025) video.currentTime = time;
      }
      setProgress(current);
      if (Math.abs(target - current) >= 0.0005) frame = requestAnimationFrame(update);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    video.pause();
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule);
    video.addEventListener('loadedmetadata', schedule);
    video.addEventListener('seeked', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      video.removeEventListener('loadedmetadata', schedule);
      video.removeEventListener('seeked', schedule);
    };
  }, []);

  return <PageShell page="inicio" clientName={clientName} onLogout={onLogout}>
    <main>
      <section className="hero">
        <div className="hero-pin">
          <video className="hero-video" src="/assets/sport-motorcycle-assembly.mp4" preload="auto" muted playsInline aria-hidden="true" />
          <div className="hero-shade" />
          <div className="wrap hero-content">
            <div className="hero-copy">
              <span className="eyebrow eyebrow-light"><i /> Planejamento sem surpresa</span>
              <h1>Financiamento ou consórcio? <em>Compare antes de assinar.</em></h1>
              <p>Simule parcelas, juros e custo total da sua moto. Veja as duas opções lado a lado e escolha com mais clareza.</p>
              <div className="hero-actions">
                <a className="button button-red" href={routeHref('simulador')}>Simular e comparar <span>↗</span></a>
                <a className="button button-outline" href={routeHref('motos')}>Explorar catálogo</a>
              </div>
              <p className="scroll-hint" style={{ opacity: 1 - Math.min(1, progress * 8) }}>Role para acompanhar a montagem <span>↓</span></p>
            </div>
          </div>
          <div className="hero-progress"><span style={{ transform: `scaleX(${progress})` }} /></div>
          <span className="hero-index">01 — 03</span>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-intro">
          <span className="eyebrow">Escolha com contexto</span>
          <h2>Duas formas de comprar.<br /><em>Uma decisão bem informada.</em></h2>
        </div>
        <div className="option-grid">
          <article className="editorial-card">
            <span className="card-index">01 / FINANCIAMENTO</span><span className="card-symbol">↗</span>
            <h3>Leve a moto agora.</h3>
            <p>No financiamento Price, você recebe a moto no início e paga parcelas fixas ao longo do prazo, com juros sobre o saldo financiado.</p>
            <ul><li>Posse imediata do veículo</li><li>Parcelas mensais fixas</li><li>Entrada e juros entram na conta</li></ul>
          </article>
          <article className="editorial-card card-green">
            <span className="card-index">02 / CONSÓRCIO</span><span className="card-symbol">◌</span>
            <h3>Planeje a contemplação.</h3>
            <p>No consórcio, você participa de um grupo e pode receber a carta por sorteio ou lance. A contemplação não tem data garantida.</p>
            <ul><li>Sem juros bancários</li><li>Taxa de administração e fundo de reserva</li><li>Contemplação por sorteio ou lance</li></ul>
          </article>
        </div>
      </section>

      <section className="steps-section">
        <div className="wrap">
          <span className="eyebrow">Do catálogo ao comparativo</span>
          <h2>Da escolha à comparação<br /><em>em três passos.</em></h2>
          <div className="steps-grid">
            {[
              ['01', 'Escolha a moto', 'Navegue pelo catálogo e selecione o modelo que combina com seu plano.'],
              ['02', 'Informe seu cenário', 'Defina o valor de entrada, o prazo e as taxas que quer considerar.'],
              ['03', 'Compare os custos', 'Veja parcelas, juros, taxas e custo total das duas modalidades.']
            ].map(([number, title, description]) => <article className="step-card" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{description}</p>
            </article>)}
          </div>
        </div>
      </section>
      <section className="callout wrap">
        <div><span className="eyebrow">Sua próxima decisão começa nos números</span><h2>Descubra quanto a sua moto realmente custa.</h2></div>
        <a className="button button-dark" href={routeHref('simulador')}>Começar simulação <span>↗</span></a>
      </section>
    </main>
  </PageShell>;
}
