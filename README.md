# Capa

- **Título do Projeto**: S.G.C (Sistema de Gestão de Compras)
- **Nome do Estudante**: Lukas Thiago Rodrigues.
- **Curso**: Engenharia de Software.
- **Data de Entrega**: .

# Resumo

O Sistema de Gestão de Compras (S.G.C) é uma plataforma voltada para empresas que desejam gerenciar o processo de aquisição de produtos junto a fornecedores.
O sistema foi idealizado para centralizar etapas da gestão de compras, como o cadastro de fornecedores e produtos, a solicitação de cotações, a comparação de propostas e o gerenciamento dos pedidos realizados.

Através de uma interface intuitiva e recursos integrados, o S.G.C permite que empresas ganhem maior controle sobre suas compras, aumentem a transparência nas negociações com fornecedores e tomem decisões com base em dados históricos. Fornecedores, por sua vez, podem responder diretamente às solicitações de cotação e pedidos recebidos, promovendo uma comunicação mais ágil e eficaz.

Com a adoção do sistema, espera-se uma significativa redução de custos operacionais, melhor organização das informações e maior eficiência no processo de decisão relacionado às aquisições empresariais.

## 1. Introdução

- **Contexto**: Atualmente, muitas empresas enfrentam desafios significativos na gestão de compras, afetando diretamente a eficiência, os custos e a tomada de decisões estratégicas. Entre os principais obstáculos estão:

  - Dificuldades na comparação de preços, prazos e condições comerciais entre diferentes fornecedores;

  - Ausência de um histórico estruturado de compras anteriores, o que prejudica a análise de desempenho de fornecedores e compradores;

  - Processos manuais e burocráticos, como o envio de planilhas por e-mail e aprovações físicas.

  Em um cenário empresarial cada vez mais digital, torna-se essencial contar com ferramentas especializadas que integrem e automatizem o ciclo de compras, promovendo agilidade, controle e assertividade.

  No mercado atual, diversas plataformas já tentam resolver parte desses problemas, como o SAP Ariba, o TOTVS Protheus, Pipefy, entre outros.

  Essas soluções, apesar de consolidadas, frequentemente apresentam barreiras de entrada como custo elevado, baixa usabilidade e uma interfaçe pouco intuitiva. É nesse contexto que o S.G.C se propõe a atuar: entregar uma solução moderna, acessível e intuitiva para as    empresas, com foco em digitalização, usabilidade e integração de recursos como assinatura digital, que agregam segurança jurídica e eliminam o papel nos processos de aprovação.

- **Justificativa**: A implantação de uma plataforma de gestão de compras é essencial para empresas que buscam eficiência, controle e transparência nos processos de aquisição. Com ela, é possível eliminar tarefas manuais, centralizar o histórico de compras e tomar decisões baseadas em dados concretos.
Além de melhorar a governança e o compliance, a automação permite rastreabilidade das etapas, facilita auditorias e garante maior segurança e agilidade nas aprovações. A plataforma também promove relacionamentos mais eficientes com fornecedores, alinhando a empresa às melhores práticas de mercado e preparando-a para um cenário corporativo cada vez mais digital e competitivo.

- **Objetivos**: Desenvolver uma plataforma digital de gestão de compras que otimize o relacionamento com fornecedores, centralize informações estratégicas e automatize processos de aquisição, fornecendo suporte ágil e eficiente à tomada de decisão.
  Como objetivos secundários, busca-se:

  - Melhorar a organização dos pedidos e cotações;

  - Centralizar informações e histórico de compras;

  - Implementar workflow de aprovações de pedidos e cotações;
 
  - Reduzir tempo e erros operacionais;
 
  - Incluir recursos de assinatura digital.

## 2. Descrição do Projeto

- **Tema do Projeto**: Uma plataforma para gestão de compras empresariais.
- **Problemas a Resolver**: Os principais problemas que esse sistema irá resolver são:
  - Falta de transparência e dificuldade na comparação de propostas de fornecedores.

  - Dificuldade na gestão e no armazenamento de informações sobre compras anteriores.

  - Processos manuais que tornam a aprovação de compras demorada e suscetível a erros.

  - Falta de controle sobre os custos e previsibilidade de gastos.

  - Ausência de um sistema para acompanhamento de pedidos.
