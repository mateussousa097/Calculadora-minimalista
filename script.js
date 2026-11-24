const visor = document.getElementById("visor");
const teclado = document.getElementById("teclado");

// Endereço do back-end em Flask (rode o app.py antes de usar a calculadora)
const API_URL = "http://127.0.0.1:5000/calcular";

let valorAtual = "0";   // o que aparece no visor
let valorAnterior = null;
let operadorAtual = null;
let novaEntrada = false; // true quando o próximo dígito deve substituir o visor
let ocupado = false;     // evita cliques enquanto espera a resposta do servidor

function atualizarVisor() {
  visor.textContent = valorAtual.replace("*", "×");
}

function mostrarErro(mensagem) {
  valorAtual = mensagem;
  valorAnterior = null;
  operadorAtual = null;
  novaEntrada = true;
}

function emErro() {
  return isNaN(parseFloat(valorAtual));
}

function inserirNumero(digito) {
  if (emErro() || novaEntrada || valorAtual === "0") {
    valorAtual = digito;
    novaEntrada = false;
  } else {
    valorAtual += digito;
  }
}

function inserirDecimal() {
  if (emErro() || novaEntrada) {
    valorAtual = "0.";
    novaEntrada = false;
  } else if (!valorAtual.includes(".")) {
    valorAtual += ".";
  }
}

async function escolherOperador(operador) {
  if (emErro()) return;
  // Encadeia contas: 2 + 3 + ... calcula o 2 + 3 antes de seguir
  if (operadorAtual && !novaEntrada) await calcular();
  if (emErro()) return;
  valorAnterior = parseFloat(valorAtual);
  operadorAtual = operador;
  novaEntrada = true;
}

// Envia a conta para o back-end e mostra o resultado
async function calcular() {
  if (operadorAtual === null || emErro()) return;

  const corpo = {
    a: valorAnterior,
    b: parseFloat(valorAtual),
    operacao: operadorAtual,
  };

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarErro("Erro");
      return;
    }

    valorAtual = String(dados.resultado);
    operadorAtual = null;
    valorAnterior = null;
    novaEntrada = true;
  } catch (erro) {
    // Servidor desligado ou inacessível
    mostrarErro("Sem servidor");
  }
}

function limpar() {
  valorAtual = "0";
  valorAnterior = null;
  operadorAtual = null;
  novaEntrada = false;
}

function apagar() {
  if (emErro() || novaEntrada) return;
  valorAtual = valorAtual.length > 1 ? valorAtual.slice(0, -1) : "0";
}

// Cliques nos botões
teclado.addEventListener("click", async (evento) => {
  const botao = evento.target.closest("button");
  if (!botao || ocupado) return;

  const { tipo, valor } = botao.dataset;
  ocupado = true;

  if (tipo === "numero") inserirNumero(valor);
  else if (tipo === "decimal") inserirDecimal();
  else if (tipo === "operador") await escolherOperador(valor);
  else if (tipo === "igual") await calcular();
  else if (tipo === "limpar") limpar();
  else if (tipo === "apagar") apagar();

  ocupado = false;
  atualizarVisor();
});

// Suporte ao teclado do computador
document.addEventListener("keydown", async (evento) => {
  if (ocupado) return;

  const tecla = evento.key;
  ocupado = true;

  if (/^[0-9]$/.test(tecla)) inserirNumero(tecla);
  else if (tecla === "." || tecla === ",") inserirDecimal();
  else if (["+", "-", "*", "/"].includes(tecla)) await escolherOperador(tecla);
  else if (tecla === "Enter" || tecla === "=") { evento.preventDefault(); await calcular(); }
  else if (tecla === "Backspace") apagar();
  else if (tecla === "Escape") limpar();
  else { ocupado = false; return; }

  ocupado = false;
  atualizarVisor();
});
