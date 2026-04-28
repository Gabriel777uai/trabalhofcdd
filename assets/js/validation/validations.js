class Carrinho {
  constructor(cliente) {
    this.cliente = cliente;
    this.itens = []; // Começa vazio
  }

  // Método para adicionar produtos
  adicionarProduto(nome, preco, quantidade) {
    this.itens.push({ nome, preco, quantidade });
    console.log(`${nome} adicionado ao carrinho.`);
  }

  // Getter para calcular o total dinamicamente
  get valorTotal() {
    const descontoCalc = this.desconto > 5 ? 5 : this.desconto;
    const valorFinalDesconto = Number(`0.${descontoCalc}`);
    console.log(valorFinalDesconto);
    const valorTotal = this.itens.reduce((total, item) => {
      return total + item.preco * item.quantidade;
    }, 0);
    const valorTotalComDesconto = valorTotal - valorTotal * valorFinalDesconto;

    return valorTotalComDesconto;
  }

  exibirResumo(desconto = 0) {
    console.log(`Resumo do pedido de ${this.cliente}:`);
    this.itens.forEach((item) => {
      console.log(`- ${item.nome} (${item.quantidade}x): R$ ${item.preco}`);
    });

    console.log(`Total: R$ ${this.valorTotal.toFixed(2)}`);
  }
}

// Usando a classe:
const meuCarrinho = new Carrinho("Gabriel");
meuCarrinho.adicionarProduto("Teclado Mecânico", 250.0, 1);
meuCarrinho.adicionarProduto("Mouse Gamer", 120.0, 2);

meuCarrinho.exibirResumo();
