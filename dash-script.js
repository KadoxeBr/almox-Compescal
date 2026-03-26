const URL_API = 'https://script.google.com/macros/s/AKfycbwC7NopmSkdTVnirs-xrFKFTAQNGj56xFvZ2JaLNXTOzCPNnzJexmXV01HdB6BSc7-JEA/exec';

async function carregarDashboard() {
  // Exibe o nome de quem logou
  document.getElementById('labelUsuario').innerText = `Operador: ${sessionStorage.getItem('usuario_ativo')}`;

  try {
    const response = await fetch(`${URL_API}?action=getDashboardData`);
    const data = await response.json();

    if (data.status === "success") {
      document.getElementById('kpiTotal').innerText = data.totalProdutos;
      document.getElementById('kpiCritico').innerText = data.itensCriticos;
      document.getElementById('kpiMov').innerText = data.movHoje;
    }
  } catch (error) {
    console.error("Erro ao carregar KPIs", error);
  }
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

// Inicia a carga
carregarDashboard();