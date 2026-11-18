# França Simulador — Simulação Financeira de Motocicletas

> **Trabalho de Conclusão de Curso (TCC) — Curso Técnico em Informática**  
> Aplicação Full Stack para planejamento, simulação e comparação entre Financiamento (Tabela Price) e Consórcio para aquisição de motocicletas no Brasil.

---

## 1. Visão Geral do Sistema

O **França Simulador** é uma solução web didática e profissional concebida para auxiliar futuros compradores de motocicletas a tomarem decisões financeiras conscientes. O sistema permite consultar um catálogo de motos com preços e especificações técnicas reais do mercado brasileiro, simular planos de financiamento com parcelas fixas, projetar parcelas de consórcio e analisar comparativamente os dois cenários lado a lado.

### Aviso Legal Acadêmico
O sistema tem propósito exclusivamente educativo e pedagógico. Os valores calculados são **projeções matemáticas estimativas**, não representando propostas vinculantes de crédito bancário nem garantias de contemplação imediata por administradoras de consórcio.

---

## 2. Tecnologias Utilizadas

### Back-end
- **Java 21** (LTS)
- **Spring Boot 3.3.4**
- **Spring Web** (construção da API RESTful)
- **Spring Data JPA** & **Hibernate** (mapeamento objeto-relacional)
- **Bean Validation (Jakarta Validation)** (validação estrita de entradas)
- **Flyway** (controle de versionamento e migrations do banco)
- **Maven 3.9+** (com script Maven Wrapper `mvnw` e `mvnw.cmd`)

### Front-end
- **React 18** (interface em componentes e estado declarativo)
- **Vite 6** (servidor de desenvolvimento e build para os estáticos do Spring Boot)
- **CSS3** (layout responsivo e identidade visual compartilhada entre as telas)
- **Fetch API** (para consumo assíncrono dos endpoints REST)
- **Intl.NumberFormat** (`pt-BR` / `BRL` para formatação monetária segura no navegador)
- **API pública Math.js** (avalia a expressão matemática da parcela Price; não fornece taxas de juros)

### Banco de Dados
- **PostgreSQL 17** (com campos monetários mapeados para `NUMERIC(12, 2)` e `BigDecimal` no Java)

---

## 3. Estrutura de Pastas

```
franca-simulador/
├── backend/
│   ├── .mvn/wrapper/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── .env.example
│   ├── .env
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/br/com/franca/simulador/
│   │   │   │   ├── FrancaSimuladorApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── MotoController.java
│   │   │   │   │   ├── ClienteController.java
│   │   │   │   │   └── SimulacaoController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/
│   │   │   │   │   │   ├── ComparacaoRequestDTO.java
│   │   │   │   │   │   ├── ConsorcioRequestDTO.java
│   │   │   │   │   │   └── FinanciamentoRequestDTO.java
│   │   │   │   │   └── response/
│   │   │   │   │       ├── ComparacaoResponseDTO.java
│   │   │   │   │       ├── ConfiguracaoSimulacaoDTO.java
│   │   │   │   │       ├── ConsorcioResponseDTO.java
│   │   │   │   │       ├── FinanciamentoResponseDTO.java
│   │   │   │   │       └── MotoResponseDTO.java
│   │   │   │   ├── model/
│   │   │   │   │   └── Moto.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── MotoRepository.java
│   │   │   │   │   ├── MotoImagemRepository.java
│   │   │   │   │   └── UsuarioRepository.java
│   │   │   │   └── service/
│   │   │   │       ├── ClienteService.java
│   │   │   │       ├── ComparadorService.java
│   │   │   │       ├── ConsorcioService.java
│   │   │   │       ├── FinanciamentoService.java
│   │   │   │       ├── MathJsClient.java
│   │   │   │       └── MotoService.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/
│   │   │           ├── V1__create_table_motos.sql
│   │   │           └── V2__seed_motos_demonstracao.sql
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── public/assets/sport-motorcycle-assembly.mp4
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── AdminMotoForm.jsx
│       │   ├── AdminMotoList.jsx
│       │   ├── AdminSidebar.jsx
│       │   ├── AdminUsers.jsx
│       │   ├── Brand.jsx
│       │   ├── ComparisonResult.jsx
│       │   ├── ConsortiumResult.jsx
│       │   ├── EmptyResult.jsx
│       │   ├── Field.jsx
│       │   ├── FinancingResult.jsx
│       │   ├── Footer.jsx
│       │   ├── Header.jsx
│       │   ├── MotoImage.jsx
│       │   ├── PageShell.jsx
│       │   └── ResultMetric.jsx
│       ├── pages/
│       │   ├── AdminPage.jsx
│       │   ├── CatalogPage.jsx
│       │   ├── ClientAccessPage.jsx
│       │   ├── HomePage.jsx
│       │   └── SimulatorPage.jsx
│       ├── utils/routes.js
│       ├── api.js
│       ├── main.jsx
│       └── styles.css
└── README.md
```

