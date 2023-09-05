
/************************************************************************
********************** PROJETO EM DESENVOLVIMENTO ***********************
*************************************************************************/
//document.getElementById("a").style.display = "none";

const dataCorrente = document.querySelector(".current-date");
//console.log(dataCorrente)
tagDias = document.querySelector(".days");
//console.log(tagDias);
prevProximoIcone = document.querySelectorAll(".icons span");
//console.log(prevProximoIcone);
//obtendo nova data, ano e mês correntes.
let date = new Date();
anoCorrente = date.getFullYear();
//console.log(anoCorrente)
mesCorrente = date.getMonth();
//console.log(mesCorrente)

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
    "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const renderCalendar = () => {
    //let primeiroDia = new Date(anoCorrente, mesCorrente, 1)
    // console.log(primeiroDia);
    let primeiroDiaDoMes = new Date(anoCorrente, mesCorrente, 1).getDay(); //obtendo o primeiro dia do mês
    // console.log(primeiroDiaDoMes)
    //let ultimaDataDo = new Date(anoCorrente, mesCorrente + 1, 0)
    // console.log(ultimaDataDo);
    let ultimaDataDoMes = new Date(anoCorrente, mesCorrente + 1, 0).getDate();//getting last date of month
    // console.log(ultimaDataDoMes);
    let ultimoDiaDoMes = new Date(anoCorrente, mesCorrente, ultimaDataDoMes).getDay(); //getting last day of month
    // console.log(ultimoDiaDoMes);
    let ultimaDataDoUltimoMes = new Date(anoCorrente, mesCorrente, 0).getDate();//getting last date of previous month
    // console.log(ultimaDataDoUltimoMes);
    let liTag = "";

    for (let i = primeiroDiaDoMes; i > 0; i--) { //creating li of previous month last days
        liTag += `<li class="inactive">${ultimaDataDoUltimoMes - i + 1}</li>`;
        //console.log(liTag);
    }
    //console.log(date.getDate());

    for (let i = 1; i <= ultimaDataDoMes; i++) { //creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let eHoje = i === date.getDate() && mesCorrente === new Date().getMonth()
            && anoCorrente === new Date().getFullYear() ? "active" : "";
        liTag += `<li class= "${eHoje}">${i}</li>`;

        //console.log(liTag);
    }


    for (let i = ultimoDiaDoMes; i < 6; i++) { //creating li of next month first days
        liTag += `<li class="inactive">${i - ultimoDiaDoMes + 1}</li>`;
    }

    //console.log(liTag)

    dataCorrente.innerText = `${meses[mesCorrente]} ${anoCorrente}`;
    tagDias.innerHTML = liTag;
}

renderCalendar();


prevProximoIcone.forEach(icon => {
    icon.addEventListener("click", () => { //adding click event on both icons
        //if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        mesCorrente = icon.id === "prev" ? mesCorrente - 1 : mesCorrente + 1;

        if (mesCorrente < 0 || mesCorrente > 11) {
            date = new Date(anoCorrente, mesCorrente);
            anoCorrente = date.getFullYear(); //updating current year with new date year
            mesCorrente = date.getMonth(); //updating current month with new date month
        } else { //else pass new Date as date value
            date = new Date();
        }
        renderCalendar();
    });
});


//atributo onclick fica na espera do click do botão salvar
botaoSalvar = document.querySelector(".btn-salvar");
botaoSalvar.onclick = function () {
    gravaDados();
}

// função gravarDados() salva no array bancoDeDados os dados retornados pela a função lerCompromissos()
var bancoDeDados = [];

function gravaDados() {

    let dados = lerCompromissos();

    let { data, horario, endereco, descricao } = dados;
    let salvaDados = true;

    for (let i = 0; i < bancoDeDados.length; i++) {
        let dataDoBanco = bancoDeDados[i].data;
        if (data.getFullYear() === dataDoBanco.getFullYear()
            && data.getMonth() === dataDoBanco.getMonth()
            && data.getDate() === dataDoBanco.getDate() && horario === bancoDeDados[i].horario) {
            alert("agenda já existe");
            salvaDados = false;
            break;
        }
    }

    if (salvaDados) {
        bancoDeDados.push(dados);
    }

    let dataCarregadaForm = document.getElementById("data").value;

    if (salvaDados && contaAcionaFechar) {
        listarDados(dataCarregadaForm);
    }

    limpaFormulario();
}

// a função lerCompromissos() captura os dados inseridos no input pelo o usuário
function lerCompromissos() {
    let dataEntrada = document.getElementById('data').value;
    let dataSeparada = dataEntrada.split("-");
    let stringEmDate = new Date(dataSeparada[0], dataSeparada[1] - 1, dataSeparada[2]);

    const compromisso = {
        data: stringEmDate,
        horario: document.getElementById('horario').value,
        endereco: document.getElementById('endereco').value,
        descricao: document.getElementById('descricao').value
    }
    return compromisso;
}

