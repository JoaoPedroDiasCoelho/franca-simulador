# 7. TELAS DO SISTEMA / SITE

A definição e o detalhamento das telas do sistema representam uma etapa importante do desenvolvimento, pois descrevem os principais pontos de interação entre o usuário e a aplicação. No projeto França Simulador, a interface web foi concebida para apoiar a consulta de motocicletas e a compreensão dos custos estimados de financiamento e consórcio. A organização das telas considera clareza, consistência visual, facilidade de navegação e adaptação a diferentes tamanhos de tela.

As páginas disponíveis refletem os recursos implementados no sistema: página inicial, catálogo de motocicletas, área de acesso do cliente, simulador financeiro e painel administrativo. O conteúdo e as ações apresentados variam conforme o perfil de acesso.

## 7.1 Diretrizes de Design e Usabilidade

As telas seguem diretrizes comuns para tornar o uso mais claro e previsível:

- Apresentação objetiva das informações e dos valores financeiros;
- Navegação consistente entre as áreas públicas do sistema;
- Hierarquia visual que destaca ações e resultados relevantes;
- Campos identificados e agrupados conforme a finalidade;
- Mensagens de carregamento, erro, sucesso e ausência de resultados;
- Adaptação da interface a diferentes dimensões de tela;
- Uso de rótulos e recursos de acessibilidade, como nomes acessíveis para controles e mensagens de estado.

Essas diretrizes ajudam o usuário a localizar as funções principais e compreender os dados exibidos durante a simulação.

## 7.2 Tela Inicial – Página Home

A página inicial apresenta a proposta do França Simulador e encaminha o usuário para a escolha de uma motocicleta e para a comparação entre modalidades de compra. O conteúdo explica, de forma resumida, a diferença entre obter a moto por financiamento e planejar a compra por consórcio.

Entre os elementos da tela estão:

- Apresentação principal do simulador e de seu propósito;
- Destaques para financiamento e consórcio;
- Explicação resumida do fluxo de uso em etapas;
- Chamadas para consultar motos e iniciar uma simulação;
- Cabeçalho e rodapé compartilhados com as demais páginas públicas.

A Home funciona como ponto de entrada e ajuda o usuário a entender o objetivo educativo da ferramenta antes de informar parâmetros financeiros.

## 7.3 Tela de Catálogo – Motocicletas

O catálogo reúne os modelos cadastrados no sistema e permite que o usuário encontre opções para simular. Cada item apresenta informações como marca, modelo, categoria, ano, cilindrada, preço e, quando disponível, descrição e imagem.

Os recursos da tela incluem:

- Busca por marca ou modelo;
- Filtro por faixa de preço;
- Cartões padronizados para apresentação das motocicletas;
- Estados de carregamento, erro e ausência de resultados;
- Ação para selecionar uma moto e seguir para a simulação.

O catálogo é alimentado pelos dados mantidos no painel administrativo. A seleção do modelo fornece o valor de referência utilizado na etapa de simulação.

## 7.4 Tela de Acesso do Cliente e Cadastro

O acesso do cliente é solicitado para entrar no simulador. A mesma área permite alternar entre entrar e solicitar a criação de uma conta. No cadastro, o usuário informa nome e e-mail e recebe um link para definir a senha; há também uma página de confirmação para concluir essa etapa.

Elementos presentes:

- Campos de identificação e senha para acesso;
- Formulário de solicitação de cadastro com nome e e-mail;
- Fluxo de confirmação por link e definição de senha;
- Validação dos dados e mensagens de erro ou sucesso;
- Atalho para voltar ao catálogo.

Após autenticar-se, o cliente pode continuar para a área de simulação. O sistema apresenta mensagens para orientar o usuário quando as credenciais ou o link de confirmação não forem válidos.

## 7.5 Tela do Simulador Financeiro

A tela do simulador permite informar os parâmetros de compra e calcular cenários financeiros para a motocicleta selecionada. As modalidades são organizadas em seções próprias, com uma opção de comparação que apresenta os resultados lado a lado.

### Financiamento

O usuário informa os dados necessários, como entrada, taxa de juros e prazo. O resultado exibe a parcela estimada pelo sistema Price, o total das parcelas, os juros estimados e o total desembolsado com a entrada.

### Consórcio

O usuário informa prazo e custos aplicáveis ao plano, incluindo taxa administrativa, fundo de reserva e seguro, conforme os campos disponíveis. O resultado apresenta a parcela estimada e os componentes do custo total.

### Comparação

A visão comparativa reúne os parâmetros comuns e exibe os resultados das duas modalidades. São apresentados valores como parcela, custo total estimado e diferenças entre cenários. A interface também contextualiza que a comparação deve considerar o prazo de contemplação do consórcio e a posse imediata associada ao financiamento.

Os resultados são estimativas calculadas com os dados informados pelo usuário. A tela tem finalidade informativa e não representa oferta de crédito nem garantia de contemplação.

## 7.6 Tela Administrativa

O painel administrativo é uma área restrita destinada ao gerenciamento do catálogo e dos acessos administrativos. O usuário administrador entra com credenciais e, depois da validação, pode navegar pelas seções disponíveis.

### Gerenciamento de motocicletas

O painel apresenta a lista de modelos cadastrados, com busca e ações para atualizar os dados. O formulário de inclusão e edição permite informar marca, modelo, categoria, cilindrada, ano, preço, descrição e imagem. Após salvar, a lista pode ser atualizada para refletir as alterações.

### Gerenciamento de usuários

A seção de acessos permite consultar os usuários administrativos existentes e cadastrar novos acessos, com campos de usuário e senha. O painel apresenta mensagens de validação e permite atualizar a listagem.

O menu lateral organiza as funções administrativas e oferece a ação para encerrar a sessão. O acesso a essas operações depende de autenticação administrativa.

## 7.7 Consistência e Navegação entre Telas

As páginas públicas compartilham identidade visual, cabeçalho, navegação e rodapé. O catálogo encaminha o usuário à autenticação quando necessário, e o acesso bem-sucedido permite prosseguir para a simulação. A página inicial e as demais áreas públicas oferecem caminhos de retorno ao catálogo ou à navegação principal.

O painel administrativo possui navegação própria, adequada às tarefas de manutenção do catálogo e gerenciamento de acessos. Essa organização mantém as funções administrativas separadas do fluxo de consulta e simulação destinado ao cliente.

## 7.8 Observação sobre o Escopo das Telas

O sistema implementado não possui, neste momento, páginas específicas de contato, encomendas ou localização com mapa. Seu escopo atual está concentrado no catálogo de motocicletas, no acesso de clientes, nas simulações financeiras e na administração do sistema. Esses recursos poderão ser avaliados em futuras evoluções do projeto.