---

## 4. Regras e Fórmulas de Cálculo Financeiro

O financiamento usa a [API pública Math.js](https://api.mathjs.org/) apenas para avaliar a fórmula da parcela Price. O consórcio não usa API externa: o próprio serviço calcula taxa administrativa, fundo de reserva, seguro e parcela com fórmulas simples. O comparativo só reúne os dois resultados e calcula as diferenças. Nenhum dado pessoal é enviado à Math.js.

Essa API é uma calculadora matemática genérica, não uma instituição financeira: ela não consulta taxas de mercado, não aprova crédito e não cria uma proposta de financiamento. A taxa continua sendo informada pelo usuário ou usa a taxa didática padrão do simulador. O serviço gratuito documenta um limite de 10.000 requisições por dia; se ficar indisponível, a simulação retorna erro `503` em vez de apresentar um valor estimado como se fosse válido.

### Como explicar os cálculos ao professor
1. O sistema subtrai a entrada do preço da moto para encontrar o valor financiado.
2. Envia esse valor, a taxa mensal e o prazo à API Math.js, que avalia a fórmula da Tabela Price e devolve o valor da parcela.
3. Para consórcio, o sistema soma o valor da carta, a taxa administrativa, o fundo de reserva e o seguro; depois divide pelo prazo.
4. O comparativo mostra os resultados e subtrai os custos para apresentar as diferenças.

O endpoint do simulador continua existindo como uma camada de integração: valida os dados, consulta o serviço externo e devolve o resultado no formato que o front-end já utiliza. A URL do serviço pode ser alterada pela variável de ambiente `MATHJS_API_URL`.

### 4.1 Financiamento (Sistema Francês / Tabela Price)
- **Principal Financiado ($P$):** $\text{Valor da Moto} - \text{Entrada}$
- **Taxa Mensal Decimal ($i$):** $\text{taxaJurosMensal} / 100$
- **Prazo ($n$):** Meses

**Fórmula da Parcela Fixa ($PMT$):**
$$\text{PMT} = P \times \frac{i}{1 - (1 + i)^{-n}}$$

- **Se $i = 0$ (Juros Zero):**
  $$\text{PMT} = \frac{P}{n}$$
- **Total das Parcelas:** $\text{PMT} \times n$
- **Total Pago:** $\text{Total das Parcelas} + \text{Entrada}$
- **Juros Pagos:** $\text{Total das Parcelas} - P$

*Nota Didática sobre Arredondamento:* Conforme documentado no código, a multiplicação do valor da parcela arredondada para duas casas decimais pelo prazo ($n \times \text{PMT}$) pode apresentar divergência de centavos em relação à soma teórica das frações infinitesimais de juros periódicos, o que é um comportamento padrão em instituições financeiras.

### 4.2 Consórcio
- **Valor da Taxa de Administração:** $\text{Carta} \times (\text{taxaAdm} / 100)$
- **Valor do Fundo de Reserva:** $\text{Carta} \times (\text{fundoReserva} / 100)$
- **Custo Total de Seguros:** $\text{seguroMensal} \times n$
- **Custo Total do Plano:** $\text{Carta} + \text{Taxa Adm} + \text{Fundo de Reserva} + \text{Seguros}$
- **Parcela Mensal Estimada:** $\text{Custo Total do Plano} / n$

### 4.3 Comparação entre Modalidades
- **Diferença de Desembolso:** $\text{Total Financiamento} - \text{Total Consórcio}$
- **Diferença de Parcela:** $\text{Parcela Financiamento} - \text{Parcela Consórcio}$
- O comparador informa qual modalidade tem o menor custo estimado e a diferença entre as parcelas.

---

## 5. Configuração e Execução do Projeto

### Pré-requisitos
- **Java 21** instalado (`java -version`)
- **PostgreSQL 17** em execução na porta `5432`

### 5.1 Configuração do Banco de Dados PostgreSQL
1. Crie o banco de dados no PostgreSQL:
   ```sql
   CREATE DATABASE franca_simulador_db;
   ```
2. Configure suas credenciais criando o arquivo `.env` dentro da pasta `backend/`:
   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/franca_simulador_db
   DB_USERNAME=postgres
   DB_PASSWORD=sua_senha
   SERVER_PORT=8080
   ```
3. Ao iniciar a aplicação, o **Flyway** executará automaticamente as migrations:
   - `V1__create_table_motos.sql` (cria a tabela `motos`)
   - `V2__seed_motos_demonstracao.sql` (popula o catálogo com 8 motos)
   - `V3__create_admin_users.sql` (cria tabelas de usuários e permissões)
   - `V4__create_moto_images.sql` (armazenamento persistente das imagens enviadas)
   - `V5__create_client_signup_tokens.sql` (convites temporários, perfis e e-mails de clientes)
   - `V6__consolidate_users_and_roles.sql` (migra nome, e-mail e role para `users` e remove tabelas separadas)

### Configuração no Railway
No serviço da API, defina o diretório raiz como `backend` e cadastre estas variáveis na aba **Variables**:

```properties
DB_URL=jdbc:postgresql://postgres.railway.internal:5432/railway
DB_USERNAME=postgres
DB_PASSWORD=<senha da URL PostgreSQL fornecida>
GMAIL_USERNAME=<endereço da conta Gmail>
GMAIL_APP_PASSWORD=<senha de app do Google>
APP_BASE_URL=<endereço público da aplicação>
```

A URL `postgresql://...` do Railway deve virar `jdbc:postgresql://...` em `DB_URL`, pois a aplicação usa o driver JDBC do Java. Mantenha a API e o Postgres no mesmo projeto e ambiente do Railway para que o endereço privado `postgres.railway.internal` resolva. O servidor usa automaticamente a variável `PORT` do Railway; localmente, continua usando `SERVER_PORT` ou a porta `8080`.

O cadastro envia o convite pelo SMTP do Gmail (`smtp.gmail.com:587`, com STARTTLS). Configure `GMAIL_USERNAME` com a conta Gmail e `GMAIL_APP_PASSWORD` com uma senha de app do Google; a senha normal da conta não deve ser usada. A conta precisa ter a verificação em duas etapas ativada para gerar uma senha de app. `APP_BASE_URL` deve ser a URL pública do sistema para que o link enviado por e-mail abra a tela correta.

O `HTTP 202` de `POST /api/clientes` significa que o servidor SMTP do Gmail aceitou a mensagem para entrega, não que ela já chegou à caixa de entrada. O Gmail não retorna um ID de envio equivalente ao dos provedores anteriores.

Para cadastrar motos, configure também `ADMIN_USERNAME` (opcional; padrão `admin`) e `ADMIN_PASSWORD` com uma senha forte em `backend/.env` local ou como variáveis privadas do serviço no Railway. No primeiro início, a aplicação grava ou atualiza o usuário no PostgreSQL e armazena a senha com BCrypt. A página administrativa exige essas credenciais e usa a API para salvar cada moto. O formulário aceita imagens JPEG, PNG, WebP e GIF de até 5 MB; os arquivos enviados ficam no PostgreSQL e continuam disponíveis após reinícios e novos deploys.

### 5.2 Front-end React
Instale as dependências e gere a aplicação React para os estáticos servidos pelo Spring Boot:
```powershell
cd frontend
npm install
npm run build
```
O build é gravado em `backend/src/main/resources/static/`. Para desenvolver com atualização automática, use `npm run dev` na pasta `frontend`; as chamadas `/api` são encaminhadas ao back-end local na porta `8080`, enquanto o vídeo da home é servido diretamente pelo Vite. Defina `VITE_API_BASE_URL` apenas quando a API estiver hospedada em uma origem diferente.

### 5.3 Iniciando o Back-end Spring Boot
Na pasta `backend/`:
```powershell
.\mvnw.cmd spring-boot:run
```
Ou compile o executável e execute diretamente:
```powershell
.\mvnw.cmd package
java -jar target/franca-simulador-api-1.0.0.jar
```
A API estará acessível em: `http://localhost:8080`

### 5.4 Acessando as páginas do sistema
O Spring Boot serve o site React e a API na mesma origem. A aplicação usa navegação interna por hash, sem recarregar a página.

Com o backend em execucao, acesse:
- Início: `http://localhost:8080/`
- Catálogo: `http://localhost:8080/#/motos`
- Simulador: `http://localhost:8080/#/simulador`
- Painel administrativo: `http://localhost:8080/#/admin`
## 6. Endpoints Principais da API REST

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/motos` | Lista o catálogo com filtros opcionais (`busca`, `categoria`, `precoMax`) |
| `GET` | `/api/motos/{id}` | Retorna detalhes completos de uma moto |
| `PUT` | `/api/admin/motos/{id}` | Atualiza os dados da moto e opcionalmente substitui sua imagem (multipart/form-data; acesso administrativo) |
| `POST` | `/api/clientes` | Solicita cadastro e envia um link de confirmação por e-mail |
| `GET` | `/api/clientes/confirmacao` | Valida o convite (token no cabeçalho `Authorization: Bearer ...`) |
| `POST` | `/api/clientes/confirmacao` | Cria a conta e define a senha com o mesmo token Bearer |
| `GET` | `/api/clientes/me` | Retorna a conta autenticada (requer login) |
| `GET` | `/api/simulacoes/configuracao` | Retorna taxas e premissas padrão (requer login de cliente) |
| `POST` | `/api/simulacoes/financiamento` | Calcula o financiamento (requer login de cliente) |
| `POST` | `/api/simulacoes/consorcio` | Calcula o consórcio (requer login de cliente) |
| `POST` | `/api/simulacoes/comparar` | Compara as modalidades (requer login de cliente) |

O cliente informa nome e e-mail em **Minha conta** e recebe um link temporário (30 minutos, uso único) para definir a senha. O token aleatório é salvo no banco somente como hash SHA-256 e validado como Bearer token. Nome, e-mail, senha, status e role (`ROLE_ADMIN` ou `ROLE_CLIENTE`) ficam na tabela `users`; a senha é armazenada com BCrypt. Depois, o cliente entra com o e-mail e senha; as rotas de simulação permitem apenas usuários com a role `CLIENTE`.

---

## 7. Decisões Arquiteturais Explicadas para a Banca

1. **Por que Java 21 Records para os DTOs?**
   Records são classes imutáveis e concisas nativas do Java moderno. Elas eliminam código boilerplate (getters, equals, hashCode) e asseguram que os dados transferidos pela rede não sejam alterados acidentalmente.
2. **Por que BigDecimal em vez de Double/Float?**
   Números de ponto flutuante binário (`double`) causam dízimas e imprecisões no cálculo de centavos (ex: `0.1 + 0.2 = 0.30000000000000004`). Em finanças, o uso de `BigDecimal` com escala explícita e política de arredondamento (`HALF_UP`) é indispensável.
3. **Por que Flyway para Migrations?**
   Em sistemas profissionais, nunca se usa `ddl-auto=update` em produção. O Flyway versiona os scripts SQL (`V1`, `V2`), permitindo rastreabilidade e reprodução exata da base de dados em qualquer máquina da banca.
4. **Por que React com Vite no front-end?**
   React organiza as telas e estados da aplicação em componentes reutilizáveis. O Vite mantém um fluxo rápido de desenvolvimento e gera os arquivos estáticos que o Spring Boot serve junto da API.
