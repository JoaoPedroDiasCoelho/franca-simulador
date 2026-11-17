# França Simulador
## Sistema de simulação financeira para compra de motocicletas

### Trabalho de Conclusão de Curso
### Curso Técnico em Informática
### Instituto/Escola: FAETEC
### Aluno: Gabriel França
### Professor(a) Orientador(a): Professor Alexandre
### Ano: 2026

---

## 1. Resumo

O projeto França Simulador tem como objetivo desenvolver uma aplicação web para auxiliar pessoas interessadas na aquisição de motocicletas a comparar de forma didática e transparente as condições de financiamento e consórcio. A solução foi pensada como um ambiente interativo que reúne informações de modelos de motocicletas, cálculos financeiros e análise comparativa entre duas modalidades de compra amplamente utilizadas no mercado brasileiro.

A aplicação permite ao usuário consultar um catálogo de motos, definir valores de entrada, taxa de juros, prazo e outros parâmetros relevantes, e receber simulações detalhadas de parcelas, total pago, diferença entre modalidades e indicadores de viabilidade financeira. O sistema foi implementado com arquitetura full stack, utilizando tecnologias modernas para a apresentação de dados e a execução de cálculos no back-end.

Os resultados esperados incluem maior conscientização sobre custos, riscos e benefícios de cada alternativa de aquisição, além de oferecer uma ferramenta educativa e acessível para tomada de decisão. O projeto se enquadra na área de sistemas de informação aplicada ao planejamento financeiro pessoal, com foco em acessibilidade, clareza de informações e uso de conceitos matemáticos relevantes para o dia a dia do consumidor.

---

## 2. Introdução

A compra de uma motocicleta envolve mais do que a escolha do modelo desejado. Em muitos casos, o consumidor precisa avaliar condições de pagamento, impacto dos juros, prazos de financiamento, custos de administração, seguros e riscos envolvidos no processo. Diante disso, a decisão de comprar pode ser influenciada por pouca informação ou por falta de ferramentas que permitam comparar alternativas de forma clara.

Nesse cenário, surge a necessidade de desenvolver uma solução tecnológica que auxilie na análise financeira de aquisição de motocicletas. O França Simulador foi concebido para atender essa demanda, propondo uma plataforma web que reúne dados de motos, simula cenários financeiros e compara os impactos de duas modalidades de aquisição: financiamento e consórcio.

A proposta do sistema é didática e acadêmica. Ela não tem caráter de oferta de crédito ou garantia de contemplação, mas busca educar os usuários em relação às diferenças entre os cenários. O projeto considera, de forma simplificada, os principais parâmetros financeiros envolvidos no processo de compra, como valor de entrada, valor do bem, taxa de juros, prazo, custos administrativos e seguros.

---

## 3. Justificativa

A aquisição de motocicletas no Brasil é frequente e pode ocorrer por diferentes mecanismos de pagamento. Entre os mais comuns, destacam-se o financiamento e o consórcio. Contudo, muitos consumidores não têm acesso a ferramentas que permitam compreender, de maneira objetiva, as diferenças entre essas opções.

O financiamento oferece posse imediata do bem, mas normalmente envolve juros e parcelas mensais fixas. Já o consórcio costuma apresentar menor custo total, mas depende de sorteio ou lance para contemplação e não garante aquisição imediata. Essa diferença é relevante tanto para o cliente quanto para a educação financeira geral.

A falta de comparações claras gera decisões baseadas em informações superficiais. O sistema proposto busca reduzir esse problema, possibilitando que o usuário veja em tempo real o impacto de cada modalidade em termos de valor total pago, valor das parcelas, prazo e diferença entre as condições simuladas.

Além disso, o projeto tem valor acadêmico, porque combina conhecimentos de programação, banco de dados, design de interfaces, cálculos financeiros e desenvolvimento de software em camadas. O sistema enfatiza a aplicação prática das disciplinas estudadas, especialmente no que diz respeito à lógica de negócio, modelagem de dados e desenvolvimento de sistemas web.

---

## 4. Problema de Pesquisa

Como desenvolver um sistema web capaz de simular e comparar financeiramente o processo de aquisição de motocicletas por financiamento e consórcio, de forma clara, educativa e acessível para o usuário?

### 4.1 Hipótese

A criação de uma aplicação web com cálculos financeiros confiáveis e interface intuitiva pode contribuir para uma melhor compreensão das diferenças entre financiamento e consórcio e auxiliar a decisão de compra de motocicletas.

---

## 5. Objetivos

### 5.1 Objetivo Geral

Desenvolver uma aplicação web para simular e comparar financiamento e consórcio de motocicletas, oferecendo informações financeiras claras para auxiliar a tomada de decisão do consumidor.

### 5.2 Objetivos Específicos

