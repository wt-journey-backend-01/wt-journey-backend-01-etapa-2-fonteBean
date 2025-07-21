<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 6 créditos restantes para usar o sistema de feedback AI.

# Feedback para fonteBean:

Nota final: **30.2/100**

Olá, fonteBean! 👋🚀

Primeiramente, parabéns pelo esforço e por já ter colocado no papel (ou melhor, no código!) uma API REST para o Departamento de Polícia. Isso não é tarefa fácil e você já tem uma boa base para trabalhar! 🎉

---

## O que você já mandou bem! 👏

- Sua estrutura de arquivos está muito próxima do esperado, com pastas separadas para **routes**, **controllers** e **repositories** — isso é essencial para uma aplicação organizada e escalável.
- Você já implementou os métodos básicos de `GET`, `POST` e `DELETE` para os recursos `/agentes` e `/casos`. Isso é um ótimo começo!
- O uso de `uuid` para gerar IDs únicos está correto, o que garante que seus dados tenham identificadores confiáveis.
- O middleware `express.json()` e o `morgan` para logs estão configurados corretamente no `server.js`.
- Você já tem validações básicas para campos obrigatórios (como `nome` e `cargo` para agentes, e `titulo`, `descricao`, `status` para casos).
- Os retornos de status HTTP 200 e 201 estão presentes e corretos em vários pontos — isso mostra que você entende a importância de comunicar corretamente o resultado da operação para o cliente.
- Alguns testes bônus, como filtragens simples e mensagens customizadas, ainda não foram implementados, mas você está no caminho certo para depois avançar para eles.

---

## Pontos que merecem sua atenção para subir de nível 🚦

### 1. Métodos PUT e PATCH não implementados (nem nos agentes nem nos casos)

Ao analisar seus arquivos de rotas (`routes/agentesRoutes.js` e `routes/casosRoutes.js`), percebi que as rotas para atualização via PUT e PATCH estão comentadas, por exemplo:

```js
// router.put('/agentes/:id', (req,res));
// router.patch('/agentes/:id', (req,res));
```

E no controlador, essas funções nem existem ainda. Isso é a raiz de vários problemas, porque:

- Sem esses métodos, você não consegue atualizar os dados dos agentes ou casos.
- Muitos testes e funcionalidades esperam que você implemente essas atualizações.
- Além disso, sem essas rotas e controladores, não há como validar payloads de atualização nem retornar os status codes corretos para erros.

**Vamos juntos resolver isso?** Você pode começar criando as funções `updateAgente` e `updateCaso` nos respectivos controladores e conectá-las nas rotas. Um exemplo básico para o PUT (atualização completa) do agente seria:

```js
function updateAgente(req, res) {
  const agenteId = req.params.id;
  const { nome, cargo, dataDeIncorporacao } = req.body;

  if (!nome || !cargo || !dataDeIncorporacao) {
    return res.status(400).send("Todos os campos são obrigatórios para atualização completa.");
  }

  const agente = agentesRepository.findById(agenteId);
  if (!agente) {
    return res.status(404).send("Agente não encontrado.");
  }

  // Aqui você também pode validar o formato da dataDeIncorporacao, que falarei mais abaixo.

  agente.nome = nome;
  agente.cargo = cargo;
  agente.dataDeIncorporacao = new Date(dataDeIncorporacao);

  res.status(200).json(agente);
}
```

