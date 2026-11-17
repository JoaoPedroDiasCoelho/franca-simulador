/**
 * França Simulador - simulador.js
 * Lógica interativa de cálculo e comparação de Financiamento (Price) e Consórcio.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Abas de navegação
    const tabBtns = document.querySelectorAll('.sim-tab-btn');
    const tabPanes = document.querySelectorAll('.sim-tab-pane');

    // Moto Selector & Inputs Principais
    const motoSelect = document.getElementById('motoSelect');
    const valorReferenciaInput = document.getElementById('valorReferencia');
    const selectedMotoBanner = document.getElementById('selectedMotoBanner');
    const motoBannerImg = document.getElementById('motoBannerImg');
    const motoBannerTitle = document.getElementById('motoBannerTitle');
    const motoBannerDetails = document.getElementById('motoBannerDetails');

    // Financiamento Elements
    const finEntradaInput = document.getElementById('finEntrada');
    const finEntradaRange = document.getElementById('finEntradaRange');
    const finEntradaPercent = document.getElementById('finEntradaPercent');
    const finPrazoInput = document.getElementById('finPrazo');
    const finPrazoRange = document.getElementById('finPrazoRange');
    const finTaxaJurosInput = document.getElementById('finTaxaJuros');
    const btnCalcularFin = document.getElementById('btnCalcularFin');
    const finResultCard = document.getElementById('finResultCard');
    const finError = document.getElementById('finError');

    // Consórcio Elements
    const conPrazoInput = document.getElementById('conPrazo');
    const conPrazoRange = document.getElementById('conPrazoRange');
    const conTaxaAdmInput = document.getElementById('conTaxaAdm');
    const conFundoReservaInput = document.getElementById('conFundoReserva');
    const conSeguroInput = document.getElementById('conSeguro');
    const btnCalcularCon = document.getElementById('btnCalcularCon');
    const conResultCard = document.getElementById('conResultCard');
    const conError = document.getElementById('conError');

    // Comparador Elements
    const compEntradaInput = document.getElementById('compEntrada');
    const compPrazoInput = document.getElementById('compPrazo');
    const btnComparar = document.getElementById('btnComparar');
    const compResultCard = document.getElementById('compResultCard');
    const compError = document.getElementById('compError');

    // Estado do simulador
    let motosCadastradas = [];
    let serverConfig = null;
    let selectedMoto = null;

    // 1. Inicializa configurações do servidor e catálogo
    try {
        const [config, motos] = await Promise.all([
            api.getConfiguracao().catch(() => ({
                taxaJurosMensalPadrao: 1.89,
                taxaAdmTotalPadrao: 15.00,
                fundoReservaPadrao: 2.00
            })),
            api.getMotos().catch(() => [])
        ]);

        serverConfig = config;
        motosCadastradas = motos;

        // Preenche taxas padrão nos inputs
        if (finTaxaJurosInput) finTaxaJurosInput.value = serverConfig.taxaJurosMensalPadrao || 1.89;
        if (conTaxaAdmInput) conTaxaAdmInput.value = serverConfig.taxaAdmTotalPadrao || 15.00;
        if (conFundoReservaInput) conFundoReservaInput.value = serverConfig.fundoReservaPadrao || 2.00;

        // Preenche o dropdown de motocicletas
        popularSelectMotos();

        // Checa se há ?motoId= na URL
        const urlParams = new URLSearchParams(window.location.search);
        const motoIdParam = urlParams.get('motoId');
        if (motoIdParam) {
            const motoEncontrada = motosCadastradas.find(m => m.id == motoIdParam);
            if (motoEncontrada) {
                selecionarMoto(motoEncontrada);
                if (motoSelect) motoSelect.value = motoEncontrada.id;
            }
        }
    } catch (err) {
        console.warn('Erro ao carregar configurações iniciais:', err);
    }

    /**
     * Preenche as opções do seletor de motocicletas
     */
    function popularSelectMotos() {
        if (!motoSelect) return;
        motoSelect.innerHTML = '<option value="">-- Inserir valor avulso ou selecionar modelo --</option>';
        motosCadastradas.forEach(moto => {
            const option = document.createElement('option');
            option.value = moto.id;
            option.textContent = `${moto.marca} ${moto.modelo} (${moto.cilindrada}cc) - ${formatCurrency(moto.preco)}`;
            motoSelect.appendChild(option);
        });
    }

    /**
     * Seleciona uma motocicleta e atualiza valor base e banner
     */
    function selecionarMoto(moto) {
        selectedMoto = moto;
        if (!moto) {
            if (selectedMotoBanner) selectedMotoBanner.classList.add('hidden');
            return;
        }

        if (valorReferenciaInput) {
            valorReferenciaInput.value = moto.preco;
        }

        // Sugestão de entrada de 20%
        const entradaSugerida = (moto.preco * 0.2).toFixed(2);
        if (finEntradaInput) finEntradaInput.value = entradaSugerida;
        if (compEntradaInput) compEntradaInput.value = entradaSugerida;
        atualizarSliderEntrada();

        // Atualiza banner superior
        if (selectedMotoBanner && motoBannerTitle && motoBannerDetails && motoBannerImg) {
            motoBannerTitle.textContent = `${moto.marca} ${moto.modelo} - Ano ${moto.anoModelo}`;
            motoBannerDetails.textContent = `${moto.categoria} | ${moto.cilindrada}cc | Preço à vista: ${formatCurrency(moto.preco)}`;
            motoBannerImg.src = moto.imagemUrl || getPlaceholderMotoImage(moto.modelo);
            selectedMotoBanner.classList.remove('hidden');
        }

        // Dispara simulação automática da aba ativa
        executarSimulacaoAbaAtiva();
    }

    if (motoSelect) {
        motoSelect.addEventListener('change', (e) => {
            const id = e.target.value;
            if (!id) {
                selecionarMoto(null);
            } else {
                const moto = motosCadastradas.find(m => m.id == id);
                selecionarMoto(moto);
            }
        });
    }

    if (valorReferenciaInput) {
        valorReferenciaInput.addEventListener('input', () => {
            atualizarSliderEntrada();
        });
    }

    // 2. Sincronização de Sliders de Entrada e Prazo
    function atualizarSliderEntrada() {
        const ref = parseFloat(valorReferenciaInput ? valorReferenciaInput.value : 0) || 0;
        const entrada = parseFloat(finEntradaInput ? finEntradaInput.value : 0) || 0;

        if (finEntradaRange) {
            finEntradaRange.max = ref > 0 ? (ref * 0.9).toFixed(0) : 10000;
            finEntradaRange.value = entrada;
        }

        if (finEntradaPercent && ref > 0) {
            const perc = Math.round((entrada / ref) * 100);
            finEntradaPercent.textContent = `${perc}% do valor`;
        }
    }

    if (finEntradaRange && finEntradaInput) {
        finEntradaRange.addEventListener('input', (e) => {
            finEntradaInput.value = e.target.value;
            atualizarSliderEntrada();
        });
        finEntradaInput.addEventListener('input', () => {
            atualizarSliderEntrada();
        });
    }

    // Botões de atalho de porcentagem de entrada (10%, 20%, 30%, 50%)
    document.querySelectorAll('.btn-quick-entrada').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ref = parseFloat(valorReferenciaInput ? valorReferenciaInput.value : 0) || 0;
            const perc = parseFloat(e.currentTarget.dataset.percent) / 100;
            if (ref > 0 && finEntradaInput) {
                finEntradaInput.value = (ref * perc).toFixed(2);
                atualizarSliderEntrada();
                executarSimulacaoAbaAtiva();
            }
        });
    });

    // Sincronização de prazos (Financiamento e Consórcio)
    if (finPrazoRange && finPrazoInput) {
        finPrazoRange.addEventListener('input', (e) => {
            finPrazoInput.value = e.target.value;
        });
        finPrazoInput.addEventListener('input', (e) => {
            finPrazoRange.value = e.target.value;
        });
    }

    if (conPrazoRange && conPrazoInput) {
        conPrazoRange.addEventListener('input', (e) => {
            conPrazoInput.value = e.target.value;
        });
        conPrazoInput.addEventListener('input', (e) => {
            conPrazoRange.value = e.target.value;
        });
    }

    // 3. Execução das Simulações
    function executarSimulacaoAbaAtiva() {
        const activeTab = document.querySelector('.sim-tab-btn.active');
        const tabTarget = activeTab ? activeTab.dataset.tab : 'financiamento';

        if (tabTarget === 'financiamento' && btnCalcularFin) {
            btnCalcularFin.click();
        } else if (tabTarget === 'consorcio' && btnCalcularCon) {
            btnCalcularCon.click();
        } else if (tabTarget === 'comparativo' && btnComparar) {
            btnComparar.click();
        }
    }

    // A) Financiamento
    if (btnCalcularFin) {
        btnCalcularFin.addEventListener('click', async () => {
            limparErro(finError);
            const ref = parseFloat(valorReferenciaInput ? valorReferenciaInput.value : 0);
            const entrada = parseFloat(finEntradaInput ? finEntradaInput.value : 0) || 0;
            const prazo = parseInt(finPrazoInput ? finPrazoInput.value : 0);
            const taxa = finTaxaJurosInput && finTaxaJurosInput.value ? parseFloat(finTaxaJurosInput.value) : null;

            if (!ref || ref <= 0) {
                mostrarErro(finError, 'Informe um valor de referência válido para a moto.');
                return;
            }

            if (entrada >= ref) {
                mostrarErro(finError, 'O valor de entrada deve ser menor que o valor total da moto.');
                return;
            }

            try {
                btnCalcularFin.disabled = true;
                btnCalcularFin.innerHTML = 'Calculando...';

                const res = await api.simularFinanciamento({
                    motoId: selectedMoto ? selectedMoto.id : null,
                    valorReferencia: ref,
                    valorEntrada: entrada,
                    prazoMeses: prazo,
                    taxaJurosMensal: taxa
                });

                renderizarResultadoFinanciamento(res);
            } catch (err) {
                mostrarErro(finError, err.message);
            } finally {
                btnCalcularFin.disabled = false;
                btnCalcularFin.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    Calcular Financiamento
                `;
            }
        });
    }

    function renderizarResultadoFinanciamento(res) {
        if (!finResultCard) return;
        finResultCard.innerHTML = `
            <div class="bg-[#171922] border border-[#262a38] rounded-xl p-6 glow-red animate-fade-in">
                <div class="flex items-center justify-between pb-4 border-b border-[#262a38]">
                    <div>
                        <span class="text-xs uppercase tracking-wider text-red-500 font-bold">Simulação de Financiamento</span>
                        <h4 class="text-2xl font-black text-white">Sistema Price (Parcelas Fixas)</h4>
                    </div>
                    <span class="bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/20">
                        ${formatPercent(res.taxaJurosMensal)} a.m.
                    </span>
                </div>

                <div class="my-6 text-center bg-[#0f1015] p-5 rounded-xl border border-[#262a38]">
                    <span class="text-xs text-gray-400 uppercase tracking-widest font-semibold">Valor da Parcela Estimada</span>
                    <div class="text-4xl md:text-5xl font-black text-red-500 my-1">${formatCurrency(res.valorParcela)}</div>
                    <span class="text-sm text-gray-400">em ${res.prazoMeses} parcelas mensais de ${formatCurrency(res.valorParcela)}</span>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div class="bg-[#1e2230]/60 p-3 rounded-lg border border-gray-800">
                        <span class="text-gray-400 block text-xs">Valor da Moto</span>
                        <strong class="text-white text-base">${formatCurrency(res.valorReferencia)}</strong>
                    </div>
                    <div class="bg-[#1e2230]/60 p-3 rounded-lg border border-gray-800">
                        <span class="text-gray-400 block text-xs">Entrada Informada</span>
                        <strong class="text-white text-base">${formatCurrency(res.valorEntrada)}</strong>
                    </div>
                    <div class="bg-[#1e2230]/60 p-3 rounded-lg border border-gray-800">
                        <span class="text-gray-400 block text-xs">Saldo Financiado (P)</span>
                        <strong class="text-white text-base">${formatCurrency(res.valorFinanciado)}</strong>
                    </div>
                    <div class="bg-[#1e2230]/60 p-3 rounded-lg border border-gray-800">
                        <span class="text-gray-400 block text-xs">Custo Total dos Juros</span>
                        <strong class="text-red-400 text-base">${formatCurrency(res.totalJurosEstimado)}</strong>
                    </div>
                </div>

                <div class="bg-gray-900/80 p-4 rounded-lg border border-gray-800 flex justify-between items-center mb-4">
                    <span class="text-sm font-semibold text-gray-300">Total Pago Estimado (Entrada + Parcelas):</span>
                    <span class="text-xl font-black text-white">${formatCurrency(res.totalPagoComEntrada)}</span>
                </div>

                <p class="text-xs text-gray-400 leading-relaxed italic border-t border-[#262a38] pt-3">
                    ${res.observacaoLegal}
                </p>
            </div>
        `;
    }

    // B) Consórcio
    if (btnCalcularCon) {
        btnCalcularCon.addEventListener('click', async () => {
            limparErro(conError);
            const ref = parseFloat(valorReferenciaInput ? valorReferenciaInput.value : 0);
            const prazo = parseInt(conPrazoInput ? conPrazoInput.value : 0);
            const taxaAdm = conTaxaAdmInput && conTaxaAdmInput.value ? parseFloat(conTaxaAdmInput.value) : null;
            const fundo = conFundoReservaInput && conFundoReservaInput.value ? parseFloat(conFundoReservaInput.value) : null;
            const seguro = conSeguroInput && conSeguroInput.value ? parseFloat(conSeguroInput.value) : 0;

            if (!ref || ref <= 0) {
                mostrarErro(conError, 'Informe o valor da carta de crédito ou selecione uma moto.');
                return;
            }

            try {
                btnCalcularCon.disabled = true;
                btnCalcularCon.innerHTML = 'Calculando...';

                const res = await api.simularConsorcio({
                    motoId: selectedMoto ? selectedMoto.id : null,
                    valorCarta: ref,
                    prazoMeses: prazo,
                    taxaAdministrativaTotal: taxaAdm,
                    fundoReservaPercentual: fundo,
                    seguroMensal: seguro
                });

                renderizarResultadoConsorcio(res);
            } catch (err) {
                mostrarErro(conError, err.message);
            } finally {
                btnCalcularCon.disabled = false;
                btnCalcularCon.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    Calcular Consórcio
                `;
            }
        });
    }

    function renderizarResultadoConsorcio(res) {
        if (!conResultCard) return;
        conResultCard.innerHTML = `
            <div class="bg-[#171922] border border-[#262a38] rounded-xl p-6 animate-fade-in">
                <div class="flex items-center justify-between pb-4 border-b border-[#262a38]">
                    <div>
                        <span class="text-xs uppercase tracking-wider text-emerald-400 font-bold">Plano de Consórcio</span>
                        <h4 class="text-2xl font-black text-white">Sem Juros de Financiamento</h4>
                    </div>
                    <span class="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
                        Taxa Adm: ${formatPercent(res.taxaAdministrativaPercentual)}
                    </span>
                </div>

                <div class="my-6 text-center bg-[#0f1015] p-5 rounded-xl border border-[#262a38]">
                    <span class="text-xs text-gray-400 uppercase tracking-widest font-semibold">Parcela Estimada do Consórcio</span>
                    <div class="text-4xl md:text-5xl font-black text-emerald-400 my-1">${formatCurrency(res.valorParcelaEstimada)}</div>
                    <span class="text-sm text-gray-400">em ${res.prazoMeses} meses (sem entrada obrigatória)</span>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div class="bg-[#1e2230]/60 p-3 rounded-lg border border-gray-800">
                        <span class="text-gray-400 block text-xs">Valor da Carta de Crédito</span>
                        <strong class="text-white text-base">${formatCurrency(res.valorCarta)}</strong>
                    </div>
                    <div class="bg-[#1e2230]/60 p-3 rounded-lg border border-gray-800">
                        <span class="text-gray-400 block text-xs">Taxa de Administração</span>
                        <strong class="text-white text-base">${formatCurrency(res.valorTaxaAdministrativa)} (${res.taxaAdministrativaPercentual}%)</strong>
                    </div>
                    <div class="bg-[#1e2230]/60 p-3 rounded-lg border border-gray-800">
                        <span class="text-gray-400 block text-xs">Fundo de Reserva</span>
                        <strong class="text-white text-base">${formatCurrency(res.valorFundoReserva)} (${res.fundoReservaPercentual}%)</strong>
                    </div>
                    <div class="bg-[#1e2230]/60 p-3 rounded-lg border border-gray-800">
                        <span class="text-gray-400 block text-xs">Seguros Totais</span>
                        <strong class="text-white text-base">${formatCurrency(res.totalSeguro)}</strong>
                    </div>
                </div>

                <div class="bg-gray-900/80 p-4 rounded-lg border border-gray-800 flex justify-between items-center mb-4">
                    <span class="text-sm font-semibold text-gray-300">Custo Total do Plano:</span>
                    <span class="text-xl font-black text-white">${formatCurrency(res.totalEstimadoPlano)}</span>
                </div>

                <p class="text-xs text-gray-400 leading-relaxed italic border-t border-[#262a38] pt-3">
                    ${res.observacaoLegal}
                </p>
            </div>
        `;
    }

    // C) Comparador Lado a Lado
    if (btnComparar) {
        btnComparar.addEventListener('click', async () => {
            limparErro(compError);
            const ref = parseFloat(valorReferenciaInput ? valorReferenciaInput.value : 0);
            const entrada = parseFloat(compEntradaInput ? compEntradaInput.value : 0) || 0;
            const prazo = parseInt(compPrazoInput ? compPrazoInput.value : 0);

            if (!ref || ref <= 0) {
                mostrarErro(compError, 'Informe um valor de referência para comparar os cenários.');
                return;
            }

            if (entrada >= ref) {
                mostrarErro(compError, 'A entrada do financiamento deve ser menor que o valor total da moto.');
                return;
            }

            try {
                btnComparar.disabled = true;
                btnComparar.innerHTML = 'Comparando modalidades...';

                const res = await api.comparar({
                    motoId: selectedMoto ? selectedMoto.id : null,
                    valorReferencia: ref,
                    valorEntrada: entrada,
                    prazoMeses: prazo
                });

                renderizarComparativo(res);
            } catch (err) {
                mostrarErro(compError, err.message);
            } finally {
                btnComparar.disabled = false;
                btnComparar.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Comparar Financiamento vs Consórcio
                `;
            }
        });
    }

    function renderizarComparativo(res) {
        if (!compResultCard) return;

        const fin = res.financiamento;
        const con = res.consorcio;

        compResultCard.innerHTML = `
            <div class="space-y-6 animate-fade-in">
                <!-- Banner de Economia -->
                <div class="p-6 rounded-xl bg-gradient-to-r from-emerald-950/70 via-[#171922] to-[#171922] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <span class="text-xs uppercase font-bold tracking-wider text-emerald-400">Análise de Custo Total</span>
                        <h4 class="text-2xl font-black text-white">Diferença de ${formatCurrency(res.economiaEstimada)}</h4>
                        <p class="text-gray-300 text-sm mt-1">O Consórcio gera uma economia de ${formatCurrency(res.economiaEstimada)} no valor final acumulado.</p>
                    </div>
                    <div class="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/40 text-center">
                        Consórcio é ${formatCurrency(res.economiaEstimada)} mais econômico
                    </div>
                </div>

                <!-- Cards lado a lado -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Coluna Financiamento -->
                    <div class="bg-[#171922] border border-red-500/30 rounded-xl p-5">
                        <div class="flex items-center justify-between pb-3 border-b border-[#262a38]">
                            <h5 class="font-bold text-lg text-white">Financiamento (Price)</h5>
                            <span class="text-xs bg-red-600/20 text-red-400 px-2.5 py-0.5 rounded font-semibold">Posse Imediata</span>
                        </div>
                        <div class="my-4 text-center bg-[#0f1015] p-4 rounded-lg">
                            <span class="text-xs text-gray-400">Parcela Fixa</span>
                            <div class="text-3xl font-extrabold text-red-500">${formatCurrency(fin.valorParcela)}</div>
                            <span class="text-xs text-gray-400">${fin.prazoMeses}x com taxa ${formatPercent(fin.taxaJurosMensal)} a.m.</span>
                        </div>
                        <ul class="space-y-2 text-sm text-gray-300">
                            <li class="flex justify-between py-1 border-b border-gray-800">
                                <span class="text-gray-400">Entrada:</span>
                                <strong>${formatCurrency(fin.valorEntrada)}</strong>
                            </li>
                            <li class="flex justify-between py-1 border-b border-gray-800">
                                <span class="text-gray-400">Total das Parcelas:</span>
                                <strong>${formatCurrency(fin.totalParcelas)}</strong>
                            </li>
                            <li class="flex justify-between py-1 border-b border-gray-800">
                                <span class="text-gray-400">Juros Pagos:</span>
                                <strong class="text-red-400">${formatCurrency(fin.totalJurosEstimado)}</strong>
                            </li>
                            <li class="flex justify-between py-2 text-base font-bold text-white">
                                <span>Total Desembolsado:</span>
                                <span>${formatCurrency(fin.totalPagoComEntrada)}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Coluna Consórcio -->
                    <div class="bg-[#171922] border border-emerald-500/30 rounded-xl p-5">
                        <div class="flex items-center justify-between pb-3 border-b border-[#262a38]">
                            <h5 class="font-bold text-lg text-white">Consórcio</h5>
                            <span class="text-xs bg-emerald-600/20 text-emerald-400 px-2.5 py-0.5 rounded font-semibold">Planejado / Sem Juros</span>
                        </div>
                        <div class="my-4 text-center bg-[#0f1015] p-4 rounded-lg">
                            <span class="text-xs text-gray-400">Parcela Estimada</span>
                            <div class="text-3xl font-extrabold text-emerald-400">${formatCurrency(con.valorParcelaEstimada)}</div>
                            <span class="text-xs text-gray-400">${con.prazoMeses}x com taxa adm ${formatPercent(con.taxaAdministrativaPercentual)}</span>
                        </div>
                        <ul class="space-y-2 text-sm text-gray-300">
                            <li class="flex justify-between py-1 border-b border-gray-800">
                                <span class="text-gray-400">Entrada Obrigatória:</span>
                                <strong class="text-emerald-400">R$ 0,00</strong>
                            </li>
                            <li class="flex justify-between py-1 border-b border-gray-800">
                                <span class="text-gray-400">Taxa Administrativa:</span>
                                <strong>${formatCurrency(con.valorTaxaAdministrativa)}</strong>
                            </li>
                            <li class="flex justify-between py-1 border-b border-gray-800">
                                <span class="text-gray-400">Fundo de Reserva:</span>
                                <strong>${formatCurrency(con.valorFundoReserva)}</strong>
                            </li>
                            <li class="flex justify-between py-2 text-base font-bold text-white">
                                <span>Total do Plano:</span>
                                <span>${formatCurrency(con.totalEstimadoPlano)}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Tabela de Características Práticas -->
                <div class="bg-[#171922] border border-[#262a38] rounded-xl overflow-hidden p-6">
                    <h5 class="text-lg font-bold text-white mb-4">Quadro Comparativo de Características</h5>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
                                <tr class="text-xs text-gray-400 uppercase border-b border-[#262a38]">
                                    <th class="py-3 px-4">Critério</th>
                                    <th class="py-3 px-4 text-red-400">Financiamento</th>
                                    <th class="py-3 px-4 text-emerald-400">Consórcio</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800">
                                ${res.caracteristicas.map(item => `
                                    <tr>
                                        <td class="py-3 px-4 font-semibold text-gray-300">${item.aspecto}</td>
                                        <td class="py-3 px-4 text-gray-400">${item.financiamento}</td>
                                        <td class="py-3 px-4 text-gray-400">${item.consorcio}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-5 p-4 rounded-lg bg-gray-900/80 border border-gray-800 text-xs text-gray-300 leading-relaxed">
                        <strong class="text-white block mb-1">Conclusão Didática:</strong>
                        ${res.resumoDidatico}
                    </div>
                </div>
            </div>
        `;
    }

    // 4. Alternância de Abas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.tab;
            tabBtns.forEach(b => {
                b.classList.remove('active', 'bg-red-600', 'text-white');
                b.classList.add('bg-[#171922]', 'text-gray-400');
            });

            e.currentTarget.classList.add('active', 'bg-red-600', 'text-white');
            e.currentTarget.classList.remove('bg-[#171922]', 'text-gray-400');

            tabPanes.forEach(p => {
                p.classList.toggle('hidden', p.id !== `tab-${target}`);
            });
        });
    });

    // Utilitários de Erro
    function mostrarErro(container, msg) {
        if (!container) return;
        container.textContent = msg;
        container.classList.remove('hidden');
    }

    function limparErro(container) {
        if (!container) return;
        container.textContent = '';
        container.classList.add('hidden');
    }
});
