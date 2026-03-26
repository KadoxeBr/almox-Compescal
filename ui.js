export const UI = {
  notificar: (mensagem, tipo = 'success') => {
    // Remove notificação anterior se existir
    const existente = document.getElementById('toast-compescal');
    if (existente) existente.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-compescal';
    
    // Estilização dinâmica baseada no tipo (sucesso ou erro)
    const bgColor = tipo === 'success' ? 'bg-green-600' : 'bg-red-600';
    const icon = tipo === 'success' ? 'check-circle' : 'alert-circle';

    toast.className = `fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm border border-white/20 animate-bounce ${bgColor}`;
    
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-5 h-5"></i>
      <span class="uppercase tracking-widest">${mensagem}</span>
    `;

    document.body.appendChild(toast);
    lucide.createIcons();

    // Remove após 3 segundos e executa callback se houver
    setTimeout(() => {
      toast.classList.replace('animate-bounce', 'opacity-0');
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
};