- **Limitações**: O projeto não abrangerá:
  - Aspectos relacionados à logística e à entrega dos produtos adquiridos.

  - Funcionalidades para pagamento e faturamento.

## 3. Especificação Técnica

Esta seção apresenta uma descrição detalhada da proposta, incluindo os requisitos de software, protocolos, algoritmos, procedimentos e formatos de dados utilizados na implementação do sistema.

### 3.1. Requisitos de Software

- **Lista de Requisitos:**
  - Requisitos Funcionais (RF):

    - O sistema deve permitir o cadastro de fornecedores e produtos.

    - Deve ser possível realizar solicitações de cotação a um ou mais fornecedores.

    - O usuário deve conseguir visualizar e comparar diferentes propostas recebidas.

    - O sistema deve permitir a aprovação e registro de pedidos de compra.

    - Deve oferecer relatórios sobre histórico de compras e cotações realizadas.
   
    - O usuário deve poder realizar a assinatura digital de documentos.

  - Requisitos Não-Funcionais (RNF):

    - O sistema deve garantir alta disponibilidade e escalabilidade.

    - A interface deve garantir uma experiência interativa e fluida ao usuário.

    - Deve implementar criptografia para garantir a segurança dos dados armazenados.

    - O tempo de resposta para consultas deve ser inferior a 2 segundos.

    - O sistema deve possuir logs para monitoramento e auditoria de ações.
    
    - Utilizará um banco de dados relacional para armazenar informações de fornecedores, cotações, pedidos e usuários.
   
    - Garantir a autenticidade e integridade dos documentos assinados.

 
- **Representação dos Requisitos:**
  
    ![image](https://github.com/user-attachments/assets/a5a41f57-bbd9-4c03-8727-8a7e44ca94d3)


### 3.2. Considerações de Design

- **Visão Inicial da Arquitetura**: A arquitetura será dividida em camadas: apresentação, lógica de aplicação e dados. As comunicações entre cliente e servidor ocorrerão por meio de API REST.
- **Padrões de Arquitetura**: Será adotado o padrão MVC (Model-View-Controller), separando claramente as responsabilidades entre dados, regras de negócio e interface.
- **Modelo C4**:
  
    ![image](https://github.com/user-attachments/assets/3a318119-4461-4eef-b3c8-581127a1dc65)


### 3.3. Stack Tecnológica

- **Linguagens de Programação**: JavaScript/TypeScript: Utilizados no frontend e backend pela sinergia com Angular e Node.js, além da popularidade e suporte da comunidade.
- **Frameworks e Bibliotecas**:
  - Angular: Para a construção de uma interface de usuário moderna e responsiva.

  - Express.js: Framework minimalista e eficiente para desenvolvimento de APIs no Node.js.

  - TypeORM: ORM para manipulação do banco de dados relacional.
- **Ferramentas de Desenvolvimento e Gestão de Projeto**:
  - Figma: Protótipos da interface.

  - Git e GitHub: Controle de versão.

  - Jira: Planejamento e acompanhamento das tarefas.

  - Postman: Testes de APIs.

  - Docker: Contêineres para facilitar o deploy e padronização do ambiente.

### 3.4. Considerações de Segurança

- Criptografia de Dados Sensíveis: Será aplicada criptografia a senhas e dados críticos utilizando bcrypt e HTTPS.

- Autenticação: Implementação de autenticação com JWT.

- Validação de Entrada: Uso de validação e sanitização de dados de entrada para evitar injeções de SQL e XSS.

- Monitoramento e Logs: Inclusão de sistema de auditoria e rastreamento de atividades suspeitas.

## 4. Próximos Passos

- Finalização do protótipo no Figma.

- Implementação inicial do backend com autenticação básica.

- Desenvolvimento da interface principal.

- Integração entre frontend e backend.

- Testes manuais e unitários.

- Expansão de funcionalidades e testes mais robustos.

## 5. Referências

- Documentações oficiais do Node.js, Angular, Express.

- Repositórios de bibliotecas no GitHub.

- Artigos e tutoriais técnicos da MDN Web Docs.

- Stack Overflow para resolução de dúvidas práticas.

## 6. Avaliações de Professores

- Considerações Professor/a:
- Considerações Professor/a:
- Considerações Professor/a:
