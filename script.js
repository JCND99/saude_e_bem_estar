function salvarNome() {
    let nome = document.getElementById("nome").value;
    localStorage.setItem("nomeUsuario", nome);
    window.location.href = "dashboard.html";
}

window.onload = function () {
    corrigirDados();

    let nome = localStorage.getItem("nomeUsuario");

    if (nome && document.getElementById("saudacao")) {
        document.getElementById("saudacao").innerText = "Bom dia, " + nome + " 👋";
    }

    atualizarAgua();
    atualizarHabitos();
    fraseMotivacional();
};

/* FRASES */
function fraseMotivacional() {
    let frases = [
        "Pequenos passos todo dia geram grandes resultados.",
        "Você está indo muito bem, continue!",
        "Seu corpo agradece.",
        "Disciplina vence motivação.",
        "Hoje é um ótimo dia para treinar."
    ];

    let frase = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("motivacao").innerText = frase;
}

/* ÁGUA */
function addAgua() {
    let agua = localStorage.getItem("agua") || 0;
    agua = parseInt(agua) + 250;

    if (agua > 2000) agua = 2000;

    localStorage.setItem("agua", agua);
    atualizarAgua();
}

function removerAgua() {
    let agua = localStorage.getItem("agua") || 0;
    agua = parseInt(agua) - 250;

    if (agua < 0) agua = 0;

    localStorage.setItem("agua", agua);
    atualizarAgua();
}

function atualizarAgua() {
    let agua = localStorage.getItem("agua") || 0;
    let meta = 2000;

    let porcentagem = (agua / meta) * 100;

    document.getElementById("aguaTexto").innerText = agua + "ml / " + meta + "ml";
    document.getElementById("barraAgua").style.width = porcentagem + "%";
}

/* HÁBITOS COM CONTADOR */
function addHabito(tipo) {
    let valor = localStorage.getItem(tipo) || 0;
    valor = parseInt(valor) + 1;

    localStorage.setItem(tipo, valor);
    atualizarHabitos();
}

function removeHabito(tipo) {
    let valor = localStorage.getItem(tipo) || 0;
    valor = parseInt(valor) - 1;

    if (valor < 0) valor = 0;

    localStorage.setItem(tipo, valor);
    atualizarHabitos();
}

function atualizarHabitos() {
    let fruta = localStorage.getItem("fruta") || 0;
    let treino = localStorage.getItem("treino") || 0;
    let pos = localStorage.getItem("pos") || 0;

    document.getElementById("frutaQtd").innerText = fruta;
    document.getElementById("treinoQtd").innerText = treino;
    document.getElementById("posQtd").innerText = pos;
}

/* RESETAR DIA */
function resetarDia() {
    localStorage.setItem("agua", 0);
    localStorage.setItem("fruta", 0);
    localStorage.setItem("treino", 0);
    localStorage.setItem("pos", 0);

    atualizarAgua();
    atualizarHabitos();
}
function corrigirDados() {
    let habitos = ["fruta", "treino", "pos"];

    habitos.forEach(h => {
        let valor = localStorage.getItem(h);

        if (valor === "true") localStorage.setItem(h, 1);
        else if (valor === "false") localStorage.setItem(h, 0);
        else if (valor === null) localStorage.setItem(h, 0);
    });
}