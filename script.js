// Variáveis globais
let diaAtualSelecionado = null;
let indexAtualEdicao = null;
let currentYear = null;
let currentMonth = null; 

const monthNames = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

function renderCalendar(year, month) {
  currentYear = year;
  currentMonth = month;
  const label = document.getElementById("monthYear");
  if (label) {
    label.textContent = `${monthNames[month]} ${year}`;
  }

  const grid = document.getElementById("calendarGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  dayNames.forEach((name) => {
    const hdr = document.createElement("div");
    hdr.style.textAlign = "center";
    hdr.style.fontWeight = "bold";
    hdr.style.padding = "8px";
    hdr.textContent = name;
    grid.appendChild(hdr);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.setAttribute("data-day", day);
    cell.style.cssText =
      "aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; " +
      "border: 1px solid #ddd; border-radius: 6px; background-color: #f8f9fa; cursor: pointer;";
    cell.textContent = day;
    cell.addEventListener("click", function () {
      document.querySelectorAll(".calendar-day.selected").forEach((d) => d.classList.remove("selected"));
      this.classList.add("selected");
      mostrarAtividades(day);
    });
    grid.appendChild(cell);
  }
}

function prevMonth() {
  let m = currentMonth - 1;
  let y = currentYear;
  if (m < 0) {
    m = 11;
    y -= 1;
  }
  renderCalendar(y, m);
}

function nextMonth() {
  let m = currentMonth + 1;
  let y = currentYear;
  if (m > 11) {
    m = 0;
    y += 1;
  }
  renderCalendar(y, m);
}


// Persistência com localStorage
function saveToStorage() {
  localStorage.setItem("actividades", JSON.stringify(actividades));
}

function loadFromStorage() {
  const data = localStorage.getItem("actividades");
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Falha ao analisar dados do storage", e);
    }
  }
  return null;
}

// oil entries storage
function saveOleo() {
  localStorage.setItem("oleoEntries", JSON.stringify(oleoEntries));
}

function loadOleo() {
  const data = localStorage.getItem("oleoEntries");
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Falha ao analisar oleoEntries", e);
    }
  }
  return [];
}


let actividades = loadFromStorage() || {};  
let oleoEntries = loadOleo();
let editingOleoIndex = null; 

// recalc and render the summary fields
function updateOilSummary() {
  const totalLitros = oleoEntries.reduce((sum, e) => sum + (e.litros || 0), 0);
  const totalProfit = oleoEntries.reduce(
    (sum, e) => sum + (e.litros || 0) * (e.preco || 0) * 4,
    0,
  );
  document.getElementById("totalLitros").textContent = totalLitros.toFixed(2);
  document.getElementById("totalProfit").textContent = totalProfit.toFixed(2);
}



function resetActivities() {
  actividades = {};
  localStorage.removeItem('actividades');
  mostrarAtividades(diaAtualSelecionado || new Date().getDate());
}


// função de mostrar as atividades
function mostrarAtividades(dayNum) {
  diaAtualSelecionado = dayNum;
  const container = document.querySelector(".activities-container");
  const dayActivities = actividades[dayNum] || [];

  if (dayActivities.length > 0) {
    const monthLabel = currentMonth != null ? monthNames[currentMonth] : "";
    let html = "<h5>Dia " + dayNum + " de " + monthLabel + "</h5>";
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
    saveToStorage();
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

  // salvar no storage
  saveToStorage();

  alert("Atividade atualizada com sucesso!");
  fecharModalEdicao();
  mostrarAtividades(dia);
}

// DOM manipula todo o HTML
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth(); 
  renderCalendar(currentYear, currentMonth);

  const hoje = today.getDate();
  const todayCell = document.querySelector(`.calendar-day[data-day="${hoje}"]`);
  if (todayCell) {
    todayCell.classList.add("selected");
    mostrarAtividades(hoje);
  }

  updateOilSummary();



  document.getElementById("btnOleo").addEventListener("click", function (e) {
    e.preventDefault();
    abrirModal("activity", "Coletas de óleo");
  });

  document.getElementById("btnControleOleo").addEventListener("click", function (e) {
    e.preventDefault();
    editingOleoIndex = null; 
    abrirModal("oilControl", "Controle do óleo");
  });


  document.getElementById("btnVerRegistros").addEventListener("click", function () {
    openOleoRecords();
  });

});


