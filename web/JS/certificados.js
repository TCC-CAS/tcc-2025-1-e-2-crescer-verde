let currentUser;

document.addEventListener("DOMContentLoaded", async () => {
    var certificates = [];
    let coursesMap = {};
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        document.getElementById("certificates-container").innerHTML = `
            <div class="col-12 text-center text-muted">
                <p>Você precisa estar logado para ver seus certificados.</p>
                <a href="/HTML/login.html" class="btn btn-primary mt-2">Fazer Login</a>
            </div>
        `;
        return;
    }


    try {
        currentUser = JSON.parse(userStr);
    } catch (e) {
        console.error(e);
        return;
    }

    try {
        // Buscar cursos para poder relacionar o courseId com o nome do curso
        const coursesRes = await fetch(API_BASE + "/api/courses");
        if (coursesRes.ok) {
            const coursesData = await coursesRes.json();
            if (coursesData && coursesData.courses) {
                coursesData.courses.forEach(c => {
                    coursesMap[c._id] = c.title;
                });
            }
        }

        // Buscar certificados do usuário
        const certRes = await fetch(`${API_BASE}/api/certificates/user/${currentUser.id}`);
        if (certRes.ok) {
            certificates = await certRes.json();
            const container = document.getElementById("certificates-container");

            if (certificates.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center text-muted mt-4">
                        <p style="font-size: 1.2rem;">Você ainda não possui nenhum certificado.</p>
                        <a href="/HTML/jogos.html" class="btn btn-outline-success mt-2">Explorar Jogos</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = "";
            console.log(certificates);
            certificates.forEach(cert => {
                const courseName = coursesMap[cert.courseId] || "Curso Indisponível";
                const issueDate = new Date(cert.createdAt || new Date()).toLocaleDateString("pt-BR");

                const cardHtml = `
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 shadow-sm border-0" style="border-radius: 12px; overflow: hidden;">
                            <div class="card-header bg-success text-white text-center py-3">
                                <h5 class="card-title mb-0" style="font-size: 1.1rem; font-weight: 600;">${courseName}</h5>
                            </div>
                            <div class="card-body bg-light text-center d-flex flex-column justify-content-center">
                                <p class="mb-0 text-muted" style="font-size: 0.9rem;">
                                    <strong>Emitido em:</strong> ${issueDate}
                                </p>
                            </div>
                            <div class="card-footer bg-white border-0 text-center pb-3 pt-0">
                                <button class="btn btn-sm btn-outline-success px-4" style="border-radius: 20px;" onclick="window.location.href='/HTML/jogo-detalhes.html?id=${cert.courseId}'">
                                    Ir para o Curso
                                </button>
                                <button class="btn btn-sm btn-outline-success px-4" style="border-radius: 20px;" onclick="window.printCertificate('${cert._id}')">
                                    Imprimir Certificado
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += cardHtml;
            });
        }
    } catch (err) {
        console.error(err);
        document.getElementById("certificates-container").innerHTML = `
            <div class="col-12 text-center text-danger mt-4">
                <p>Erro ao carregar certificados. Tente novamente mais tarde.</p>
            </div>
        `;
    }
});


window.printCertificate = async function (certificateId) {
    console.log("procurando por certificado: " + certificateId);
    var certRes = await fetch(`${API_BASE}/api/certificates/${certificateId}`);

    if (!certRes.ok) {
        alert("Certificado não encontrado");
        return;
    }

    var certificate = await certRes.json();

    const res = await fetch("/HTML/template-certificate.html");
    if (!res.ok) throw new Error("Template não encontrado");
    let templateText = await res.text();

    // Verificando se as propriedades existem caso o populate falhe
    const courseTitle = certificate.course ? certificate.course.title : "Curso";
    const userName = certificate.user ? certificate.user.name : "Aluno";
    const dateStr = new Date(certificate.date || certificate.createdAt || Date.now()).toLocaleDateString("pt-BR");

    templateText = templateText.replace("[NOME_ALUNO]", userName);
    templateText = templateText.replace("[NOME_CURSO]", courseTitle);
    templateText = templateText.replace("[DATA_CONCLUSAO]", dateStr);

    const scriptPrint = `<script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
          window.close();
        }, 500);
      };
    </script>`;

    if (templateText.includes("</body>")) {
        templateText = templateText.replace("</body>", scriptPrint + "</body>");
    } else {
        templateText += scriptPrint;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(templateText);
        printWindow.document.close();
    } else {
        alert("Por favor, permita pop-ups para imprimir o certificado.");
    }
}