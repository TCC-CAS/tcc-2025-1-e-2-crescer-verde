(function () {
  function injectTermsModal() {
    if (document.getElementById('termsModal')) return;

    const modal = document.createElement('div');
    modal.innerHTML = `
<div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header pb-0 border-0" style="flex-direction: column; align-items: flex-start;">
        <div class="d-flex justify-content-between align-items-center w-100 mb-2">
          <h5 class="modal-title fw-bold" id="termsModalLabel" style="color:#1b5e20;">Documentos Legais</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <ul class="nav nav-tabs w-100" id="termsTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="tab-uso-btn" data-bs-toggle="tab" data-bs-target="#tab-uso" type="button" role="tab">Termos de Uso</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="tab-privacidade-btn" data-bs-toggle="tab" data-bs-target="#tab-privacidade" type="button" role="tab">Pol&iacute;tica de Privacidade</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="tab-acessibilidade-btn" data-bs-toggle="tab" data-bs-target="#tab-acessibilidade" type="button" role="tab">Acessibilidade</button>
          </li>
        </ul>
      </div>
      <div class="modal-body pt-3" style="font-size: 0.93rem; line-height: 1.7; color: #333;">
        <div class="tab-content">

          <!-- TERMOS DE USO -->
          <div class="tab-pane fade show active" id="tab-uso" role="tabpanel">
            <p class="text-muted" style="font-size: 0.82rem;">Última atualização: abril de 2026</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">1. Sobre a Plataforma</h6>
            <p>A <strong>Plataforma de Jogos de Sustentabilidade Infantil – Crescer Verde</strong> é um ambiente educacional digital voltado ao ensino de sustentabilidade, meio ambiente e práticas ecológicas para crianças e jovens. Os jogos, quizzes e materiais disponíveis têm caráter exclusivamente pedagógico e não comercial.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">2. Acesso e Cadastro</h6>
            <p>Para acessar funcionalidades completas (progresso, certificados), é necessário criar uma conta com nome e endereço de e-mail válidos. Usuários com menos de 13 anos devem ter autorização expressa de um responsável legal para realizar o cadastro.</p>
            <p>Você é responsável por manter a confidencialidade de suas credenciais de acesso. Em caso de uso não autorizado de sua conta, notifique-nos imediatamente.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">3. Uso Permitido</h6>
            <p>É permitido:</p>
            <ul>
              <li>Acessar e jogar todos os jogos disponíveis para fins pessoais e educacionais;</li>
              <li>Compartilhar certificados de conclusão para fins acadêmicos;</li>
              <li>Utilizar o conteúdo como apoio em atividades escolares supervisionadas.</li>
            </ul>
            <p>É vedado:</p>
            <ul>
              <li>Reproduzir, distribuir ou comercializar o conteúdo da plataforma sem autorização;</li>
              <li>Tentar burlar sistemas de autenticação ou acesso;</li>
              <li>Compartilhar suas credenciais com terceiros;</li>
              <li>Usar a plataforma para qualquer finalidade ilícita ou prejudicial a terceiros.</li>
            </ul>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">4. Propriedade Intelectual</h6>
            <p>Todo o conteúdo da plataforma – incluindo textos, imagens, jogos, quizzes, logotipos e design – é de propriedade da Crescer Verde ou de seus licenciantes, protegido pelas leis de propriedade intelectual aplicáveis no Brasil.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">5. Certificados</h6>
            <p>Os certificados emitidos pela plataforma têm valor educacional e não substituem certificações ou qualificações formais reconhecidas por órgãos oficiais de ensino. A emissão do certificado está condicionada à conclusão de todos os conteúdos do jogo correspondente.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">6. Disponibilidade e Alterações</h6>
            <p>A Crescer Verde reserva-se o direito de modificar, suspender ou encerrar, temporária ou permanentemente, qualquer parte da plataforma sem aviso prévio. Alterações relevantes nos Termos de Uso serão comunicadas por meio da própria plataforma.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">7. Limitação de Responsabilidade</h6>
            <p>A plataforma é fornecida "no estado em que se encontra". Não garantimos disponibilidade ininterrupta nem a ausência de erros. Em nenhum caso seremos responsáveis por danos indiretos, incidentais ou consequentes decorrentes do uso ou da impossibilidade de uso da plataforma.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">8. Lei Aplicável</h6>
            <p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Quaisquer disputas serão submetidas ao foro da comarca correspondente.</p>
          </div>

          <!-- POLÍTICA DE PRIVACIDADE -->
          <div class="tab-pane fade" id="tab-privacidade" role="tabpanel">
            <p class="text-muted" style="font-size: 0.82rem;">Última atualização: abril de 2026 &nbsp;|&nbsp; Em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong></p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">1. Controlador dos Dados</h6>
            <p>A <strong>Crescer Verde – Plataforma de Jogos de Sustentabilidade Infantil</strong> é a controladora responsável pelo tratamento dos dados pessoais coletados nesta plataforma.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">2. Dados Coletados</h6>
            <p>Coletamos os seguintes dados pessoais:</p>
            <ul>
              <li><strong>Dados de cadastro:</strong> nome completo e endereço de e-mail;</li>
              <li><strong>Dados de uso:</strong> jogos acessados, progresso, respostas de quizzes e certificados obtidos;</li>
              <li><strong>Dados técnicos:</strong> data e hora de acesso (registros de servidor).</li>
            </ul>
            <p>Não coletamos dados de pagamento, geolocalização precisa, documentos de identidade ou quaisquer outros dados sensíveis.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">3. Finalidade do Tratamento</h6>
            <p>Seus dados são utilizados para:</p>
            <ul>
              <li>Autenticar e identificar você na plataforma;</li>
              <li>Registrar e exibir seu progresso nos jogos;</li>
              <li>Emitir certificados de conclusão;</li>
              <li>Melhorar continuamente o conteúdo e a experiência educacional;</li>
              <li>Permitir a recuperação de senha mediante solicitação.</li>
            </ul>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">4. Base Legal</h6>
            <p>O tratamento de dados é realizado com base no <strong>consentimento</strong> do titular (ou de seu responsável legal, no caso de menores) e no <strong>legítimo interesse</strong> da plataforma em fornecer o serviço educacional contratado.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">5. Compartilhamento de Dados</h6>
            <p>Seus dados <strong>não são vendidos ou compartilhados com terceiros</strong> para fins comerciais. Podemos compartilhar dados com:</p>
            <ul>
              <li>Provedores de infraestrutura técnica (ex.: banco de dados em nuvem), sob obrigações de confidencialidade;</li>
              <li>Autoridades competentes, quando exigido por lei.</li>
            </ul>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">6. Armazenamento e Segurança</h6>
            <p>Os dados são armazenados em servidores com proteção adequada. Senhas são armazenadas em formato criptografado (hash bcrypt) e jamais em texto claro. Os tokens de autenticação têm validade de 1 hora. Os tokens de redefinição de senha expiram em 1 hora após a geração.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">7. Seus Direitos (LGPD – Art. 18)</h6>
            <p>Você tem direito a:</p>
            <ul>
              <li>Confirmar a existência de tratamento de seus dados;</li>
              <li>Acessar os dados que mantemos sobre você;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar a exclusão dos seus dados (mediante exclusão de conta);</li>
              <li>Revogar o consentimento a qualquer momento;</li>
              <li>Obter informações sobre entidades com quem compartilhamos seus dados.</li>
            </ul>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">8. Retenção de Dados</h6>
            <p>Seus dados são mantidos enquanto a conta estiver ativa. Após solicitação de exclusão, os dados são removidos em até 30 dias, salvo obrigações legais de retenção.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">9. Cookies</h6>
            <p>Esta plataforma não utiliza cookies de rastreamento ou publicidade. Utilizamos apenas o armazenamento local do navegador (localStorage) para manter sua sessão autenticada.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">10. Contato</h6>
            <p>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato conosco pelo e-mail: <strong>privacidade@crescerverde.com.br</strong></p>
          </div>

          <!-- ACESSIBILIDADE -->
          <div class="tab-pane fade" id="tab-acessibilidade" role="tabpanel">
            <p class="text-muted" style="font-size: 0.82rem;">Última atualização: abril de 2026</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">Compromisso com a Acessibilidade</h6>
            <p>A Crescer Verde acredita que a educação ambiental deve ser acessível a todos. Trabalhamos para garantir que nossa plataforma seja utilizável pelo maior número possível de pessoas, independentemente de suas habilidades ou necessidades.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">Recursos de Acessibilidade</h6>
            <ul>
              <li><strong>VLibras:</strong> todas as páginas da plataforma contam com o widget oficial VLibras do Governo Federal, que traduz o conteúdo textual para a Língua Brasileira de Sinais (LIBRAS) em tempo real;</li>
              <li><strong>Contraste e tipografia:</strong> utilizamos paleta de cores com contraste adequado e tamanhos de fonte legíveis;</li>
              <li><strong>Navegação por teclado:</strong> os elementos interativos são acessíveis via teclado;</li>
              <li><strong>Textos alternativos:</strong> imagens relevantes possuem descrições (atributo <code>alt</code>) para leitores de tela.</li>
            </ul>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">Sobre o VLibras</h6>
            <p>O <strong>VLibras</strong> é uma suíte de ferramentas gratuitas e de código aberto, desenvolvida pelo Ministério da Economia em parceria com a UFPB, que traduz conteúdos digitais em Português para LIBRAS. Para utilizá-lo, clique no ícone do personagem no canto inferior da tela.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">Padrões Seguidos</h6>
            <p>Buscamos conformidade com as diretrizes <strong>WCAG 2.1 (nível AA)</strong> e com o <strong>eMAG – Modelo de Acessibilidade em Governo Eletrônico</strong>, referência nacional para acessibilidade digital.</p>

            <h6 class="fw-bold mt-3" style="color:#1b5e20;">Reporte um Problema</h6>
            <p>Encontrou alguma barreira de acessibilidade? Fale conosco em <strong>acessibilidade@crescerverde.com.br</strong> — sua contribuição é essencial para melhorarmos continuamente.</p>
          </div>

        </div>
      </div>
      <div class="modal-footer border-0 pt-0">
        <small class="text-muted w-100 text-center">Crescer Verde &copy; 2026 &mdash; Plataforma de Jogos de Sustentabilidade Infantil</small>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(modal.firstElementChild);
  }

  function attachLinkHandlers() {
    document.querySelectorAll('[data-terms-tab]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var tab = this.getAttribute('data-terms-tab');
        injectTermsModal();

        var modalEl = document.getElementById('termsModal');
        var modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);

        // Ativa a aba correta antes de abrir
        var tabBtn = document.getElementById('tab-' + tab + '-btn');
        if (tabBtn) {
          var bsTab = bootstrap.Tab.getInstance(tabBtn) || new bootstrap.Tab(tabBtn);
          bsTab.show();
        }
        modalInstance.show();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectTermsModal();
    attachLinkHandlers();
  });
})();
