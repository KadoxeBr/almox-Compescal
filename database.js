// DATABASE.JS - v1.0.2-BETA
// TRAVA DE SEGURANÇA: Configurações de acesso protegidas

export const db = {
  // --- CONFIGURAÇÕES DE FÁBRICA (TRAVA) ---
  config: {
    user: "admin",
    pass: "123",
    versao: "v1.0.2-BETA"
  },

  // --- NÚCLEO DE DADOS ---
  dados() {
    const defaultDB = {
      setores: [], funcionarios: [], produtos: [], 
      fornecedores: [], centrosCusto: [], maquinas: [], movimentacoes: []
    };
    return JSON.parse(localStorage.getItem('compescal_db')) || defaultDB;
  },

  salvar(dados) {
    localStorage.setItem('compescal_db', JSON.stringify(dados));
  },

  // --- LOGIN PROTEGIDO (Não depende de dados mutáveis) ---
  login(usuario, senha) {
    if (usuario === this.config.user && senha === this.config.pass) {
      sessionStorage.setItem('compescal_sessao', 'ativa');
      return { status: "success" };
    }
    return { status: "error", message: "Credenciais inválidas." };
  },

  verificarSessao() {
    return sessionStorage.getItem('compescal_sessao') === 'ativa';
  },

  logout() {
    sessionStorage.removeItem('compescal_sessao');
    window.location.href = 'login.html';
  },

  // --- GESTÃO DE REGISTROS ---
  adicionarRegistro(colecao, objeto) {
    const banco = this.dados();
    if (!banco[colecao]) banco[colecao] = [];
    const index = banco[colecao].findIndex(item => item.id === objeto.id);
    
    if (index !== -1) {
      banco[colecao][index] = { ...banco[colecao][index], ...objeto };
    } else {
      banco[colecao].push(objeto);
    }
    this.salvar(banco);
    return { status: "success", message: "Operação concluída!" };
  },

  excluirRegistro(colecao, id) {
    const banco = this.dados();
    banco[colecao] = banco[colecao].filter(item => item.id !== id);
    this.salvar(banco);
    return { status: "success", message: "Removido!" };
  },

  // --- MOTOR DE MOVIMENTAÇÃO (ESTOQUE) ---
  registrarMovimento(tipo, dados) {
    const banco = this.dados();
    const produto = banco.produtos.find(p => p.id === dados.idProduto);
    if (!produto) return { status: "error", message: "Produto não encontrado!" };

    const qtd = parseFloat(dados.quantidade);
    const vlr = parseFloat(dados.valorUnitario || 0);

    const novaMov = {
      id: Date.now(),
      data: new Date().toLocaleString('pt-BR'),
      tipo: tipo,
      ...dados,
      quantidade: qtd,
      valorUnitario: vlr,
      total: qtd * vlr
    };

    if (tipo === 'ENTRADA') {
      produto.saldo = (parseFloat(produto.saldo) || 0) + qtd;
      produto.ultimoCusto = vlr;
    } else if (tipo === 'SAIDA') {
      if (produto.saldo < qtd) return { status: "error", message: "Estoque insuficiente!" };
      produto.saldo -= qtd;
    }

    banco.movimentacoes.push(novaMov);
    this.salvar(banco);
    return { status: "success", message: `Sucesso: ${tipo} registrada.` };
  },

  // ESTORNO E CORREÇÃO
  excluirMovimento(idMov) {
    const banco = this.dados();
    const index = banco.movimentacoes.findIndex(m => m.id === idMov);
    if (index === -1) return { status: "error", message: "Não encontrado." };

    const mov = banco.movimentacoes[index];
    const produto = banco.produtos.find(p => p.id === mov.idProduto);

    if (produto) {
      if (mov.tipo === 'ENTRADA') {
        if (produto.saldo < mov.quantidade) return { status: "error", message: "Saldo insuficiente para estorno." };
        produto.saldo -= mov.quantidade;
      } else {
        produto.saldo += mov.quantidade;
      }
    }

    banco.movimentacoes.splice(index, 1);
    this.salvar(banco);
    return { status: "success", message: "Estorno realizado!" };
  }
};