function abrirModal(mode, title) {
  const overlay = document.getElementById("overlay");
  const modalTitle = document.getElementById("modalTitle");
  const body = document.getElementById("formColetaBody");
  const submitBtn = document.getElementById("formSubmitBtn");

  modalTitle.innerText = "Cadastre " + title.toLowerCase();

  if (mode === "oilControl") {
    body.innerHTML = `
      <div class="form-group">
        <label>Empreendimento</label>
        <input type="text" id="inputEmpreendimento" required />
      </div>
      <div class="form-group">
        <label>Litros</label>
        <input type="number" id="inputLitros" step="0.01" required />
      </div>
      <div class="form-group">
        <label>R$ do litro</label>
        <input type="number" id="inputPreco" step="0.01" required />
      </div>
    `;
    if (editingOleoIndex !== null && oleoEntries[editingOleoIndex]) {
      const e = oleoEntries[editingOleoIndex];
      setTimeout(() => {
        document.getElementById("inputEmpreendimento").value = e.empreendimento;
        document.getElementById("inputLitros").value = e.litros;
        document.getElementById("inputPreco").value = e.preco;
      }, 0);
    }

    document.getElementById("formColeta").onsubmit = function (e) {
      e.preventDefault();
      const emp = document.getElementById("inputEmpreendimento").value;
      const litros = parseFloat(document.getElementById("inputLitros").value);
      const preco = parseFloat(document.getElementById("inputPreco").value);
      if (!emp || isNaN(litros) || isNaN(preco)) {
        alert("Preencha todos os campos!");
        return;
      }
      if (editingOleoIndex === null) {
        oleoEntries.push({ empreendimento: emp, litros, preco, date: new Date() });
      } else {
        oleoEntries[editingOleoIndex] = { empreendimento: emp, litros, preco, date: oleoEntries[editingOleoIndex].date };
      }
      saveOleo();
      updateOilSummary();
      if (document.getElementById("modalOleoRecords").classList.contains("active")) {
        renderOleoTable();
      }
      alert("Registro de óleo salvo!");
      fecharModal();
      editingOleoIndex = null;
    };
    submitBtn.textContent = editingOleoIndex === null ? "Salvar" : "Atualizar";
  } else {
    body.innerHTML = `
      <div class="form-group">
        <label>Título</label>
        <input
          type="text"
          id="inputTitulo"
          placeholder="Ex: Coleta na região norte"
          required
        />
      </div>
      <div class="form-group">
        <label>Descrição Interna</label>
        <textarea
          id="inputDescricaoInterna"
          rows="3"
          placeholder="Detalhes adicionais da atividade"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label>Data</label>
        <input type="date" id="inputData" required />
      </div>
      <div class="form-group">
        <label>Hora</label>
        <input type="time" id="inputHora" required />
      </div>
    `;

    document.getElementById("formColeta").onsubmit = function (event) {
      event.preventDefault();

      const titulo = document.getElementById("inputTitulo").value;
      const descricaoInterna = document.getElementById("inputDescricaoInterna").value;
      const data = document.getElementById("inputData").value;
      const hora = document.getElementById("inputHora").value;

      if (!titulo || !descricaoInterna || !data || !hora) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      const dataParts = data.split("-");
      const dia = parseInt(dataParts[2]);

      const novaAtividade = {
        titulo: titulo,
        descricao: descricaoInterna,
        hora: hora,
        dia: dia,
      };

      if (actividades[dia]) {
        actividades[dia].push(novaAtividade);
      } else {
        actividades[dia] = [novaAtividade];
      }

      saveToStorage();

      document.getElementById("inputTitulo").value = "";
      document.getElementById("inputDescricaoInterna").value = "";
      document.getElementById("inputData").value = "";
      document.getElementById("inputHora").value = "";

      alert("Atividade cadastrada com sucesso!");

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
    };
    submitBtn.textContent = "Salvar Atividade";
  }

  overlay.classList.add("active");
}

function fecharModal() {
  document.getElementById("overlay").classList.remove("active");
  editingOleoIndex = null;
}

// registros modal helpers
function openOleoRecords() {
  renderOleoTable();
  document.getElementById("modalOleoRecords").classList.add("active");
}
function fecharModalOleoRecords() {
  document.getElementById("modalOleoRecords").classList.remove("active");
}

function renderOleoTable() {
  const container = document.getElementById("oleoTableContainer");
  if (!container) return;
  if (oleoEntries.length === 0) {
    container.innerHTML = "<p>Nenhum registro cadastrado.</p>";
    return;
  }
  let html = "<table class='table table-sm'><thead><tr>" +
             "<th>Empresa</th><th>Litros</th><th>Preço</th><th>Data</th><th>Ações</th></tr></thead><tbody>";
  oleoEntries.forEach((e, i) => {
    const dateStr = new Date(e.date).toLocaleString();
    html += `<tr><td>${e.empreendimento}</td><td>${e.litros}</td><td>${e.preco}</td><td>${dateStr}</td><td>` +
            `<button class="btn btn-sm btn-secondary me-1" onclick="editarOleo(${i})">✎</button>` +
            `<button class="btn btn-sm btn-danger" onclick="deletarOleo(${i})">✕</button>` +
            `</td></tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

function editarOleo(index) {
  editingOleoIndex = index;
  abrirModal("oilControl", "Controle do óleo");
}

function deletarOleo(index) {
  if (confirm("Deseja remover este registro?")) {
    oleoEntries.splice(index, 1);
    saveOleo();
    updateOilSummary();
    renderOleoTable();
  }
}

