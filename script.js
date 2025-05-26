// Array de produtos com estoque
const produtos = [
  {
    id: 1,
    nome: "Samya",
    preco: 10,
    estoque: 1,
    imagem: "https://via.placeholder.com/150"
  }
];


// Carrinho de compras
const carrinho = [];

const container = document.getElementById('produtos');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalSpan = document.getElementById('total');
const contadorCarrinho = document.getElementById('contador-carrinho');

// Cria o card do produto, incluindo input de quantidade e botão
function criarCardProduto(produto) {
  const div = document.createElement('div');
  div.className = 'produto';
  div.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}">
    <h3>${produto.nome}</h3>
    <p>R$ ${produto.preco.toFixed(2)}</p>
    <p>Estoque disponível: ${produto.estoque}</p>
    <label for="quantidade-${produto.id}">Qtd:</label>
    <input type="number" id="quantidade-${produto.id}" value="1" min="1" max="${produto.estoque}">
    <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
  `;
  return div;
}

// Renderiza todos os produtos na página
function renderizarProdutos() {
  container.innerHTML = '';
  produtos.forEach(produto => {
    container.appendChild(criarCardProduto(produto));
  });
}

// Atualiza o carrinho visualmente
function atualizarCarrinho() {
  listaCarrinho.innerHTML = '';
  let total = 0;
  carrinho.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} (Qtd: ${item.quantidade})`;
    listaCarrinho.appendChild(li);
    total += item.preco * item.quantidade;
  });
  totalSpan.textContent = total.toFixed(2);
  contadorCarrinho.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
}

// Adiciona produto ao carrinho verificando estoque
function adicionarAoCarrinho(idProduto) {
  const produto = produtos.find(p => p.id === idProduto);
  if (!produto) return alert('Produto não encontrado.');

  const inputQuantidade = document.getElementById(`quantidade-${idProduto}`);
  let quantidade = parseInt(inputQuantidade.value);

  if (quantidade <= 0 || isNaN(quantidade)) {
    alert('Digite uma quantidade válida.');
    return;
  }

  if (quantidade > produto.estoque) {
    alert(`Quantidade indisponível. Temos apenas ${produto.estoque} em estoque.`);
    return;
  }

  // Verifica se produto já está no carrinho
  const itemCarrinho = carrinho.find(item => item.id === produto.id);

  if (itemCarrinho) {
    if (itemCarrinho.quantidade + quantidade > produto.estoque) {
      alert(`Você já tem ${itemCarrinho.quantidade} desse produto no carrinho. Estoque insuficiente para adicionar mais ${quantidade}.`);
      return;
    }
    itemCarrinho.quantidade += quantidade;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: quantidade
    });
  }

  // Atualiza estoque local (simulado)
  produto.estoque -= quantidade;

  // Atualiza interface
  renderizarProdutos();
  atualizarCarrinho();
}

// Função para filtrar produtos pelo nome
function filtrarProdutos() {
  const termo = document.getElementById('campo-busca').value.toLowerCase();
  const cards = container.getElementsByClassName('produto');

  for (let card of cards) {
    const nome = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = nome.includes(termo) ? 'block' : 'none';
  }
}

// Função para finalizar compra, gera mensagem para WhatsApp
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "Olá! Gostaria de finalizar minha compra com os seguintes itens:%0A%0A";
  let total = 0;

  carrinho.forEach((produto, index) => {
    mensagem += `${index + 1}. ${produto.nome} - R$ ${produto.preco.toFixed(2)} x${produto.quantidade} = R$ ${(produto.preco * produto.quantidade).toFixed(2)}%0A`;
    total += produto.preco * produto.quantidade;
  });

  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  const numeroLoja = "5545998011346";
  const urlWhatsApp = `https://wa.me/${numeroLoja}?text=${mensagem}`;

  window.open(urlWhatsApp, "_blank");
}

// Scroll suave para o carrinho
function scrollToCarrinho() {
  document.querySelector('.carrinho').scrollIntoView({ behavior: 'smooth' });
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
  renderizarProdutos();
  atualizarCarrinho();
});

