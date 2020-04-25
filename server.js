//tratativa da rota
const express =require('express');
//padrao do node, para encontrar as pastas, etc
const path = require('path');

//cria o app, com o expresse que é a rota de onde ele vai ser encontrado
const app = express();

/*cria o server definindo o protodolo http do app que é a porta que vais er
acessada pelo websocket*/
const server = require('http').createServer(app);
//define o protocolo wss para o socketio, passando o serveer como function
const io = require("socket.io")(server);

//define uma pasta de onde vai ficar os arquivos publicos da aplicacao
app.use(express.static(path.join(__dirname, 'public')));

/*Configuraçoes para mostrar para o app que vou usar as 'views' como html,
que por padrao no node usa ejs(é a engine tem no v8 que é escutada no node
via express )*/
//define onde vai ficar as views
app.set("views", path.join(__dirname, 'public'));
//define a engine como html
app.engine('html', require('ejs').renderFile);
//agora posso usar html nas minhas views
app.set('view engine', 'html');

//quando acessar o endereço incial do meu server '/' vai renderizar o index.html
app.use('/', (req,res)=>{
  res.render('index.html');
});

let messages = [];

//definir a forma de conexao do usuario com o server
io.on('connection', socket =>{

  socket.emit('previousMessages', messages);
  //ouve o socket enviado pelo front recebendo com o mesmo 'name' de envio
  socket.on('sendMessage', data =>{    
    messages.push(data);
    /*broadcast envia para todos usuarios, criando uma name 'recivedMessage'
      e o valor da mensagem que é o data*/
    socket.broadcast.emit('recivedMessage', data);
  });

});

//chama o server na porta 3000 'localhos:3000'
server.listen('3000');

