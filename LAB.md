# Laboratório Prático: Testes de UI com VS Code, GitHub Copilot & Playwright (TypeScript)

Bem-vindo a este laboratório autodirigido! Neste tutorial, você aprenderá como configurar o **Visual Studio Code**, **habilitar o GitHub Copilot** e **usar o Playwright (com o servidor MCP)** para compor e executar testes de UI end-to-end em **TypeScript**.

Vamos passo a passo escrever testes para o site de relações com investidores da COPASA (<https://ri.copasa.com.br/>) – perfeito para iniciantes no GitHub Copilot e Playwright.

Ao longo do caminho, abordaremos a configuração, escrita e execução de testes (com a ajuda do Copilot), e até uma visão avançada do uso do servidor MCP do Playwright com o modo agente do Copilot.

Por fim, incluímos melhores práticas e dicas de solução de problemas para garantir uma experiência tranquila.

## 1. Pré-requisitos e Configuração do Ambiente

Antes de começarmos a escrever testes, certifique-se de que seu ambiente está preparado com o seguinte:

- **Node.js (v18 ou superior):** O Playwright (e o servidor MCP) requerem Node.js 18+. Você pode baixar o Node no site oficial. Verifique a instalação executando node -v em um terminal. (A saída de exemplo deve mostrar 18.x ou mais recente.)
- **npm:** Vem incluído com o Node.js. Verifique executando npm -v.
- **Visual Studio Code:** Nosso editor de código preferido. Certifique-se de ter a versão mais recente do VS Code instalada. Este laboratório pressupõe que você está usando o VS Code para toda codificação, terminal e interações com o Copilot. [Como Instalar o Visual Studio Code]
- **Acesso ao GitHub Copilot:** Você precisará de uma conta GitHub com uma assinatura ativa do Copilot ou período de teste (Copilot é um assistente de codificação de IA pago). Se você ainda não tem, inscreva-se no GitHub Copilot (há um período de teste gratuito disponível para novos usuários).

**Instalar a extensão GitHub Copilot no VS Code:** Se você ainda não a instalou, abra o VS Code e vá para a visualização de Extensões (clique no ícone de Extensões à esquerda ou pressione `Ctrl+Shift+X`). Procure por **"GitHub Copilot"** e clique em Instalar na extensão oficial. Após a instalação, você será solicitado a fazer login no GitHub para autorizar o Copilot. Siga as solicitações de login e autorize o VS Code com sua conta GitHub. Uma vez conectado, o VS Code indicará que o GitHub Copilot está ativo (você deve ver o ícone do Copilot na barra de status inferior).

> **Nota:** Por padrão, instalar a extensão Copilot no VS Code também instala a extensão Copilot Chat (para a interface de chat). Neste laboratório, usaremos principalmente as sugestões inline do Copilot, mas ter o Copilot Chat é útil para fazer perguntas ou usar o novo modo agente posteriormente.

**Verificar se o Copilot está funcionando:** Abra um novo arquivo no VS Code (por exemplo, um arquivo JavaScript ou TypeScript simples) e comece a digitar um comentário como `// esta função retornará a soma de dois números`. Após um momento, o GitHub Copilot deve sugerir uma conclusão de código (texto acinzentado) com base no comentário. Se você ver sugestões, o Copilot está configurado corretamente! Caso contrário, certifique-se de estar conectado e de que sua assinatura está ativa.

## 2. Configurando o Projeto e Instalando o Playwright

A seguir, vamos configurar um novo projeto para nossos testes do Playwright.

1. **Criar uma pasta de projeto:** Escolha um diretório em sua máquina e crie uma nova pasta (por exemplo, `copasa-playwright-lab`). Abra esta pasta no Visual Studio Code (Arquivo > Abrir Pasta).

2. **Inicializar um projeto Node.js:** No VS Code, abra um terminal (**Ctrl+`** ou via Terminal > Novo Terminal). Execute o seguinte comando para inicializar um projeto Node.js com um arquivo package.json padrão:

    ```bash
    npm init -y
    ```

    Isso criará um package.json com configurações padrão (você pode abri-lo para confirmar).

3. **Instalar o Playwright (Test):** Agora instale o executor de testes do Playwright como uma dependência de desenvolvimento. Usaremos a versão TypeScript do Playwright Test:

    ```bash
    npm install -D @playwright/test
    ```

    Isso baixa o framework Playwright.

4. **Instalar navegadores do Playwright:** O Playwright automatiza navegadores web reais (Chromium, Firefox, WebKit). Após instalar o pacote, você precisa baixar os binários do navegador. Execute:

    ```bash
    npx playwright install
    ```

    Isso baixará os navegadores (Chromium, Firefox, WebKit) para serem usados pelo Playwright. Você deve ver uma saída indicando a instalação dos navegadores. (Por padrão, o Playwright instalará os três motores de navegador.)

    Após essas etapas, sua pasta de projeto deve conter node_modules, um package-lock.json e o package.json com @playwright/test listado como uma dependência de desenvolvimento.

5. **(Opcional) Configurar TypeScript:** O Playwright pode executar testes escritos em TypeScript imediatamente, portanto, um arquivo de configuração do compilador TypeScript não é estritamente necessário para nosso projeto simples. O Playwright transpilará seus testes .ts em tempo de execução. No entanto, se você quiser que o VS Code reconheça completamente o TypeScript, você pode inicializar um tsconfig:

    ```bash
    npx tsc --init
    ```

    Isso cria um **tsconfig.json** padrão. Você pode definir "target": "ES2020" e "module": "commonjs" (ou deixar os padrões). Esta etapa é opcional — o Playwright executará os testes mesmo se o TypeScript não for compilado manualmente.

Seu ambiente agora está pronto com Node.js, VS Code, Copilot e Playwright instalados.

**Estrutura do projeto até agora:**

```text
copasa-playwright-lab/
├─ package.json
├─ package-lock.json
├─ tsconfig.json        (se você executou tsc --init)
└─ node_modules/        (contém o Playwright e suas dependências)
```

## 3. Escrevendo Seu Primeiro Teste Playwright (com a Ajuda do Copilot)

Vamos começar escrevendo um teste simples para a página inicial da COPASA. O teste carregará a página inicial e verificará se o título da página contém "COPASA". Vamos criar nosso primeiro arquivo de teste e usar o GitHub Copilot para acelerar a codificação.

**Passo 3.1: Criar um arquivo de teste**. Na pasta do projeto, crie um novo diretório chamado **tests** (o Playwright por padrão procura por testes em um diretório `tests/`). Dentro dele, crie um arquivo chamado `copasa.spec.ts`. (A extensão `.spec.ts` é convencional para arquivos de teste.)

Abra `copasa.spec.ts` no VS Code.

**Passo 3.2: Importar utilitários de teste do Playwright**. Comece escrevendo a linha de importação para as funções de teste do Playwright no topo do arquivo:

```typescript
import { test, expect } from '@playwright/test';
```

Isso importa a função test para definir um caso de teste e a biblioteca de asserção expect para verificações.

> *Dica*: Conforme você começar a digitar a importação, o Copilot pode tê-la completado automaticamente para você. Caso contrário, simplesmente digite ou aceite a sugestão quando ela aparecer.

**Passo 3.3: Escrever um teste para verificar o título da página inicial.** Usaremos a função `test()` para definir um teste. Digite o seguinte esboço de teste no arquivo:

```typescript
test('Página inicial da COPASA tem o título correto', async ({ page }) => {
  // TODO: ir para a página inicial da COPASA e verificar o título
});
```

Algumas observações:

A string `'Página inicial da COPASA tem o título correto'` é um nome legível para o teste.
A função assíncrona recebe um objeto `{ page }` do Playwright, que representa uma página do navegador (isso é fornecido através do fixture do Playwright).
Dentro da função, deixamos um comentário `// TODO`. Vamos deixar o Copilot nos ajudar a preenchê-lo.

Agora, **use o GitHub Copilot para completar as etapas do teste**. Coloque seu cursor após o `// TODO` (ou inicie uma nova linha abaixo dele) e **escreva um comentário ou prompt** descrevendo o que você quer fazer. Por exemplo:

```typescript
    // Navegar para a página inicial da COPASA e verificar se o título contém "COPASA"
```

Assim que você terminar de digitar este comentário (e pausar um momento), o Copilot deve sugerir o código para executar essa ação. Aceite a sugestão (pressione Tab ou clique nela) se parecer correta. O Copilot provavelmente produzirá algo como:

```typescript
  await page.goto('https://ri.copasa.com.br/');
```

Isso é exatamente o que precisamos:

- `page.goto('https://ri.copasa.com.br/')` instrui o Playwright a abrir o navegador e navegar para a página inicial de relações com investidores da COPASA.
- `expect(page).toHaveTitle(/COPASA/)` afirma que o título da página contém a palavra "COPASA" (usando uma regex). Isso aguardará automaticamente até que o título esteja disponível.

Seu primeiro teste está completo! Para referência, o arquivo `copasa.spec.ts` deve agora ficar assim:

```typescript
import { test, expect } from '@playwright/test';

test('Página inicial da COPASA tem o título correto', async ({ page }) => {
  await page.goto('https://ri.copasa.com.br/');
  await expect(page).toHaveTitle(/COPASA/);
});
```

> Se o Copilot não gerou automaticamente o código, sem problemas – você pode digitar manualmente as duas linhas acima. Elas são diretas e realizam as ações necessárias.

## 4. Escrevendo um Segundo Teste: Navegando pelo Site

Para um teste mais interativo, vamos adicionar outro cenário: clicar no link de informações financeiras no site da COPASA e verificar se a página carrega corretamente (por exemplo, verificando seu título ou conteúdo).

**Passo 4.1: Adicionar um novo caso de teste no mesmo arquivo.** Abaixo do primeiro teste, comece a escrever um novo bloco `test(...)`:

```typescript
test('Navegar para página de informações financeiras', async ({ page }) => {
  // TODO: ir para a página inicial, clicar no link de informações e verificar a página
});
```

Novamente, use o Copilot para preencher as etapas. Você pode escrever um comentário como `// clicar no link de informações financeiras` e ver o que o Copilot sugere. Se o Copilot não sugerir automaticamente, tente digitar a primeira ação você mesmo e ele pode completar o resto. Por exemplo:

- Comece indo para a página inicial (sabemos isso do teste anterior):

    ```typescript
    await page.goto('https://ri.copasa.com.br/');
    ```

    O Copilot pode até sugerir esta linha quando você começar a digitar `await page.goto('https://ri.copasa.com.br/');`

- Em seguida, precisamos clicar em um link de navegação relevante. Existem algumas maneiras no Playwright de selecionar um elemento:
    - Clicar por texto visível: `await page.click('text=Informações Financeiras');`
    - Usar os seletores de função integrados do Playwright (nome acessível): `await page.getByRole('link', { name: 'Informações Financeiras' }).click();`
    - Ou usar um seletor CSS/XPath se soubermos um (não é necessário aqui, pois o texto é mais simples).

    Vamos usar o seletor de texto para simplicidade. Digite uma linha como:

    ```typescript
    await page.click('text=Informações Financeiras');
    ```

    O Copilot pode completá-lo automaticamente quando você digitar `'text=Informações Financeiras'`. Isso encontrará qualquer elemento com o texto visível "Informações Financeiras" e clicará nele. (Isso deve clicar no item de menu de informações na página inicial.)

- Após clicar, o Playwright deve navegar para a página correspondente. Queremos verificar se chegamos à página certa. Uma verificação fácil é o título da página ou URL. Podemos afirmar que a URL contém parte do caminho esperado:

    ```typescript
    await expect(page).toHaveURL(/informacoes/);
    ```

    Alternativamente, podemos verificar o título da página:

    ```typescript
    await expect(page).toHaveTitle(/Informações/);
    ```

Juntando tudo, o segundo teste pode ficar assim (com a ajuda do Copilot ou digitação manual):

```typescript
test('Navegar para página de informações financeiras', async ({ page }) => {
  await page.goto('https://ri.copasa.com.br/');
  await page.click('text=Informações Financeiras');
  await expect(page).toHaveURL(/informacoes/);
});
```

Agora nosso arquivo `copasa.spec.ts` tem dois testes. Para maior clareza, aqui está o conteúdo completo do arquivo:

```typescript
import { test, expect } from '@playwright/test';

test('Página inicial da COPASA tem o título correto', async ({ page }) => {
  await page.goto('https://ri.copasa.com.br/');
  await expect(page).toHaveTitle(/COPASA/);
});

test('Navegar para página de informações financeiras', async ({ page }) => {
  await page.goto('https://ri.copasa.com.br/');
  await page.click('text=Informações Financeiras');
  await expect(page).toHaveURL(/informacoes/);
});
```

Cada `test(...)` é independente – o Playwright lançará um novo contexto de navegador para cada um, então o segundo teste não depende dos efeitos colaterais do primeiro. Navegamos para a página inicial em ambos os testes para ser explícito e manter os testes autocontidos.

**Uma nota sobre o Copilot:** Se você achou as sugestões do Copilot úteis aqui, ótimo! Se ele fez uma sugestão incorreta (por exemplo, clicando em um seletor errado), tudo bem. Parte do aprendizado do Copilot é guiá-lo com bons comentários ou editar o código que ele fornece. No nosso caso, guiamos com comentários claros e obtivemos o código necessário. Quando o Copilot sugeriu o código, ainda nos certificamos de que fazia sentido (sempre revise o código sugerido pela IA!).

Agora, vamos executar nossos testes e vê-los em ação.

## 5. Executando os Testes

Temos dois casos de teste prontos. O Playwright fornece um executor de testes que lançará navegadores, executará testes e reportará resultados. Existem algumas maneiras de executar os testes:

**Opção A: Executar testes via linha de comando**. No seu terminal do VS Code, execute:

```bash
npx playwright test
```

Este comando encontrará os testes (ele procura no diretório tests por padrão) e os executará. Por padrão, executa testes em modo headless (navegadores não visíveis) em todos os três navegadores (Chromium, Firefox, WebKit) se não for especificado o contrário.

Você deve ver uma saída no terminal indicando que os testes estão sendo executados e depois os resultados. Por exemplo, pode mostrar algo como:

```text
Running 2 tests using 1 worker
[chromium] › ✔  copasa.spec.ts:3:1 › Página inicial da COPASA tem o título correto (PASSED)
[chromium] › ✔  copasa.spec.ts:9:1 › Navegar para página de informações financeiras (PASSED)
```

Seguido por estatísticas resumidas (2 aprovados, 0 reprovados). Parabéns, ambos os testes devem passar! 🎉

Se algo falhar, leia a mensagem de erro para ver qual asserção falhou ou qual etapa. Problemas comuns podem ser um timeout de navegação se o site estava lento, ou um seletor falhando se o texto "Informações Financeiras" não foi encontrado (certifique-se de que a ortografia corresponde exatamente). No nosso caso, a página inicial da COPASA deve ter um link para informações, então deve funcionar.

**Executar em modo headed (opcional):** Muitas vezes é útil (e divertido) assistir ao navegador enquanto os testes são executados. Para iniciar o navegador visualmente, adicione a flag `--headed`:

```bash
npx playwright test --headed
```

Agora o Playwright abrirá uma janela real do navegador para cada teste, permitindo que você veja as interações (você verá navegar para o site e clicar no link). Isso é ótimo para depuração ou aprender o que o teste está fazendo.

**Opção B: Executar testes via interface do VS Code (opcional):** Se preferir, você pode instalar a extensão **Playwright Test for VSCode**, que fornece uma interface para executar testes e ver resultados dentro do VS Code. Alternativamente, o Playwright tem um modo de interface integrado: execute:

```bash
npx playwright test --ui
```

Isso abre um painel interativo no seu navegador onde você pode executar testes individuais, ver relatórios, etc. Isso é opcional, mas pode ser útil à medida que você desenvolve mais testes.

> Ao começar, tente executar em modo --headed para assistir às interações do navegador. Isso ajuda a verificar se cliques e navegações estão acontecendo como esperado. Uma vez que as coisas funcionem, você pode executar em modo headless para velocidade.

Assumindo que ambos os testes passaram, você escreveu e executou com sucesso testes de UI com o Playwright! 🙌 Agora, vamos dar um passo adiante e ver como o GitHub Copilot e o **servidor MCP do Playwright** podem fazer ainda mais por nós.

## 6. (Avançado) Usando o Servidor MCP do Playwright com o Modo Agente do Copilot

> Esta seção é opcional, mas altamente recomendada para entender a integração de ponta entre Copilot e Playwright.

O GitHub Copilot agora tem um **modo agente** que pode usar ferramentas externas via Model Context Protocol (MCP). O **servidor MCP do Playwright** é uma dessas ferramentas que permite ao Copilot controlar um navegador usando o Playwright. Em termos mais simples, isso significa que o Copilot pode `executar ações no navegador` (clicar, navegar, etc.) como parte de seu raciocínio, em vez de apenas sugerir código. Isso pode ajudar a gerar testes ou depurar problemas explorando realmente o site.

**6.1 Instalando/Habilitando o servidor MCP do Playwright no VS Code:**

- No VS Code, abra a Paleta de Comandos (`Ctrl+Shift+P`) e procure por "**MCP: Add new server**" ou "**Add MCP server**". Se a extensão GitHub Copilot estiver atualizada, você deve encontrar uma opção para instalar ou adicionar uma configuração de servidor MCP. Escolha isso e, quando solicitado, selecione o **servidor MCP do Playwright** (algumas configurações podem listá-lo por nome). Este processo deve atualizar automaticamente as configurações do VS Code para incluir a configuração do servidor MCP do Playwright. Por baixo dos panos, é equivalente a adicionar o seguinte às suas configurações `mcp.json`:

    ```json
        "servers": {
            "microsoft/playwright-mcp": {
                "type": "stdio",
                "command": "npx",
                "args": [
                    "@playwright/mcp@latest"
                ]                
            }
        }
    ```

    (Isso diz ao VS Code para usar o npx para iniciar o servidor MCP do Playwright mais recente. O VS Code cuidará de iniciá-lo/pará-lo.)

    Se não for feito automaticamente, você pode adicionar manualmente o JSON acima às suas configurações do VS Code (preferências → abrir configurações JSON). Salve as configurações após adicionar.

- **Método alternativo:** Versões mais recentes da extensão Copilot têm uma guia **Agents** ou um botão como "Install Server" no painel do Copilot Chat. Clicar nisso e selecionar Playwright alcançará o mesmo resultado, atualizando suas configurações e instalando a ferramenta do servidor.
- **Verificar se o servidor MCP está configurado:** Execute o comando "`MCP: List Servers`" na Paleta de Comandos. Você deve ver "playwright" listado como um servidor disponível. Você pode selecioná-lo e escolher Iniciar se ainda não estiver em execução. (O VS Code pode iniciar automaticamente o servidor MCP quando necessário, mas é bom saber que você pode controlá-lo manualmente.)

**6.2 Usando o Copilot no Modo Agente:**

Agora que o servidor MCP do Playwright está configurado, podemos usar o modo agente do Copilot no VS Code para interagir com o navegador via linguagem natural.

- Abra a visualização `GitHub Copilot Chat` no VS Code (clique no ícone do Copilot na barra lateral ou use o atalho se habilitado). No topo do painel de chat, você verá um seletor de modo (pode dizer "Ask" por padrão). Clique nele e mude para o modo `Agent`. Este modo permite que o Copilot use ferramentas – no nosso caso, o MCP do Playwright – para agir em suas solicitações.

- Ao lado da entrada de prompt, pode haver um botão "Tools" ou "Plugins" onde você pode gerenciar quais ferramentas o agente pode usar. Certifique-se de que a ferramenta Playwright (provavelmente listada como "playwright" ou ações específicas como navegar, clicar, etc.) está `habilitada`. Você pode não precisar ajustar isso se for o único servidor, mas é bom verificar. O agente do Copilot pode executar muitas ações expostas pelo MCP do Playwright, como `browser_navigate`, `browser_click`, `browser_type`, etc., com base no que o servidor fornece.

- **Dê uma tarefa ao agente:** Agora você pode simplesmente **pedir ao Copilot para executar ações web ou até gerar testes**. Por exemplo, tente digitar:

    ```text
    Navegue até https://ri.copasa.com.br/ e liste o texto do menu de navegação principal.
    ```

    Quando você enviar isso, o Copilot (no modo agente) decidirá que precisa usar o navegador. Provavelmente responderá pedindo permissão para executar uma ferramenta (por segurança, na primeira vez que executar) – por exemplo, pode dizer que quer executar um comando browser_navigate para abrir a URL. Conceda permissão, e ele usará o Playwright para abrir a página inicial da COPASA em segundo plano (headless). Então pode usar outra ferramenta para ler elementos na página (via árvore de acessibilidade) e retornar a lista de itens do menu. Isso é o Copilot realmente controlando uma sessão do navegador através do MCP do Playwright!

    Da mesma forma, você pode pedir ao agente para clicar em algo:

    ```text
    Clique no link "Informações Financeiras".
    ```

    Ele novamente escolherá uma ação `browser_click` em um elemento chamado "Informações Financeiras". Depois de executar o clique, você pode perguntar:

    ```text
    Qual é o título da página agora?
    ```

    O agente pode então buscar o título da página atual (que agora deve ser a página de informações) e responder com ele, confirmando que a navegação foi bem-sucedida.

- **Gerando um teste via agente (opcional):** Um dos usos poderosos dessa configuração é fazer o Copilot gerar código de teste após explorar. Você pode tentar um prompt como:

    ```text
    Gere um teste Playwright em TypeScript que navegue para ri.copasa.com.br, clique no link "Informações Financeiras" e verifique se a URL contém "informacoes".
    ```

    Como essencialmente fizemos isso manualmente, o agente Copilot pode repetir essas etapas: navegará, clicará, verificará usando o servidor MCP (como acima), e então **produzirá um trecho de código** como resposta. Em casos ideais, ele produzirá uma função de teste similar ao que escrevemos (usando `await page.goto(...)`, etc.). Você pode então copiar esse código para seu arquivo de teste. Isso demonstra como um agente de IA pode *gerar autonomamente um teste experimentando primeiro as interações* – muito útil para cenários de teste de caixa preta.

Tenha em mente que o modo agente do Copilot é um recurso relativamente novo. Pode às vezes tomar abordagens diferentes ou exigir prompts cuidadosamente formulados. A chave é que o servidor MCP do Playwright lhe dá as "mãos" para manipular o navegador, e ele pode usar isso para ajudá-lo a escrever ou depurar testes de maneiras que sugestões de código estático sozinhas não podem.

Quando terminar de experimentar, você pode parar o servidor MCP (via "MCP: List Servers" -> Stop) ou simplesmente fechar o VS Code. O servidor MCP é executado localmente e apenas enquanto o VS Code está aberto/ativo.

## Resumo

Neste laboratório prático, cobrimos toda a jornada de configuração e uso do Visual Studio Code, GitHub Copilot e Playwright (com o servidor MCP) para testes de UI:

- Configuramos nosso ambiente com Node.js e VS Code, e instalamos o GitHub Copilot para auxiliar na codificação.
- Inicializamos um projeto e instalamos o Playwright, incluindo seus navegadores.
- Usando TypeScript, escrevemos dois testes simples do Playwright para o site de relações com investidores da COPASA – um para verificar o título da página inicial, e um para navegar até a página de informações financeiras. O GitHub Copilot ajudou a gerar o código baseado em nossos comentários e prompts, tornando o processo mais rápido e demonstrando como a IA pode auxiliar na escrita de automação de testes.
- Executamos os testes usando o executor do Playwright, tanto em modo headless quanto em modo headed para ver a ação do navegador, garantindo que os testes se comportassem como esperado.
- Então exploramos o modo agente avançado do Copilot com o servidor MCP do Playwright, que permite ao Copilot não apenas sugerir código, mas realmente controlar um navegador para executar tarefas. Isso nos permitiu pedir ao Copilot em linguagem natural para interagir com o site da COPASA e até gerar código de teste automaticamente, demonstrando um vislumbre do futuro dos testes assistidos por IA.
- Finalmente, passamos por melhores práticas (como revisar sugestões de IA, escrever testes independentes, usar recursos robustos do Playwright) e dicas de solução de problemas para problemas comuns (problemas de configuração do Copilot, problemas de instalação do Playwright, etc.), para que você possa resolvê-los e continuar seus testes sem problemas.

Agora você deve ter um projeto de teste funcional e uma compreensão de como escrever testes do Playwright com alguma ajuda de IA. A partir daqui, você pode expandir seu conjunto de testes para cobrir mais do site da COPASA ou qualquer outra aplicação web. Tente testar envios de formulários, fluxos de navegação, ou use o Copilot para gerar um teste para um cenário diferente no site. Cada vez, você ficará mais confortável com as ferramentas.

**Bons testes e boa codificação com o Copilot!** A combinação da poderosa automação do Playwright e as sugestões de IA do Copilot pode tornar a escrita de testes mais rápida e até divertida. Boa sorte em sua jornada de automação de QA! 🚀
