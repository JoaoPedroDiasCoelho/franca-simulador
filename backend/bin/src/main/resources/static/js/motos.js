/**
 * França Simulador - motos.js
 * Gerenciamento interativo da listagem e filtros do catálogo de motocicletas.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const container = document.getElementById('motosContainer');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const btnRetry = document.getElementById('btnRetry');

    const searchInput = document.getElementById('searchInput');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const totalCount = document.getElementById('totalCount');

    // Estado da página
    let activeCategory = 'todas';
    let debounceTimer = null;

    /**
     * Carrega as motocicletas da API aplicando os filtros atuais
     */
    async function carregarMotos() {
        mostrarEstado('loading');

        try {
            const filtros = {
                busca: searchInput ? searchInput.value.trim() : '',
                categoria: activeCategory,
                precoMax: priceRange ? priceRange.value : null
            };

            const motos = await api.getMotos(filtros);
            renderizarMotos(motos);
        } catch (err) {
            console.error('Erro ao buscar catálogo:', err);
            if (errorMessage) errorMessage.textContent = err.message;
            mostrarEstado('error');
        }
    }

    /**
     * Renderiza os cards das motocicletas no grid
     * @param {Array} motos 
     */
    function renderizarMotos(motos) {
        if (!motos || motos.length === 0) {
            if (totalCount) totalCount.textContent = '0 motos';
            mostrarEstado('empty');
            return;
        }

        if (totalCount) totalCount.textContent = `${motos.length} ${motos.length === 1 ? 'moto encontrada' : 'motos encontradas'}`;
        container.innerHTML = '';

        motos.forEach(moto => {
            const card = document.createElement('div');
            card.className = 'bg-[#171922] border border-[#262a38] rounded-xl overflow-hidden card-hover flex flex-col transition duration-300';

            const fallbackSvg = getPlaceholderMotoImage(moto.modelo);
            const imgSrc = moto.imagemUrl || fallbackSvg;

            card.innerHTML = `
                <div class="relative h-48 w-full bg-[#1e2230] overflow-hidden">
                    <img src="${imgSrc}" 
                         alt="${moto.marca} ${moto.modelo}" 
                         class="w-full h-full object-cover transition duration-300 hover:scale-105"
                         onerror="this.onerror=null; this.src='${fallbackSvg}';">
                    <span class="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded text-gray-200 border border-gray-700/50">
                        ${moto.categoria}
                    </span>
                    <span class="absolute top-3 right-3 bg-red-600/90 text-xs font-bold px-2 py-0.5 rounded text-white">
                        ${moto.cilindrada} cc
                    </span>
                </div>

                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span class="uppercase tracking-wider font-semibold text-red-500">${moto.marca}</span>
                            <span>Ano ${moto.anoModelo}</span>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2 leading-snug">${moto.modelo}</h3>
                        <p class="text-gray-400 text-sm mb-4 line-clamp-2">${moto.descricao || 'Excelente modelo para deslocamentos diários e viagens.'}</p>
                    </div>

                    <div class="pt-4 border-t border-[#262a38]">
                        <div class="flex items-baseline justify-between mb-4">
                            <span class="text-xs text-gray-400 font-medium">Preço à vista</span>
                            <span class="text-xl font-extrabold text-white">${formatCurrency(moto.preco)}</span>
                        </div>

                        <a href="simulador.html?motoId=${moto.id}" 
                           class="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-lg shadow-red-900/20 text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            Simular Condições
                        </a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        mostrarEstado('content');
    }

    /**
     * Alterna os estados visuais da listagem (loading, content, empty, error)
     */
    function mostrarEstado(estado) {
        if (loadingState) loadingState.classList.toggle('hidden', estado !== 'loading');
        if (container) container.classList.toggle('hidden', estado !== 'content');
        if (emptyState) emptyState.classList.toggle('hidden', estado !== 'empty');
        if (errorState) errorState.classList.toggle('hidden', estado !== 'error');
    }

    // Ouvintes de Eventos para os Filtros
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => carregarMotos(), 300);
        });
    }

    categoryFilters.forEach(button => {
        button.addEventListener('click', (e) => {
            categoryFilters.forEach(btn => {
                btn.classList.remove('bg-red-600', 'text-white', 'border-red-600');
                btn.classList.add('bg-[#171922]', 'text-gray-300', 'border-[#262a38]');
            });

            const current = e.currentTarget;
            current.classList.remove('bg-[#171922]', 'text-gray-300', 'border-[#262a38]');
            current.classList.add('bg-red-600', 'text-white', 'border-red-600');

            activeCategory = current.dataset.category || 'todas';
            carregarMotos();
        });
    });

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            if (priceValue) priceValue.textContent = formatCurrency(e.target.value);
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => carregarMotos(), 250);
        });
    }

    if (btnRetry) {
        btnRetry.addEventListener('click', () => carregarMotos());
    }

    // Inicialização
    if (priceRange && priceValue) {
        priceValue.textContent = formatCurrency(priceRange.value);
    }
    carregarMotos();
});