Recomendo o vídeo sobre [Arquitetura MVC com Node.js](https://youtu.be/bGN_xNc4A1k?si=Nj38J_8RpgsdQ-QH) para entender melhor como organizar essas funções.

---

### 2. Validação da data de incorporação do agente está faltando ou incorreta

Percebi que no seu `createAgente` você está criando a data de incorporação com `new Date()`, o que coloca a data atual, mas não permite que o usuário envie uma data personalizada. Além disso, nos testes, foi detectado que:

- Você permite datas inválidas (formato errado).
- Permite datas no futuro.
- Permite data vazia.

Isso significa que a validação da data é fundamental para garantir a integridade dos dados.

**Por que isso é importante?** Imagine que um agente entrou no futuro ou com uma data mal formatada — isso pode quebrar a lógica do sistema depois.

**Como melhorar?** Você pode receber a data no corpo da requisição, validar seu formato (por exemplo, usando regex ou bibliotecas como `moment.js` ou `date-fns`) e verificar se a data não é futura. Exemplo simples:

```js
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function isFutureDate(date) {
  return date > new Date();
}

function createAgente(req, res) {
  const { nome, cargo, dataDeIncorporacao } = req.body;

  if (!nome || !cargo || !dataDeIncorporacao) {
    return res.status(400).send("Nome, cargo e data de incorporação são obrigatórios");
  }

  if (!isValidDate(dataDeIncorporacao)) {
    return res.status(400).send("Data de incorporação inválida");
  }

  if (isFutureDate(new Date(dataDeIncorporacao))) {
    return res.status(400).send("Data de incorporação não pode ser no futuro");
  }

  const novoAgente = {
    id: uuidv4(),
    nome,
    cargo,
    dataDeIncorporacao: new Date(dataDeIncorporacao),
  };
  agentesRepository.criarAgente(novoAgente);
  res.status(201).json(novoAgente);
}
```

Aqui está um recurso para te ajudar a entender melhor validação de dados em APIs Express: [Validação de Dados em APIs Node.js/Express](https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_).

---

### 3. Validação do agente_id no caso está incorreta

No seu `createCaso`, você está atribuindo um `agente_id` gerado aleatoriamente com `uuid()`, sem validar se esse agente realmente existe:

```js
const novoCaso = {
  id: uuid(),
  titulo,
  descricao,
  status,
  agente_id: uuid() // <-- aqui está o problema
}
```

Isso causa problemas porque você pode criar casos ligados a agentes que não existem, o que quebra a integridade referencial dos dados.

**Como corrigir?** O `agente_id` deve vir no corpo da requisição e você deve validar se esse agente existe antes de criar o caso. Exemplo:

```js
function createCaso(req, res) {
  const { titulo, descricao, status, agente_id } = req.body;

  if (!titulo || !descricao || !status || !agente_id) {
    return res.status(400).send("Título, descrição, status e agente_id são obrigatórios");
  }

  if (status !== "aberto" && status !== "solucionado") {
    return res.status(400).send("Status não permitido");
  }

  const agente = agentesRepository.findById(agente_id);
  if (!agente) {
    return res.status(404).send("Agente não encontrado para o agente_id fornecido");
  }

  const novoCaso = {
    id: uuid(),
    titulo,
    descricao,
    status,
    agente_id,
  };

  casosRepository.criarCaso(novoCaso);
  res.status(201).json(novoCaso);
}
```

Isso vai garantir que todo caso esteja vinculado a um agente válido.

---

### 4. Tratamento incorreto de erros e status HTTP

Em alguns pontos, você está retornando status HTTP que não refletem o erro corretamente, por exemplo:

- Quando um agente ou caso não é encontrado, você retorna `400 Bad Request`, mas o correto é `404 Not Found`.
- Quando o payload está mal formatado, você às vezes não retorna o status 400, ou não retorna nada (esquece o `return`), o que pode causar problemas.

Exemplo que precisa de ajuste no seu `deleteAgente`:

```js
if(agentIndex === -1){
  return res.status(400).send("Agente nao encontrado"); // Aqui deveria ser 404
}
```

O correto:

```js
if(agentIndex === -1){
  return res.status(404).send("Agente não encontrado");
}
```

Além disso, para operações de DELETE, o status mais adequado é `204 No Content` quando a exclusão é bem-sucedida e não há conteúdo para retornar.

---

### 5. Pequenos erros que podem travar seu código

- No `deleteCaso` do seu `casosController.js`, você escreveu:

```js
const casos = casosRepositoryRepository.findAll();
```

Percebeu que tem um `casosRepositoryRepository`? Isso provavelmente é um erro de digitação e vai causar erro na execução.

---

### 6. Falta de filtros, ordenação e mensagens customizadas (bônus)

Você ainda não implementou os endpoints e funcionalidades para filtragem por status, agente responsável, palavras-chave, ordenação por data, e mensagens de erro customizadas.

Essas funcionalidades são importantes para deixar sua API mais robusta e amigável, e também para aumentar sua nota! 😉

---

## Recomendações de estudos para você crescer ainda mais 📚

- Para entender melhor o básico de APIs REST com Express e manipulação de rotas:  
  https://youtu.be/RSZHvQomeKE  
  https://expressjs.com/pt-br/guide/routing.html

- Para organizar seu projeto com arquitetura MVC e separar responsabilidades:  
  https://youtu.be/bGN_xNc4A1k?si=Nj38J_8RpgsdQ-QH

- Para validar dados e tratar erros corretamente:  
  https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/400  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/404

- Para manipular arrays e objetos no JavaScript (fundamental para manipular seus dados em memória):  
  https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI

---

## Resumo dos principais pontos para focar e melhorar 🚀

- [ ] Implemente os métodos **PUT** e **PATCH** para atualizar agentes e casos (rotas e controladores).
- [ ] Melhore a validação da **dataDeIncorporacao** dos agentes, garantindo formato correto e que não seja data futura.
- [ ] Corrija a criação de casos para receber e validar o `agente_id`, garantindo que o agente existe.
- [ ] Ajuste os códigos de status HTTP para erros e sucesso, seguindo as boas práticas (404 para não encontrado, 400 para payload inválido, 204 para delete sem conteúdo).
- [ ] Corrija erros de digitação que podem quebrar o código (ex: `casosRepositoryRepository`).
- [ ] Avance nas funcionalidades bônus de filtragem, ordenação e mensagens customizadas para melhorar a API.

---

FonteBean, você já tem uma base muito boa e organizou seu projeto de forma clara! Com esses ajustes, sua API vai ficar muito mais robusta, confiável e alinhada com as boas práticas do desenvolvimento backend. Continue firme, praticando e explorando cada detalhe! 💪✨

Se precisar de ajuda para implementar alguma parte, me chama que a gente resolve junto! 😉

Um abraço e bons códigos! 👨‍💻👩‍💻🚓

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>