const listagem = document.querySelector(".days").getElementsByTagName('li')
//console.log(listagem)
for (let i = 0; i < listagem.length; i++) {
    listagem[i].addEventListener('click', () => {
        let diaClicado = listagem[i].textContent;
        //console.log(diaClicado); 
        montarData(diaClicado);

    })
}

function montarData(dia) {

    //carregando mês, ano do calendário     
    mesAno = document.querySelector(".current-date").innerText;
    ano = mesAno.slice(-4); //ano mostrado no calendário

    for (let i = 0; i < meses.length; i++) {
        //compara o mês do calendário com o mês do array meses
        if (meses[i].slice(0, 3) == mesAno.slice(0, 3)) {
            i += 1;
            let dataCompleta = ano.concat("-" + i + "-" + dia);
            listarDados(dataCompleta);
            break;
        }
    }
}

//arrumar bug ao clicar em dias fora do mês corrente...li inativos.
var bancoDaListagem = [];
var contaAcionaFechar = 0;

function listarDados(dataCompleta) {

    let strData = dataCompleta;
    let parteData = strData.split("-");

    let dataCalendario = new Date(parteData[0], parteData[1] - 1, parteData[2]) //transforma a data capturada do calendário de string para Date
    //console.log(dataCalendario);
    for (let i = 0; i < bancoDeDados.length; i++) {
        let dataDoBanco = bancoDeDados[i].data;

        if (dataCalendario.getFullYear() === dataDoBanco.getFullYear()
            && dataCalendario.getMonth() === dataDoBanco.getMonth()
            && dataCalendario.getDate() === dataDoBanco.getDate()) {
            // array usado como banco, para fazer a listagem dos compromissos do dia selecionado.  

            let dataFormatada = ((dataDoBanco.getDate()).toString().length != 2 ? ("0" + dataDoBanco.getDate()) : dataDoBanco.getDate()) +
                "/" + ((dataDoBanco.getMonth() + 1).length != 2 ? "0" + (dataDoBanco.getMonth() + 1) : (dataDoBanco.getMonth() + 1)) +
                "/" + dataDoBanco.getFullYear();

            // console.log(bancoDeDados[i].descricao);
            let concatString = dataFormatada.concat(" -- " + " " + bancoDeDados[i].horario + " " + "hs" + " " + bancoDeDados[i].endereco + ". " + bancoDeDados[i].descricao);
            //console.log(concatString);
            bancoDaListagem.push(concatString);
        }

    }

    contaAcionaFechar++;
    //console.log(contaAcionaFechar);

    if (bancoDaListagem.length > 0) {

        let ativaIconeFechar = true;
        mostrarBotaoFechar(ativaIconeFechar);
    } else {
        let ativaIconeFechar = false;

        mostrarBotaoFechar(ativaIconeFechar);

    }

    mostrarListagem();

}

var mostraFechar = 0;
function mostrarBotaoFechar(ativaIconeFechar) {

    if (ativaIconeFechar == true && contaAcionaFechar == 1) {
        mostraFechar++;
        const imgFechar = document.createElement("img");
        const divListagem = document.getElementById("fechar");
        imgFechar.setAttribute("src", 'fechar.png');

        if (mostraFechar == 1) {
            divListagem.appendChild(imgFechar);
        }
        document.getElementById("fechar").style.display = "block";
    }

    if (ativaIconeFechar == false) {
        document.getElementById("fechar").style.display = "none";

        contaAcionaFechar = 0;
    }

    mostrar_btn_salvar();
}


// Esta função quebra de linha dos dados e faz a listagem dos compromissos. 
function mostrarListagem() {

    let compromissosTag = document.querySelector(".lista-compromisso");
    let liCompromisso = " ";
    for (let i = 0; i < bancoDaListagem.length; i++) {
        let dados_listados = bancoDaListagem[i];
        let data_hora_listada = dados_listados.substring(0, 23);
        let endereco_listado = dados_listados.substring(23, dados_listados.indexOf("."))
        let descricao_listada = dados_listados.substring(dados_listados.indexOf(".") + 1)
        liCompromisso += `<li class = "Ativa">${data_hora_listada + "<br>" + endereco_listado + "<br>" + descricao_listada}</li>`

    }

    //  console.log(liCompromisso);
    compromissosTag.innerHTML = liCompromisso;

    let esvaziarBancoList = bancoDaListagem.length;
    while (esvaziarBancoList > 0) {
        bancoDaListagem.pop();
        esvaziarBancoList--;
    }

    let dadosListados = document.querySelectorAll(".Ativa");
    // console.log(dadosListados)
    if (dadosListados.length == 0) {
        limpaFormulario();
    }

    for (let i = 0; i < dadosListados.length; i++) {
        dadosListados[i].addEventListener('click', () => {
            let carregaDados = dadosListados[i];
            // console.log(carregaDados) 
            carregarInput(carregaDados);
        })
    }
}


