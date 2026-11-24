Calculadora Minimalista

Calculadora web simples com as quatro operações básicas (soma, subtração, multiplicação e divisão), desenhada apenas com linhas de contorno: traço grosso na borda externa e traços finos separando o visor, os números e as operações. O front-end é feito com HTML, CSS e JavaScript, e as contas são calculadas por um back-end em Python (Flask).

Projeto de estudo para praticar a comunicação entre front-end e back-end.

Funcionalidades
Soma, subtração, multiplicação e divisão
Números decimais
Botão C para limpar tudo e ⌫ para apagar o último dígito
Operações encadeadas (por exemplo, 2 + 3 × 4, calculadas na ordem em que são digitadas)
Suporte ao teclado do computador (números, + - * /, Enter, Backspace e Esc)
Tratamento de erros, como divisão por zero e servidor desligado
Layout centralizado na tela
Tecnologias
HTML5
CSS3
JavaScript (sem bibliotecas)
Python 3 com Flask
Estrutura do projeto
Calculadora/
├── index.html         # estrutura da página
├── style.css          # visual da calculadora
├── script.js          # lógica do front-end e comunicação com o servidor
├── app.py             # servidor Flask e rota de cálculo
└── requirements.txt   # dependências do Python
Descrição do código
HTML (index.html)

Define a estrutura da página em três partes: um contêiner principal (.calculadora), o visor (#visor), que mostra o número digitado ou o resultado, e o teclado (#teclado), com os botões. Cada botão recebe atributos data-tipo (número, operador, igual, decimal, limpar ou apagar) e data-valor (o dígito ou o símbolo da operação), que o JavaScript usa para saber o que fazer quando o botão é clicado.

CSS (style.css)

Cuida de todo o visual, que usa apenas contornos, sem preenchimento. As cores e as espessuras das linhas ficam em variáveis no início do arquivo (--cor-linha, --cor-fundo, --linha-grossa e --linha-fina), o que facilita personalizar o estilo. A calculadora é centralizada na tela com Flexbox, a borda externa tem 4px, e o teclado é uma grade (CSS Grid) de quatro colunas em que cada botão desenha um traço fino de 1px no topo e à esquerda, formando as divisões internas. Os botões têm efeito ao passar o mouse e ao clicar, o = ocupa duas linhas e o 0 ocupa duas colunas.

JavaScript (script.js)

Controla o comportamento da calculadora. Guarda o estado (valor no visor, valor anterior, operação escolhida) e tem funções para inserir números e decimais, escolher a operação, limpar e apagar. Os cliques são tratados por um único ouvinte de eventos no teclado (delegação de eventos), e as teclas físicas também são aceitas. Ao pressionar =, o script envia os dois números e a operação ao servidor com fetch (método POST, formato JSON) e mostra o resultado recebido no visor. Se ocorrer um problema, o visor mostra "Erro" (por exemplo, divisão por zero) ou "Sem servidor" (back-end desligado). Uma trava impede novos cliques enquanto o servidor ainda não respondeu.

Python (app.py)

Servidor Flask com duas funções: entregar os arquivos da página (index.html, style.css e script.js) e oferecer a rota POST /calcular, que recebe {"a": 2, "b": 3, "operacao": "+"} e devolve {"resultado": 5}. A rota valida os dados recebidos, recusa operações inválidas e divisão por zero, e arredonda o resultado para evitar números como 0.30000000000000004.

Como executar

Pré-requisito: Python 3 instalado.

bash
# 1. instalar a dependência
python -m pip install -r requirements.txt

# 2. ligar o servidor
python app.py

Depois, abra no navegador o endereço completo, com http://:

http://127.0.0.1:5000

Mantenha o terminal aberto enquanto usa a calculadora. Para desligar o servidor, aperte Ctrl + C.
