/**
 * Função para gerar uma chave única baseada na data de hoje.
 * Uso isso para salvar os dados do dia no LocalStorage
 * sem misturar com os outros dias.
 */
const getDataChave = () => {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
};


/**
 * Pega o nome e o peso digitados na tela inicial,
 * verifica se não estão vazios e salva no navegador.
 * Depois disso manda o usuário para o dashboard.
 */
function configurarPerfil() {
    const nomeInput = document.getElementById("nome");
    const pesoInput = document.getElementById("peso");

    // Evita erro caso algum campo não exista na página
    if (!nomeInput || !pesoInput) return;

    const nomeValue = nomeInput.value.trim();
    const pesoValue = pesoInput.value;

    if (nomeValue !== "" && pesoValue !== "") {
        // Salva os dados do usuário no LocalStorage
        localStorage.setItem("nomeUsuario", nomeValue);
        localStorage.setItem("pesoUsuario", pesoValue);
        
        // Vai para a página principal
        window.location.href = "dashboard.html";
    } else {
        alert("Atenção: Por favor, preencha o seu nome e o seu peso para continuar.");
    }
}

/* ==========================================================================
   LOCALSTORAGE - SALVAR E CARREGAR DADOS
   ========================================================================== */

/**
 * Tenta pegar os dados já salvos do dia.
 * Se ainda não existir nada, cria um objeto com tudo zerado.
 */
function obterDadosDia(data) {
    const registro = localStorage.getItem(`dados_${data}`);
    
    if (registro) {
        return JSON.parse(registro);
    } else {
        // Estrutura padrão quando é o primeiro acesso do dia
        return { 
            agua: 0, 
            fruta: 0, 
            treino: 0, 
            cafe: 0 
        };
    }
}

/**
 * Salva os dados do dia no LocalStorage.
 * Converte o objeto para JSON antes de salvar.
 */
function salvarDadosDia(data, objeto) {
    const stringDados = JSON.stringify(objeto);
    localStorage.setItem(`dados_${data}`, stringDados);
}

/**
 * Esse código roda quando a página termina de carregar.
 * Aqui eu verifico em qual página o usuário está
 * e inicializo as coisas necessárias.
 */
window.onload = function () {
    const saudacaoElemento = document.getElementById("saudacao");
    const historicoContainer = document.getElementById("listaHistorico");

    // Se existir o elemento de saudação, então estamos no dashboard
    if (saudacaoElemento) {
        // Pega o nome salvo ou usa "Usuário" se não existir
        const nomeSalvo = localStorage.getItem("nomeUsuario");
        const nomeExibicao = nomeSalvo ? nomeSalvo : "Usuário";
        
        saudacaoElemento.innerText = `Olá, ${nomeExibicao} 👋`;
        
        // Atualiza a tela e mostra dica
        exibirDica();
        atualizarInterface();
        
        // Troca a dica a cada 5 segundos
        setInterval(function() {
            exibirDica();
        }, 5000);
    }

    // Se existir o container do histórico, estamos na página de histórico
    if (historicoContainer) {
        renderizarHistorico();
    }
};

/* ==========================================================================
   CONTROLE DOS HÁBITOS
   ========================================================================== */

/**
 * Altera a quantidade de algum hábito (água, fruta, treino, café).
 * Pode somar ou subtrair dependendo do valor enviado.
 */
function alterarHabito(tipo, valor) {
    const dataAtual = getDataChave();
    const dados = obterDadosDia(dataAtual);
    
    // Calcula o novo valor
    let novoValor = (dados[tipo] || 0) + valor;
    
    // Não deixa o valor ficar negativo
    if (novoValor < 0) {
        novoValor = 0;
    }
    
    // Salva novamente
    dados[tipo] = novoValor;
    salvarDadosDia(dataAtual, dados);
    
    // Atualiza a tela
    atualizarInterface();
}

/**
 * Atualiza todos os valores mostrados na tela
 * baseado nos dados salvos no LocalStorage.
 */
