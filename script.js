// Variáveis globais
let diaAtualSelecionado = null;
let indexAtualEdicao = null;

// Armazenar atividades como objetos (título + descrição detalhada)
const actividades = {
  1: [
    {
      titulo: "Planejamento",
      descricao: "Reunião de planejamento",
      hora: "09:00",
      dia: 1,
    },
    { titulo: "Óleo", descricao: "Coleta de óleo", hora: "14:00", dia: 1 },
  ],
  5: [
    { titulo: "Água", descricao: "Inspeção de água", hora: "10:00", dia: 5 },
    {
      titulo: "Relatório",
      descricao: "Relatório mensal",
      hora: "15:30",
      dia: 5,
    },
  ],
  10: [
    { titulo: "Limpeza", descricao: "Limpeza de área", hora: "08:00", dia: 10 },
    {
      titulo: "Verificação",
      descricao: "Verificação ambiental",
      hora: "13:00",
      dia: 10,
    },
  ],
  15: [
    {
      titulo: "Treinamento",
      descricao: "Treinamento de equipe",
      hora: "09:00",
      dia: 15,
    },
    {
      titulo: "Amostra",
      descricao: "Coleta de amostra",
      hora: "16:00",
      dia: 15,
    },
  ],
  20: [
    {
      titulo: "Manutenção",
      descricao: "Manutenção de equipamentos",
      hora: "10:00",
      dia: 20,
    },
  ],
  25: [
    {
      titulo: "Avaliação",
      descricao: "Avaliação de impacto",
      hora: "14:00",
      dia: 25,
    },
    {
      titulo: "Documentação",
      descricao: "Documentação",
      hora: "15:00",
      dia: 25,
    },
  ],
  31: [
    {
      titulo: "Relatório final",
      descricao: "Relatório final do mês",
      hora: "16:00",
      dia: 31,
    },
  ],
};

// função de mostrar as atividades
function mostrarAtividades(dayNum) {
  diaAtualSelecionado = dayNum;
  const container = document.querySelector(".activities-container");
  const dayActivities = actividades[dayNum] || [];

  if (dayActivities.length > 0) {
    let html = "<h5>Dia " + dayNum + " de Março</h5>";
    html += "<ul>";

    dayActivities.forEach((atividade, index) => {
      html +=
        "<li class='atividade-item' onclick='verDetalhes(" +
        dayNum +
        ", " +
        index +
        ")'>";
      html += "<div class='atividade-content'>";
      html += "<span class='atividade-desc'>" + atividade.titulo + "</span>";
      html += "<span class='atividade-hora'>" + atividade.hora + "</span>";
      html += "</div>";
      html += "<div class='atividade-actions'>";
      html +=
        "<button class='btn-editar' onclick='abrirEdicao(event, " +
        dayNum +
        ", " +
        index +
        ")'>✎</button>";
      html +=
        "<button class='btn-deletar' onclick='deletarAtividade(event, " +
        dayNum +
        ", " +
        index +
        ")'>✕</button>";
      html += "</div>";
      html += "</li>";
    });

    html += "</ul>";
    container.innerHTML = html;
  } else {
    container.innerHTML = "<p>Nenhuma atividade programada para este dia</p>";
  }
}

// função para ver detalhes da atividade
function verDetalhes(dia, index) {
  const atividade = actividades[dia][index];
  abrirModalDetalhes(atividade, dia, index);
}

// função para abrir edição
function abrirEdicao(event, dia, index) {
  event.stopPropagation();
  const atividade = actividades[dia][index];
  abrirModalEdicao(atividade, dia, index);
}

// função para deletar atividade
function deletarAtividade(event, dia, index) {
  event.stopPropagation();
  if (confirm("Tem certeza que deseja deletar esta atividade?")) {
    actividades[dia].splice(index, 1);
    if (actividades[dia].length === 0) {
      delete actividades[dia];
    }
    mostrarAtividades(dia);
  }
}

function abrirModalDetalhes(atividade, dia, index) {
  const modal = document.getElementById("modalDetalhes");
  document.getElementById("detalhesTitulo").textContent =
    atividade.titulo || "";
  document.getElementById("detalhesDescricao").textContent =
    atividade.descricao || "";
  document.getElementById("detalhesHora").textContent = atividade.hora || "";
  document.getElementById("detalhesDia").textContent = dia;
  document.getElementById("btnEditarDetalhes").onclick = () =>
    abrirModalEdicao(atividade, dia, index);
  modal.classList.add("active");
}

