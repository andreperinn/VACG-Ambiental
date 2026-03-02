//exemplo
const actividades = {
    1: ['Reunião de planejamento - 09:00', 'Coleta de óleo - 14:00'],
    5: ['Inspeção de água - 10:00', 'Relatório mensal - 15:30'],
    10: ['Limpeza de área - 08:00', 'Verificação ambiental - 13:00'],
    15: ['Treinamento de equipe - 09:00', 'Coleta de amostra - 16:00'],
    20: ['Manutenção de equipamentos - 10:00'],
    25: ['Avaliação de impacto - 14:00', 'Documentação - 15:00'],
    31: ['Relatório final do mês - 16:00']
};

//DOM manipula todo o HTML
document.addEventListener('DOMContentLoaded', function() {

    const hoje = new Date().getDate();
    const dias = document.querySelectorAll('.calendar-day');
    const container = document.querySelector('.activities-container');

    // seleciona o dia atual
    dias.forEach(day => {
        const dayNum = parseInt(day.getAttribute('data-day'));

        if (dayNum === hoje) {
            day.classList.add('selected');
            mostrarAtividades(dayNum);
        }

        //clique manual
        day.addEventListener('click', function() {

            document.querySelectorAll('.calendar-day.selected').forEach(d => {
                d.classList.remove('selected');
            });

            this.classList.add('selected');

            const diaClicado = parseInt(this.getAttribute('data-day'));
            mostrarAtividades(diaClicado);
        });
    });

    //funcao de mostar as mostrar atividades
    function mostrarAtividades(dayNum) {

        const dayActivities = actividades[dayNum] || [];

        if (dayActivities.length > 0) {
            let html = '<h5>Dia ' + dayNum + ' de Março</h5>';
            html += '<ul>';

            dayActivities.forEach(atividade => {
                html += '<li>' + atividade + '</li>';
            });

            html += '</ul>';
            container.innerHTML = html;

        } else {
            container.innerHTML = '<p>Nenhuma atividade programada para este dia</p>';
        }
    }



    document.getElementById("btnOleo").addEventListener("click", function(e){
        e.preventDefault(); // impede de ir pra outra página
        abrirModal("Coleta de Óleo");
    });

    document.getElementById("btnAgua").addEventListener("click", function(e){
        e.preventDefault();
        abrirModal("Coleta de Água");
    });
});
function abrirModal(titulo) {
    const overlay = document.getElementById("overlay");
    const modalTitle = document.getElementById("modalTitle");

    modalTitle.innerText = titulo; // coloca o título no modal
    overlay.classList.add("active");
}

function fecharModal() {
    document.getElementById("overlay").classList.remove("active");
}