function atualizarInterface() {
    const dataAtual = getDataChave();
    const dados = obterDadosDia(dataAtual);
    
    /* 
       Meta de água baseada no peso
       Regra: peso * 35ml
    */
    const pesoSalvo = localStorage.getItem("pesoUsuario");
    const pesoDinamico = pesoSalvo ? parseFloat(pesoSalvo) : 70;
    const metaCalculada = Math.round(pesoDinamico * 35);

    // Elementos da interface
    const txtAgua = document.getElementById("aguaTexto");
    const barraAgua = document.getElementById("barraAgua");
    const txtFruta = document.getElementById("frutaQtd");
    const txtTreino = document.getElementById("treinoQtd");
    const txtCafe = document.getElementById("cafeQtd");

    // Atualiza barra de água
    if (txtAgua && barraAgua) {
        txtAgua.innerText = `${dados.agua}ml / ${metaCalculada}ml`;
        
        let percentagem = (dados.agua / metaCalculada) * 100;
        
        // Não deixa passar de 100%
        if (percentagem > 100) {
            percentagem = 100;
        }
        
        barraAgua.style.width = `${percentagem}%`;
    }

    if (txtFruta) {
        txtFruta.innerText = dados.fruta;
    }
    
    if (txtTreino) {
        txtTreino.innerText = dados.treino;
    }
    
    if (txtCafe) {
        txtCafe.innerText = dados.cafe;
    }
}

/* ==========================================================================
   DICAS DE SAÚDE
   ========================================================================== */

/**
 * Escolhe uma dica aleatória da lista
 * e mostra na tela para o usuário.
 */
function exibirDica() {
    const listaDeDicas = [
        "🍎 Coma uma fruta cítrica após o almoço para melhorar a digestão.",
        "🏃 O exercício físico liberta endorfinas que reduzem o stress.",
        "💧 Beber água mantém a concentração e evita dores de cabeça.",
        "😴 Dormir bem é essencial para a recuperação dos tecidos musculares.",
        "☕ O excesso de café pode causar ansiedade, consuma com moderação.",
        "🥗 Tente variar as cores dos vegetais no seu prato diariamente.",
        "🚶 Uma caminhada de 10 minutos após comer ajuda no metabolismo.",
        "🧘 Pratique 5 minutos de respiração profunda para acalmar a mente.",
        "🍌 O potássio da banana ajuda a evitar cãibras durante o treino.",
        "🍵 Chás naturais sem açúcar são ótimos para manter a hidratação."
    ];
    
    const elementoTextoDica = document.getElementById("dicaAlimentacao");
    
    if (elementoTextoDica) {
        const indiceAleatorio = Math.floor(Math.random() * listaDeDicas.length);
        const dicaEscolhida = listaDeDicas[indiceAleatorio];
        
        // Atualiza o texto da dica
        elementoTextoDica.innerText = dicaEscolhida;
    }
}

/* ==========================================================================
   HISTÓRICO
   ========================================================================== */

/**
 * Lê todos os dados antigos salvos
 * e cria os cards de histórico na tela.
 */
function renderizarHistorico() {
    const listaElemento = document.getElementById("listaHistorico");
    if (!listaElemento) return;

    // Pega todas as chaves do LocalStorage
    const todasAsChaves = Object.keys(localStorage);
    
    // Filtra apenas os registros de dados
    const chavesDados = todasAsChaves
        .filter(chave => chave.startsWith("dados_"))
        .sort()
        .reverse();

    // Caso não tenha histórico
    if (chavesDados.length === 0) {
        listaElemento.innerHTML = `
            <div style="text-align:center; padding:20px; color: #888;">
                <p>Ainda não tens nenhum dia registado no histórico.</p>
            </div>
        `;
        return;
    }

    listaElemento.innerHTML = "";

    // Cria um card para cada dia salvo
    chavesDados.forEach(chave => {
        const dataFormatada = chave.replace("dados_", "");
        const informacao = JSON.parse(localStorage.getItem(chave));
        
        const cardHistorico = document.createElement("div");
        cardHistorico.className = "card-hist";
        
        cardHistorico.innerHTML = `
            <strong>📅 Registro de: ${dataFormatada}</strong>
            <p>💧 Hidratação Total: ${informacao.agua}ml</p>
            <p>🍎 Frutas: ${informacao.fruta} un | 🏃 Exercícios: ${informacao.treino} sessões</p>
            <p>☕ Consumo de Café: ${informacao.cafe} xícaras</p>
        `;
        
        listaElemento.appendChild(cardHistorico);
    });
}

/* ==========================================================================
   RESET DO DIA
   ========================================================================== */

/**
 * Zera todos os dados do dia atual.
 * Pede confirmação antes para evitar apagar sem querer.
 */
function resetarDia() {
    const confirmacao = confirm("Aviso: Queres mesmo zerar todos os teus dados de hoje?");
    
    if (confirmacao) {
        const hoje = getDataChave();
        const objetoVazio = { 
            agua: 0, 
            fruta: 0, 
            treino: 0, 
            cafe: 0 
        };
        
        salvarDadosDia(hoje, objetoVazio);
        atualizarInterface();
        
        console.log("Dados do dia " + hoje + " foram resetados.");
    }
}