- Criar um catálogo de motocicletas com dados de preço e especificações;
- Implementar cálculos de financiamento pela sistemática da Tabela Price;
- Simular custos de consórcio considerando taxa administrativa, fundo de reserva e seguros;
- Desenvolver uma tela de comparação entre as modalidades;
- Garantir uma interface amigável e responsiva para diferentes dispositivos;
- Documentar a lógica de negócio e a arquitetura do sistema;
- Validar a funcionalidade por meio de testes automatizados.

---

## 6. Revisão de Literatura

### 6.1 Financiamento

O financiamento é uma modalidade de aquisição em que o consumidor recebe o bem imediatamente, mas paga por ele em parcelas mensais. Em geral, a operação envolve juros compostos, entrada e prazo definido. O sistema francês de amortização, conhecido como Tabela Price, é amplamente utilizado no mercado financeiro brasileiro. Nesse sistema, a parcela mensal é fixa e composta pelo valor do principal e pelos juros devidos sobre o saldo devedor.

A fórmula da parcela mensal em um financiamento com taxa fixa pode ser expressa por:

PMT = P × i / (1 - (1 + i)^(-n))

Onde:
- P = valor financiado;
- i = taxa de juros mensal;
- n = número de parcelas;
- PMT = valor da parcela.

Essa abordagem é importante porque permite ao usuário visualizar o custo real da operação e entender o impacto dos juros ao longo do tempo.

### 6.2 Consórcio

O consórcio funciona de forma diferente: o consumidor participa de um grupo e paga parcelas mensais enquanto aguarda a contemplação. Quando uma carta é sorteada, o participante pode retirar o bem ou receber o valor correspondente, conforme a modalidade. Em geral, o consórcio apresenta custos menores do que o financiamento, pois não há incidência de juros bancários, mas há dependência da contemplação para obtenção imediata do bem.

Na prática, o custo do consórcio está relacionado a taxas administrativas, fundo de reserva, seguros e administração do plano. Por esse motivo, a simulação precisa considerar esses itens para que a comparação seja justa e didática.

### 6.3 Importância da Simulação Financeira

Simulações financeiras são ferramentas fundamentais para a educação do consumidor. Elas permitem comparar cenários, avaliar o impacto de taxas, entradas, prazos e demais variáveis antes de tomar uma decisão. Quando bem implementadas, essas ferramentas ajudam a evitar comprometimentos financeiros excessivos e promovem uma análise mais racional da compra.

---

## 7. Metodologia

A metodologia do projeto foi organizada em etapas que combinaram análise de requisitos, desenvolvimento de software, testes e validação funcional.

### 7.1 Levantamento de Requisitos

Inicialmente, foi realizado o estudo das necessidades do usuário, com foco em compras de motocicletas e comparação entre financiamento e consórcio. Foram identificados os principais dados necessários, como:

- valor da moto;
- valor de entrada;
- taxa de juros mensal;
- prazo em meses;
- percentual de taxa administrativa;
- percentual de fundo de reserva;
- valor do seguro mensal;
- diferença entre modalidades de pagamento.

### 7.2 Modelagem do Sistema

A aplicação foi estruturada em camadas:

- Front-end: responsável pela interface visual e pela interação do usuário;
- Back-end: responsável pelo processamento dos dados e cálculo financeiro;
- Banco de dados: responsável pelo armazenamento de informações do catálogo e demais registros;
- API REST: responsável pela comunicação entre front-end e back-end.

### 7.3 Desenvolvimento

O desenvolvimento foi realizado em duas frentes principais:

1. Back-end em Java com Spring Boot, responsável por expor endpoints para consulta de motos e cálculo de simulações.
2. Front-end em React, responsável pela interface de usuário e apresentação de resultados.

### 7.4 Testes

A validação do sistema foi realizada por meio de testes automatizados, com foco em:

- serviços de cálculo financeiro;
- comparadores entre modalidades;
- endpoints da API;
- regras de negócio e exceções.

---

## 8. Arquitetura do Sistema

A arquitetura do França Simulador segue o padrão de aplicação web moderna, com separação entre cliente e servidor.

### 8.1 Front-end

O front-end foi implementado em React com Vite, oferecendo interface responsiva e navegação simples. A camada visual permite que o usuário:

- visualize motos disponíveis;
- edite parâmetros da simulação;
- compare financiamento e consórcio;
- consulte resultados em valores monetários formatados.

### 8.2 Back-end

O back-end foi implementado em Java com Spring Boot. Ele expõe endpoints REST para:

- listar motos;
- calcular financiamento;
- calcular consórcio;
- comparar modalidades;
- validar entradas do usuário.

### 8.3 Banco de Dados

O sistema utiliza PostgreSQL, com persistência de dados de catálogo e controle de dados de configuração. O banco é acessado por meio do Spring Data JPA e migrations com Flyway.

### 8.4 Comunicação entre Camadas

A comunicação entre front-end e back-end ocorre por meio de requisições HTTP, com respostas em formato JSON. Esse padrão permite modularidade, manutenção e evolutividade do sistema.

---

## 9. Tecnologias Utilizadas