//os dados clicados na tag li são carregados nos campos inputs do formulário por essa função
function carregarInput(carregar) {

    let texto = carregar.innerText;
    //console.log(texto);
    let arrayTexto = texto.split("\n", 3);
    // console.log(arrayTexto)
    let dataRecuperada = texto.substring(0, 10);
    //console.log(dataRecuperada)
    let inverteData = dataRecuperada.split("/");
    //console.log(inverteData)
    let dataInvertida = inverteData[2] + "/" + inverteData[1] + "/" + inverteData[0];
    //console.log(dataInvertida)
    let data = new Date(dataInvertida);
    let dataComDoisDigitos = data.getFullYear() + "-" + ((data.getMonth() + 1).length != 2 ? "0" + (data.getMonth() + 1) : (data.getMonth() + 1))
        + "-" + ((data.getDate()).toString().length != 2 ? ("0" + data.getDate()) : data.getDate());
    //console.log(dataComDoisDigitos)
    document.getElementById("data").value = dataComDoisDigitos;
    let horaRecuperada = texto.substring(14, 19);
    document.querySelector('input[type="time"]').value = horaRecuperada;
    document.getElementById("endereco").value = arrayTexto[1];
    document.getElementById("descricao").value = arrayTexto[2];

}

botaoFecharListagem = document.querySelector(".iconeFechar");
botaoFecharListagem.onclick = function () {
    let ativaIconeFechar = false
    mostrarBotaoFechar(ativaIconeFechar);
    mostrarListagem();
    limpaFormulario();
}

function limpaFormulario() {
    document.getElementById('data').value = '';
    document.getElementById('horario').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('descricao').value = '';
}

let mostrar_btn_alterar_excluir = () => {
    let btn_salvar = document.getElementById("salvar");
    let btn_alterar = document.getElementById("alterar");
    let btn_excluir = document.getElementById("excluir");
    btn_salvar.setAttribute("hidden", "hidden");
    btn_alterar.removeAttribute("hidden");
    btn_excluir.removeAttribute("hidden");
    let dataCarregada = document.getElementById("data").value;
    // console.log(dataCarregada);
    let dataArray = dataCarregada.split("-");
    let dataArrayEmString = new Date(dataArray[0], dataArray[1] - 1, dataArray[2]);
    let horarioCarregado = document.getElementById("horario").value;

    //se o usuário apertar o botão alterar o fluxo do programa irá alterar o compromisso escolhido
    btn_alterar.onclick = function () {
        alterarAgenda(dataArrayEmString, horarioCarregado, dataCarregada);
    }
    //se o usuário apertar o botão excluir o fluxo do programa irá excluir o compromisso escolhido
    btn_excluir.onclick = function () {
        excluirAgenda(dataCarregada);
    }
}

let mostrar_btn_salvar = () => {
    let btn_salvar = document.getElementById("salvar");
    let btn_alterar = document.getElementById("alterar");
    let btn_excluir = document.getElementById("excluir");
    btn_salvar.removeAttribute("hidden");
    btn_alterar.setAttribute("hidden", "hidden");
    btn_excluir.setAttribute("hidden", "hidden");

    limpaFormulario();
}

function alterarAgenda(dataArrayEmString, horarioCarregado, dataCarregada) {

    for (let i = 0; i < bancoDeDados.length; i++) {

        if (bancoDeDados[i].data.getTime() == dataArrayEmString.getTime() && bancoDeDados[i].horario == horarioCarregado) {
            let dadosAlterados = lerCompromissos();
            bancoDeDados.splice(i, 1); //deleta o objeto na posição i
            bancoDeDados.splice(i, 0, dadosAlterados); // adiciona o objeto na posição i

            listarDados(dataCarregada);
            mostrar_btn_salvar();
        }
    }
}

function excluirAgenda(dataCarregada) {
    let dados = lerCompromissos();
    let { data, horario, endereco, descricao } = dados;
    for (let i = 0; i < bancoDeDados.length; i++) {
        let dataDoBanco = bancoDeDados[i].data;
        if (data.getFullYear() === dataDoBanco.getFullYear()
            && data.getMonth() === dataDoBanco.getMonth()
            && data.getDate() === dataDoBanco.getDate() && horario === bancoDeDados[i].horario) {
            bancoDeDados.splice(i, 1); //exclui objeto na posição i.
            break;
        }
    }

    listarDados(dataCarregada);
    limpaFormulario();
}

