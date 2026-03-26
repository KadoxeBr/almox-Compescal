const URL_API = 'https://script.google.com/macros/s/AKfycbwC7NopmSkdTVnirs-xrFKFTAQNGj56xFvZ2JaLNXTOzCPNnzJexmXV01HdB6BSc7-JEA/exec'; // Verifique se termina em /exec

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userValue = document.getElementById('user').value;
  const passValue = document.getElementById('password').value;
  const btn = e.target.querySelector('button');

  btn.innerText = "CONECTANDO...";
  btn.disabled = true;

  // Montagem da URL para GET (Método mais estável para Google Script)
  const fetchUrl = `${URL_API}?action=login&user=${encodeURIComponent(userValue)}&pass=${encodeURIComponent(passValue)}`;

  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
      mode: 'cors', // Crucial para o StackBlitz aceitar a resposta do Google
      redirect: 'follow'
    });

    const texto = await response.text(); // Lemos primeiro como texto para evitar erro de JSON vazio
    const resultado = JSON.parse(texto);

    if (resultado.status === "success") {
      sessionStorage.setItem('usuario_ativo', resultado.nome);
      alert("Sucesso!");
      window.location.href = 'dashboard.html';
    } else {
      alert("Erro na Planilha: " + resultado.message);
    }
  } catch (error) {
    console.error('Erro detalhado:', error);
    alert('Falha de Conexão. Verifique o console (F12) para detalhes.');
  } finally {
    btn.innerText = "ENTRAR";
    btn.disabled = false;
  }
});