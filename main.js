const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const tempoNaTela = document.querySelector('#timer')

const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarIconBt = document.querySelector('.app__card-primary-button-icon')

const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');

const comecar = new Audio('./sons/play.wav');
const pausar = new Audio('./sons/pause.mp3');
const beep = new Audio('./sons/beep.mp3');

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musica.loop = true;

function alterarContexto(element, atribute, timer) {
    element.addEventListener('click', function() {
        //Add fundo e imagem
        html.setAttribute('data-contexto', atribute);
        
        const img = `./imagens/${atribute}.png`;
        banner.setAttribute('src', img);
        
        //Add interação dos botões
        botoes.forEach(function (atribute) {
            atribute.classList.remove('active');
        })
        element.classList.add('active');

        //Add título
        switch (atribute) {
            case 'foco':
                titulo.innerHTML = `
                Otimize sua produtividade,<br>
                    <strong class="app__title-strong">mergulhe no que importa.</strong>
                `;
                break;
            case 'descanso-curto': 
                titulo.innerHTML = `
                Que tal dar uma respirada?<br>
                    <strong class="app__title-strong">Faça uma pausa curta!</strong>
                `;
                break;
            case 'descanso-longo': 
                titulo.innerHTML = `
                Hora de voltar à superfície.<br>
                    <strong class="app__title-strong">Faça uma pausa longa.</strong>
                `;
                break;
            default:
                break;
        }

        //Temporizador
        tempoDecorridoEmSegundos = timer
        mostrarTempo()
    })
}

alterarContexto(focoBt,'foco', 1500);
alterarContexto(curtoBt,'descanso-curto', 300);
alterarContexto(longoBt,'descanso-longo', 900);

musicaFocoInput.addEventListener('change', function () {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

// TEMPORIZADOR
const contagemRegressiva = function () {
    if(tempoDecorridoEmSegundos <= 0) {
        beep.play();
        alert('Tempo finalizado!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}
startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        pausar.play();
        zerar();
        return
    }
    comecar.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = 'Pausar';
    iniciarOuPausarIconBt.setAttribute('src', './imagens/pause.png');
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = 'Começar';
    iniciarOuPausarIconBt.setAttribute('src', './imagens/play_arrow.png');
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    let tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();

