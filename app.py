import math
from pathlib import Path

from flask import Flask, abort, jsonify, request, send_from_directory 

PASTA = Path(__file__).resolve().parent

# Só estes arquivos podem ser baixados pelo navegador (o app.py fica protegido)
ARQUIVOS_PERMITIDOS = {"index.html", "style.css", "script.js"}

OPERACOES = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b,
}

app = Flask(__name__)


# Permite que a página funcione também se for aberta por fora do Flask
# (por exemplo, com a extensão Live Server do VS Code)
@app.after_request
def liberar_cors(resposta):
    resposta.headers["Access-Control-Allow-Origin"] = "*"
    resposta.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resposta.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return resposta


# O Flask também entrega o front-end: abra http://127.0.0.1:5000
@app.get("/")
def inicio():
    return send_from_directory(PASTA, "index.html")


@app.get("/<nome>")
def arquivo(nome):
    if nome not in ARQUIVOS_PERMITIDOS:
        abort(404)
    return send_from_directory(PASTA, nome)


# Rota da calculadora: recebe {"a": 2, "b": 3, "operacao": "+"} e devolve {"resultado": 5}
@app.route("/calcular", methods=["POST", "OPTIONS"])
def calcular():
    if request.method == "OPTIONS":
        return "", 204

    dados = request.get_json(silent=True) or {}
    a = dados.get("a")
    b = dados.get("b")
    operacao = dados.get("operacao")

    numeros_validos = all(
        isinstance(n, (int, float)) and not isinstance(n, bool) for n in (a, b)
    )
    if not numeros_validos:
        return jsonify(erro="Envie números válidos em 'a' e 'b'."), 400

    if operacao not in OPERACOES:
        return jsonify(erro="Operação inválida. Use +, -, * ou /."), 400

    if operacao == "/" and b == 0:
        return jsonify(erro="Divisão por zero."), 400

    resultado = OPERACOES[operacao](a, b)

    if not math.isfinite(resultado):
        return jsonify(erro="Resultado grande demais."), 400

    return jsonify(resultado=round(resultado, 10))


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
