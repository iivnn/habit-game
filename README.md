# Habit Quest

Habit Quest é um app de gamificação de hábitos em estilo RPG medieval, onde tarefas diárias e semanais geram XP, gold e progresso para o personagem do usuário.

## Visão Geral

O projeto foi criado para transformar rotina em progressão de jogo. Em vez de tratar tarefas do dia a dia como uma lista fria, o app converte hábitos em quests, recompensas e evolução de personagem.

No Habit Quest, o usuário escolhe uma classe, cria suas próprias missões e recebe `xp` e `gold` ao concluir objetivos como estudar, beber água, treinar, ler ou manter uma rotina de autocuidado.

Além do progresso principal, o app também inclui:

- classes jogáveis
- sistema de nível
- loja de companheiros
- tarefas diárias, semanais e opcionais
- relatório temático de fim de dia
- histórico recente de atividade
- versão mobile e versão web

## Objetivo

O objetivo do projeto é incentivar consistência e criação de hábitos por meio de elementos clássicos de RPG, sem perder a simplicidade de uso.

A proposta é unir:

- produtividade
- motivação visual
- senso de progressão
- organização pessoal

## Funcionalidades

- escolha inicial de classe: `guerreiro`, `arqueiro`, `mago`, `ladino`, `clérigo`, `feiticeiro` e `cavaleiro`
- criação de tarefas diárias e semanais
- suporte a missões `principais`, `secundárias` e `opcionais`
- configuração de dias ativos para tarefas diárias
- configuração manual de recompensas em `xp` e `gold`
- seleção de ícone para cada quest
- notificações locais para tarefas compatíveis em ambiente mobile
- conclusão e reversão de conclusão de tarefas
- exclusão de tarefas por toque longo
- edição de tarefas existentes
- sistema de níveis com progressão crescente de XP
- ganho de gold para desbloquear companheiros
- equipar um companheiro ativo
- histórico de tarefas concluídas
- relatório diário com mensagem temática
- exportação de backup do estado atual
- onboarding inicial
- suporte web para uso no navegador

## Exemplos de Utilização

Exemplos de quests que um usuário pode criar:

- `🦷 Escovar os dentes`
- `💧 Beber 2 litros de água`
- `📚 Estudar 1 hora`
- `🏃 Fazer treino do dia`
- `🧘 Meditar por 10 minutos`
- `🛌 Dormir antes das 23h`

Exemplo de uso no dia a dia:

1. o usuário escolhe uma classe
2. cadastra uma rotina diária com horários e recompensas
3. conclui as quests ao longo do dia
4. ganha `xp` e `gold`
5. sobe de nível e desbloqueia companheiros

## Como Foi Feito

O app foi construído com foco em evolução contínua e mudanças futuras no escopo, usando separação clara entre interface, regras de negócio e persistência.

A estrutura foi pensada para permitir alterações grandes sem exigir reescrita completa da base. As regras principais ficam desacopladas da interface, o que ajuda a seguir uma abordagem próxima do princípio de `Open/Closed`, permitindo extensão de comportamento sem quebrar as partes centrais do sistema.

Também houve preocupação com:

- reaproveitamento de componentes
- separação entre domínio e UI
- persistência local simples
- suporte para mobile e web
- flexibilidade para novos sistemas de progressão, loja e hábitos

## Tecnologias Utilizadas

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)

## Arquitetura

O projeto segue uma organização modular.

### Estrutura principal

- [app](C:\Users\iivan\OneDrive\Documentos\Jogo\app): telas e entrada principal da aplicação
- [src/components](C:\Users\iivan\OneDrive\Documentos\Jogo\src\components): componentes visuais e blocos reutilizáveis da interface
- [src/domain](C:\Users\iivan\OneDrive\Documentos\Jogo\src\domain): regras de negócio, engine do jogo, reset, progressão e catálogo
- [src/providers](C:\Users\iivan\OneDrive\Documentos\Jogo\src\providers): estado global da aplicação
- [src/storage](C:\Users\iivan\OneDrive\Documentos\Jogo\src\storage): persistência local
- [src/services](C:\Users\iivan\OneDrive\Documentos\Jogo\src\services): integração com serviços, como notificações
- [src/hooks](C:\Users\iivan\OneDrive\Documentos\Jogo\src\hooks): cálculos derivados e utilidades de estado
- [assets](C:\Users\iivan\OneDrive\Documentos\Jogo\assets): imagens e artes das classes

### Organização conceitual

- `UI`: componentes e telas
- `Domain`: regras do jogo e da progressão
- `State`: gerenciamento centralizado do mundo do jogador
- `Storage`: persistência do progresso
- `Services`: recursos de plataforma

## Como Executar

### Requisitos

- Node.js instalado
- npm instalado

### Instalação

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm start
```

### Rodar na web

```bash
npm run web
```

### Gerar build web estática

```bash
npx expo export --platform web
```

O build web será gerado em:

[dist](C:\Users\iivan\OneDrive\Documentos\Jogo\dist)

### Verificação de tipos

```bash
npm run typecheck
```

## Como Usar

### Fluxo principal

1. abra o app
2. escolha uma classe
3. defina o nome do personagem
4. crie quests diárias ou semanais
5. conclua as tarefas ao longo do dia
6. ganhe `xp` e `gold`
7. acompanhe seu histórico
8. desbloqueie e equipe companheiros

### Tipos de missão diária

- `Principal`: pode gerar alerta e faz parte do núcleo da rotina
- `Secundária`: não gera alerta e é mais flexível
- `Opcional`: dá recompensa extra, mas não entra na cobrança das métricas diárias

### Loja

Atualmente a loja é focada em companheiros:

- todos os companheiros custam `1000 gold`
- o usuário pode comprar vários
- apenas um pode ficar equipado por vez

## Utilidade do Projeto

Habit Quest é útil para pessoas que:

- têm dificuldade de manter consistência em hábitos
- gostam de sistemas de progressão e recompensas
- preferem uma experiência mais lúdica do que apps tradicionais de tarefas
- querem transformar rotina em algo mais visual e motivador

## Estado Atual

O projeto já possui uma primeira versão funcional com:

- progressão de personagem
- tarefas configuráveis
- sistema de recompensas
- histórico
- onboarding
- versão web exportável