### 9.1 Back-end
- Java 21
- Spring Boot 3.3.4
- Spring Web
- Spring Data JPA
- Hibernate
- Bean Validation
- Flyway
- JUnit 5, Mockito
- Maven

### 9.2 Front-end
- React 18
- Vite
- JavaScript / JSX
- CSS3
- Fetch API

### 9.3 Banco de Dados
- PostgreSQL 17

---

## 10. Funcionamento do Sistema

O sistema funciona da seguinte forma:

1. O usuário acessa a interface web;
2. Visualiza o catálogo de motocicletas;
3. Seleciona uma moto e informa dados financeiros;
4. Define valor de entrada, prazo, taxa de juros e demais parâmetros;
5. O back-end executa os cálculos;
6. A aplicação exibe as parcelas, custo total, diferença entre modalidades e análise comparativa;
7. O usuário pode avaliar o cenário antes de decidir pela compra.



### 10.3 Comparação Final

A comparação entre modalidades apresenta:

- diferença no valor total pago;
- diferença de parcela;
- custo final estimado;
- vantagens e desvantagens de cada opção.

---

## 11. Estrutura de Pastas do Projeto

```text
franca-simulador/
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── README.md
└── DOCUMENTO_TCC_FRANCA_SIMULADOR.md
```

---

## 12. Resultados Esperados

O projeto tem como principal resultado a disponibilização de uma ferramenta educacional para análise financeira de aquisição de motocicletas. Espera-se que o sistema:

- auxilie na tomada de decisão do consumidor;
- reduza a falta de informação sobre custos de compra;
- promova mais consciência financeira;
- ofereça uma interface simples e funcional;
- demonstre a aplicação prática de tecnologias atuais em desenvolvimento web.

Além disso, a solução serve como base para futuras evoluções, como inclusão de outros tipos de veículos, filtros de busca, histórico de simulações, comparação com outros modelos e integração com dados reais de mercado.

---

## 13. Cronograma Estimado

| Etapa | Período estimado |
|------|------------------|
| Levantamento de requisitos | 1 semana |
| Planejamento e arquitetura | 1 semana |
| Desenvolvimento do back-end | 2 semanas |
| Desenvolvimento do front-end | 2 semanas |
| Integração e testes | 1 semanas |
| Ajustes finais e documentação | > 1 semana |

---

## 14. Considerações Finais

O França Simulador representa uma aplicação relevante para o contexto da educação financeira e para o uso prático de tecnologias de desenvolvimento web. O projeto integra conceitos de programação, matemática financeira, banco de dados e análise de requisitos, transformando esse conjunto em uma solução útil para o usuário final.

A proposta se destaca por apresentar uma ferramenta acessível, didática e funcional, que permite avaliar de forma mais consciente a aquisição de motocicletas por diferentes meios de pagamento. Mais do que apenas uma interface digital, o sistema funciona como uma ferramenta de apoio à decisão, reforçando o papel da tecnologia como meio de democratizar informação e promover escolhas mais informadas.

---

## 15. Referências

1. BRASIL. Lei nº 14.754, de 12 de dezembro de 2023. Disponível em: [https://www.planalto.gov.br](https://www.planalto.gov.br)
2. ASSAF NETO, Alexandre. Matemática Financeira e Suas Aplicações. São Paulo: Atlas, 2017.
3. CASTELO BRANCO, Anselmo. Financiamento e Consórcio: conceitos e aplicações financeiras. São Paulo: Editora X, 2020.
4. SPRING FRAMEWORK. Documentação oficial do Spring Boot. Disponível em: https://spring.io/projects/spring-boot
5. REACT. Documentação oficial da biblioteca React. Disponível em: https://react.dev
6. POSTGRESQL. Documentação oficial do PostgreSQL. Disponível em: https://www.postgresql.org/docs/

---

## 16. Anexos ou Observações

- O sistema tem finalidade acadêmica e educativa.
- Os cálculos financeiros são projeções matemáticas e não substituem consultoria financeira profissional.
- Os valores utilizados nas simulações devem ser considerados somente como referência.
- O projeto pode ser expandido em versões futuras para incluir mais modelos de veículos, dados reais de mercado e comparações com outras formas de pagamento.

---

## 17. Modelo de Declaração de Autoria (Opcional)

Declaro que o presente trabalho foi desenvolvido de forma original e que as informações aqui contidas foram elaboradas com responsabilidade, buscando refletir o contexto técnico e acadêmico do projeto França Simulador.

---

## 18. Observação para Personalização

Este documento pode ser adaptado para atender ao formato exigido pela instituição, incluindo:

- capa com logo e dados da escola;
- folha de aprovação;
- sumário automático;
- paginação;
- referências normativas da FAETEC ou do curso;
- anexos de telas, diagramas e imagens do sistema.

Para uma versão final mais formal, recomenda-se ajustar as seções conforme a norma exigida pela instituição e incluir imagens de interface, diagramas de arquitetura e resultados de testes.