function fecharModalDetalhes() {
  document.getElementById("modalDetalhes").classList.remove("active");
}

function abrirModalEdicao(atividade, dia, index) {
  fecharModalDetalhes();
  const modal = document.getElementById("modalEdicao");
  const inputTitulo = document.getElementById("editTitulo");
  const inputDescricao = document.getElementById("editDescricao");
  const inputHora = document.getElementById("editHora");

  inputTitulo.value = atividade.titulo || "";
  inputDescricao.value = atividade.descricao || "";
  inputHora.value = atividade.hora || "";

  indexAtualEdicao = index;
  diaAtualSelecionado = dia;

  document.getElementById("formEdicao").onsubmit = (e) =>
    salvarEdicao(e, dia, index);
  modal.classList.add("active");
}

function fecharModalEdicao() {
  document.getElementById("modalEdicao").classList.remove("active");
}

function salvarEdicao(event, dia, index) {
  event.preventDefault();

  const titulo = document.getElementById("editTitulo").value;
  const descricao = document.getElementById("editDescricao").value;
  const hora = document.getElementById("editHora").value;

  if (!titulo || !descricao || !hora) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  actividades[dia][index].titulo = titulo;
  actividades[dia][index].descricao = descricao;
  actividades[dia][index].hora = hora;

  alert("Atividade atualizada com sucesso!");
  fecharModalEdicao();
  mostrarAtividades(dia);
}

// DOM manipula todo o HTML
document.addEventListener("DOMContentLoaded", function () {
  const hoje = new Date().getDate();
  const dias = document.querySelectorAll(".calendar-day");

  // seleciona o dia atual
  dias.forEach((day) => {
    const dayNum = parseInt(day.getAttribute("data-day"));

    if (dayNum === hoje) {
      day.classList.add("selected");
      mostrarAtividades(dayNum);
    }

    // clique manual
    day.addEventListener("click", function () {
      document.querySelectorAll(".calendar-day.selected").forEach((d) => {
        d.classList.remove("selected");
      });

      this.classList.add("selected");

      const diaClicado = parseInt(this.getAttribute("data-day"));
      mostrarAtividades(diaClicado);
    });
  });

  document.getElementById("btnOleo").addEventListener("click", function (e) {
    e.preventDefault();
    abrirModal("Coleta de Óleo");
  });

  document.getElementById("btnAgua").addEventListener("click", function (e) {
    e.preventDefault();
    abrirModal("Coleta de Água");
  });

  // Salvar atividade no calendário
  document
    .getElementById("formColeta")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Pegar dados do formulário
      const titulo = document.getElementById("inputTitulo").value;
      const descricaoInterna = document.getElementById(
        "inputDescricaoInterna",
      ).value;
      const data = document.getElementById("inputData").value;
      const hora = document.getElementById("inputHora").value;

      if (!titulo || !descricaoInterna || !data || !hora) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      // Extrair o dia da data (formato AAAA-MM-DD)
      const dataParts = data.split("-");
      const dia = parseInt(dataParts[2]);

      // Criar objeto de atividade
      const novaAtividade = {
        titulo: titulo,
        descricao: descricaoInterna,
        hora: hora,
        dia: dia,
      };

      // Adicionar ao objeto actividades
      if (actividades[dia]) {
        actividades[dia].push(novaAtividade);
      } else {
        actividades[dia] = [novaAtividade];
      }

      // Limpar inputs
      document.getElementById("inputTitulo").value = "";
      document.getElementById("inputDescricaoInterna").value = "";
      document.getElementById("inputData").value = "";
      document.getElementById("inputHora").value = "";

      // Mostrar mensagem de sucesso
      alert("Atividade cadastrada com sucesso!");

      // Fechar modal
      fecharModal();

      // Selecionar e mostrar o dia no calendário
      const diaElement = document.querySelector(
        `.calendar-day[data-day="${dia}"]`,
      );
      if (diaElement) {
        document.querySelectorAll(".calendar-day.selected").forEach((d) => {
          d.classList.remove("selected");
        });
        diaElement.classList.add("selected");
        mostrarAtividades(dia);
      }
    });
});

function abrirModal(titulo) {
  const overlay = document.getElementById("overlay");
  const modalTitle = document.getElementById("modalTitle");

  modalTitle.innerText = titulo;
  overlay.classList.add("active");
}

function fecharModal() {
  document.getElementById("overlay").classList.remove("active");
}
