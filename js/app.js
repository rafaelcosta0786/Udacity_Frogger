
const pontoInicio = {
    inimigoInicioX: -100,
    inimigoFimX: 505,
    inimigoPrimeiroY: 60,
    inimigoSegundoY: 140,
    inimigoTerceiroY: 220,
    posicaoJogadorVertical: 200,
    posicaoJogadorHorizontal: 380
};

const controles = {
    controleVertical: 100,
    controleHorizontal: 80,
    vidas: 3,
    pontos: 0,
    fimJogo: false,
};

let msgStatus = document.querySelector('.msgStatus').style;

class Person {
    constructor(x, y, movVelocidade, sprite) { 
        // As variáveis aplicadas a nossas instâncias entram aqui.
        // Fornecemos uma a você para que possa começcar.
        this.x = x;
        this.y = y;
        this.movVelocidade = movVelocidade;

        // A imagem/sprite, isso usa um
        // ajudante que é fornecido para carregar imagens
        // com facilidade.
        this.sprite = sprite;
    }
    
    // Desenhe o persnagem na tela, método exigido pelo jogo
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Inimigos que nosso jogador deve evitar
class Enemy extends Person {
    constructor(x, y, movVelocidade) {
        super(x,y,movVelocidade,'images/enemy-bug.png');
    }
}

// Atualize a posição do inimigo, método exigido pelo jogo
// Parâmetro: dt, um delta de tempo entre ticks
Enemy.prototype.update = function (dt) {
    // Você deve multiplicar qualquer movimento pelo parâmetro
    // dt, o que garantirá que o jogo rode na mesma velocidade
    // em qualquer computador.
    const valoresFixos = {
        inimigoDeslocamento: 50,
        inimigoVelociodade: 200
    }

    this.x += this.movVelocidade * dt;
    if (this.x > pontoInicio.inimigoFimX) {
        this.x = pontoInicio.inimigoInicioX;

        this.movVelocidade = Math.floor(valoresFixos.inimigoDeslocamento + (Math.random() * valoresFixos.inimigoVelociodade));
    }
};


// Agora, escreva sua própria classe de jogador
// Esta classe exige um método update(), 
// um render() e um handleInput().
class Player extends Person {
    constructor(x, y, jogadorVelocidade) {
        super(x,y,jogadorVelocidade,'images/char-boy.png');
    }
}


Player.prototype.update = function () {

    // reset da posição do jogador
    if (this.x < 0 || this.x >= 500 || this.y > pontoInicio.posicaoJogadorHorizontal) {
        this.x = pontoInicio.posicaoJogadorVertical;
        this.y = pontoInicio.posicaoJogadorHorizontal;

        if (controles.vidas != 1 && controles.pontos != 0) {
            controles.pontos--;
        }

        if (controles.vidas != 0) {
            controles.vidas--;
            document.querySelector('.tentativa').textContent = controles.vidas;
        }
    }

    if (controles.vidas == 0) {
        controles.fimJogo = true;
        msgStatus.display = 'block';
    }

    if (this.y < 0) {
        this.x = pontoInicio.posicaoJogadorVertical;
        this.y = pontoInicio.posicaoJogadorHorizontal;
        controles.pontos++;
    }

    document.querySelector('.pontos').textContent = controles.pontos;

    const text = 'ponto' + (controles.pontos == 1 ? '' : 's');
    document.querySelector('.msgPontoFinal').textContent = `${controles.pontos} ${text}`;

};

Player.prototype.handleInput = function (pressedKey) {
    switch (pressedKey) {
        case 'left':
            this.x -= controles.controleVertical;
            break;
        case 'right':
            this.x += controles.controleVertical;
            break;
        case 'up':
            this.y -= controles.controleHorizontal;
            break;
        case 'down':
            this.y += controles.controleHorizontal;
    };
};


// Represente seus objetos como instâncias.
// Coloque todos os objetos inimgos numa array todosInimigos
// Coloque o objeto do jogador numa variável chamada jogador.


let todosInimigos = [];
let player = new Player(pontoInicio.posicaoJogadorVertical, pontoInicio.posicaoJogadorHorizontal, 20);

let inimigosPosicao = [pontoInicio.inimigoPrimeiroY, pontoInicio.inimigoSegundoY, pontoInicio.inimigoTerceiroY];

inimigosPosicao.forEach(function (verticalPos) {
    var enemy = new Enemy(pontoInicio.inimigoInicioX, verticalPos, 50 + (Math.floor(Math.random() * 200)));
    todosInimigos.push(enemy);
});


document.querySelector('.tentarNovo').addEventListener('click', function () {
    location.reload();
});


// Isto reconhece cliques em teclas e envia as chaves para seu
// jogador. método handleInput(). Não é preciso mudar nada.
document.addEventListener('keyup', function (e) {

    if (!controles.fimJogo) {

        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    }
});
