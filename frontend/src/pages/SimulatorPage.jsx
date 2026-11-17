import { useEffect, useMemo, useState } from "react";
import { api, currency, percent } from "../api.js";
import Field from "../components/Field.jsx";
import MotoImage from "../components/MotoImage.jsx";
import PageShell from "../components/PageShell.jsx";
import ComparisonResult from "../components/ComparisonResult.jsx";
import ConsortiumResult from "../components/ConsortiumResult.jsx";
import FinancingResult from "../components/FinancingResult.jsx";

export function SimulatorPage({ motoId, clientCredentials, onLogout }) {
  const [motos, setMotos] = useState([]);
  const [selectedId, setSelectedId] = useState(motoId || "");
  const [reference, setReference] = useState("17890");
  const [tab, setTab] = useState("financiamento");
  const [config, setConfig] = useState({
    taxaJurosMensalPadrao: 1.89,
    taxaAdmTotalPadrao: 15,
    fundoReservaPadrao: 2,
  });
  const [configError, setConfigError] = useState("");
  const [fin, setFin] = useState({
    entrada: "3500",
    prazo: "48",
    taxa: "1.89",
  });
  const [con, setCon] = useState({
    prazo: "60",
    taxa: "15",
    fundo: "2",
    seguro: "0",
  });
  const [comp, setComp] = useState({ entrada: "3500", prazo: "48" });
  const [results, setResults] = useState({
    financiamento: null,
    consorcio: null,
    comparativo: null,
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState("");
  const selectedMoto = useMemo(
    () => motos.find((moto) => String(moto.id) === String(selectedId)),
    [motos, selectedId],
  );
  const price = Number(reference) || 0;

  useEffect(() => {
    Promise.allSettled([api.getConfiguracao(clientCredentials), api.getMotos()]).then(
      ([configResponse, motosResponse]) => {
        if (configResponse.status === "fulfilled") {
          const value = configResponse.value;
          setConfig(value);
          setFin((current) => ({
            ...current,
            taxa: value.taxaJurosMensalPadrao ?? current.taxa,
          }));
          setCon((current) => ({
            ...current,
            taxa: value.taxaAdmTotalPadrao ?? current.taxa,
            fundo: value.fundoReservaPadrao ?? current.fundo,
          }));
        } else
          setConfigError(
            `Não foi possível carregar as taxas padrão: ${configResponse.reason.message}`,
          );
        if (motosResponse.status === "fulfilled") setMotos(motosResponse.value);
        else
          setConfigError((current) =>
            [
              current,
              `Não foi possível carregar o catálogo: ${motosResponse.reason.message}`,
            ]
              .filter(Boolean)
              .join(" "),
          );
      },
    );
  }, [clientCredentials]);

  const setError = (key, message) =>
    setErrors((current) => ({ ...current, [key]: message }));
  const run = async (key, action, payload, moto = selectedMoto) => {
    setError(key, "");
    setBusy(key);
    try {
      const result = await action({ ...payload, motoId: moto?.id ?? null }, clientCredentials);
      setResults((current) => ({ ...current, [key]: result }));
    } catch (error) {
      setError(key, error.message);
    } finally {
      setBusy("");
    }
  };
  const calculateFin = (override = {}) => {
    const ref = override.reference ?? price;
    const entry = override.entry ?? fin.entrada;
    const moto = override.moto ?? selectedMoto;
    if (!ref || ref < 500)
      return setError(
        "financiamento",
        "Informe um valor de referência válido para a moto (mínimo de R$ 500,00).",
      );
    if (Number(entry) >= ref)
      return setError(
        "financiamento",
        "O valor de entrada deve ser menor que o valor total da moto.",
      );
    return run(
      "financiamento",
      api.simularFinanciamento,
      {
        valorReferencia: ref,
        valorEntrada: Number(entry),
        prazoMeses: Number(fin.prazo),
        taxaJurosMensal: fin.taxa === "" ? null : Number(fin.taxa),
      },
      moto,
    );
  };
  const calculateCon = (override = {}) => {
    const ref = override.reference ?? price;
    const moto = override.moto ?? selectedMoto;
    if (!ref || ref < 500)
      return setError(
        "consorcio",
        "Informe o valor da carta de crédito ou selecione uma moto (mínimo de R$ 500,00).",
      );
    return run(
      "consorcio",
      api.simularConsorcio,
      {
        valorCarta: ref,
        prazoMeses: Number(con.prazo),
        taxaAdministrativaTotal: con.taxa === "" ? null : Number(con.taxa),
        fundoReservaPercentual: con.fundo === "" ? null : Number(con.fundo),
        seguroMensal: Number(con.seguro) || 0,
      },
      moto,
    );
  };
  const calculateComparison = (override = {}) => {
    const ref = override.reference ?? price;
    const entry = override.entry ?? comp.entrada;
    const moto = override.moto ?? selectedMoto;
    if (!ref || ref < 500)
      return setError(
        "comparativo",
        "Informe um valor de referência válido para comparar (mínimo de R$ 500,00).",
      );
    if (Number(entry) >= ref)
      return setError(
        "comparativo",
        "A entrada do financiamento deve ser menor que o valor total da moto.",
      );
    return run(
      "comparativo",
      api.comparar,
      {
        valorReferencia: ref,
        valorEntrada: Number(entry),
        prazoMeses: Number(comp.prazo),
      },
      moto,
    );
  };

  useEffect(() => {
    if (!selectedMoto) return;
    const reference = Number(selectedMoto.preco);
    const suggestedEntry = (reference * 0.2).toFixed(2);
    setReference(String(selectedMoto.preco));
    setFin((current) => ({ ...current, entrada: suggestedEntry }));
    setComp((current) => ({ ...current, entrada: suggestedEntry }));
    const override = { moto: selectedMoto, reference, entry: suggestedEntry };
    if (tab === "financiamento") calculateFin(override);
    else if (tab === "consorcio") calculateCon(override);
    else calculateComparison(override);
  }, [selectedMoto]);

  const chooseQuickEntry = (rate) => {
    const entry = ((price * rate) / 100).toFixed(2);
    setFin((current) => ({ ...current, entrada: entry }));
    if (tab === "financiamento") calculateFin({ entry });
  };

  return (
    <PageShell page="simulador" clientName={clientCredentials.nome || clientCredentials.usuario}>
      <main className="page-main wrap simulator-main">
        <div className="page-heading">
          <div>
            <span className="eyebrow">Calculadora avançada</span>
            <h1>
              Simulador de financiamento <em>e consórcio.</em>
            </h1>
            <p>
              Informe o valor da moto e compare parcelas, taxas e custo total.
            </p>
            <p className="client-session">
              Conectado como <strong>{clientCredentials.usuario}</strong>{' '}
              <button type="button" className="text-button" onClick={onLogout}>Sair</button>
            </p>
          </div>
          <span className="step-indicator">
            SIMULAÇÃO <strong>01 / 03</strong>
          </span>
        </div>
        {configError && (
          <p className="notice" role="status">
            {configError}
          </p>
        )}
        {selectedMoto && (
          <section className="selected-moto">
            <MotoImage moto={selectedMoto} />
            <div>
              <span className="eyebrow">Moto selecionada</span>
              <h2>
                {selectedMoto.marca} {selectedMoto.modelo}
              </h2>
              <p>
                {selectedMoto.categoria} · {selectedMoto.cilindrada} cc ·{" "}
                {currency(selectedMoto.preco)}
              </p>
            </div>
            <button className="text-button" onClick={() => setSelectedId("")}>
              Desvincular
            </button>
          </section>
        )}
        <div
          className="sim-tabs"
          role="tablist"
          aria-label="Modalidade da simulação"
        >
          {[
            ["financiamento", "Financiamento (Tabela Price)"],
            ["consorcio", "Consórcio"],
            ["comparativo", "Comparar opções"],
          ].map(([key, label]) => (
            <button
              key={key}
              id={`sim-tab-${key}`}
              type="button"
              role="tab"
              aria-controls={`sim-panel-${key}`}
              aria-selected={tab === key}
              tabIndex={tab === key ? 0 : -1}
              className={tab === key ? "active" : ""}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "financiamento" && (
          <div
            className="sim-layout"
            id="sim-panel-financiamento"
            role="tabpanel"
            aria-labelledby="sim-tab-financiamento"
            tabIndex="0"
          >
            <section className="input-card">
              <div className="panel-title">
                <span className="eyebrow">Modalidade 01</span>
                <h2>Parâmetros do financiamento</h2>
              </div>
              <Field
                label={`Entrada — ${price ? `${Math.round((Number(fin.entrada) / price) * 100) || 0}% do valor` : "valor em reais"}`}
              >
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={fin.entrada}
                  onChange={(event) =>
                    setFin({ ...fin, entrada: event.target.value })
                  }
                />
              </Field>
              <div className="quick-values">
                {[10, 20, 30, 50].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => chooseQuickEntry(rate)}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
              <Field label="Prazo (meses)">
                <input
                  type="number"
                  min={config.prazoMinimoMeses || 6}
                  max={config.prazoMaximoMeses || 72}
                  value={fin.prazo}
                  onChange={(event) =>
                    setFin({ ...fin, prazo: event.target.value })
                  }
                />
              </Field>
              <Field label="Taxa de juros mensal (%)">
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.01"
                  value={fin.taxa}
                  onChange={(event) =>
                    setFin({ ...fin, taxa: event.target.value })
                  }
                />
              </Field>
              {errors.financiamento && (
                <p className="form-error" role="alert">
                  {errors.financiamento}
                </p>
              )}
              <button
                className="button button-red button-wide"
                disabled={busy === "financiamento"}
                onClick={calculateFin}
              >
                {busy === "financiamento"
                  ? "Calculando…"
                  : "Calcular financiamento"}{" "}
                <span>↗</span>
              </button>
            </section>
            <FinancingResult result={results.financiamento} />
          </div>
        )}
        {tab === "consorcio" && (
          <div
            className="sim-layout"
            id="sim-panel-consorcio"
            role="tabpanel"
            aria-labelledby="sim-tab-consorcio"
            tabIndex="0"
          >
            <section className="input-card">
              <div className="panel-title">
                <span className="eyebrow eyebrow-green">Modalidade 02</span>
                <h2>Parâmetros do consórcio</h2>
              </div>
              <Field label="Prazo do grupo (meses)">
                <input
                  type="number"
                  min="6"
                  max="120"
                  value={con.prazo}
                  onChange={(event) =>
                    setCon({ ...con, prazo: event.target.value })
                  }
                />
              </Field>
              <Field label="Taxa administrativa total (%)">
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="0.5"
                  value={con.taxa}
                  onChange={(event) =>
                    setCon({ ...con, taxa: event.target.value })
                  }
                />
              </Field>
              <Field label="Fundo de reserva (%)">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={con.fundo}
                  onChange={(event) =>
                    setCon({ ...con, fundo: event.target.value })
                  }
                />
              </Field>
              <Field label="Seguro opcional por parcela (R$)">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={con.seguro}
                  onChange={(event) =>
                    setCon({ ...con, seguro: event.target.value })
                  }
                />
              </Field>
              {errors.consorcio && (
                <p className="form-error" role="alert">
                  {errors.consorcio}
                </p>
              )}
              <button
                className="button button-green button-wide"
                disabled={busy === "consorcio"}
                onClick={calculateCon}
              >
                {busy === "consorcio" ? "Calculando…" : "Calcular consórcio"}{" "}
                <span>↗</span>
              </button>
            </section>
            <ConsortiumResult result={results.consorcio} />
          </div>
        )}
        {tab === "comparativo" && (
          <div
            className="comparison-panel"
            id="sim-panel-comparativo"
            role="tabpanel"
            aria-labelledby="sim-tab-comparativo"
            tabIndex="0"
          >
            <section className="input-card compare-input">
              <div className="panel-title">
                <span className="eyebrow">Modalidades lado a lado</span>
                <h2>Parâmetros comuns</h2>
              </div>
              <div className="reference-fields">
                <Field label="Entrada no financiamento (R$)">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={comp.entrada}
                    onChange={(event) =>
                      setComp({ ...comp, entrada: event.target.value })
                    }
                  />
                </Field>
                <Field label="Prazo comum">
                  <select
                    value={comp.prazo}
                    onChange={(event) =>
                      setComp({ ...comp, prazo: event.target.value })
                    }
                  >
                    {[24, 36, 48, 60, 72].map((months) => (
                      <option key={months} value={months}>
                        {months} meses
                      </option>
                    ))}
                  </select>
                </Field>
                <button
                  className="button button-red"
                  disabled={busy === "comparativo"}
                  onClick={calculateComparison}
                >
                  {busy === "comparativo" ? "Comparando…" : "Comparar opções"}{" "}
                  <span>↗</span>
                </button>
              </div>
              {errors.comparativo && (
                <p className="form-error" role="alert">
                  {errors.comparativo}
                </p>
              )}
            </section>
            <ComparisonResult result={results.comparativo} />
          </div>
        )}
      </main>
    </PageShell>
  );
}
