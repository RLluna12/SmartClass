// faltasDetalhes.js
const apiUrlNota = '/notas';
const apiUrlAluno = '/alunos';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const alunoId = urlParams.get('id_aluno');
  const id_disciplina = urlParams.get('id_disciplina');
  const id_perfil = urlParams.get('id_perfil');
  const idNotasFaltas = urlParams.get('idNotasFaltas');

  // Aluno情報を取得
  fetchAlunoInfo(alunoId);
  
  // Notas情報を取得
  fetchNotaInfo(idNotasFaltas);

  // Notas情報を取得
  fetchNotaDetalhesInfo(alunoId, id_disciplina, id_perfil);

  // フォームの送信イベント
  /* document.getElementById('aluno-list').addEventListener('submit', (event) => {
    event.preventDefault();
    updateNota(idNotasFaltas, alunoId, id_disciplina, year, semestre);
  }); */
});

function fetchAlunoInfo(alunoId) {
  fetch(`${apiUrlAluno}/${alunoId}`)
    .then(response => response.json())
    .then(data => {
      if (data) {
        // データカードに生徒情報を挿入
        document.getElementById('card-nomeAluno').textContent = data.nome_usuario || 'Não disponível';
        document.getElementById('card-matriculaAluno').textContent = formatDate(data.data_matricula) || '-';
      } else {
        console.error('No Aluno data found.');
      }
    })
    .catch(error => console.error('Error fetching Aluno:', error));
}

async function fetchNotaInfo(id_notas_faltas) {
  try {
    const response = await fetch(`/notasByid_notas_faltas/${id_notas_faltas}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const notaInfo = data[0];
      // データカードにNotas情報を挿入
      document.getElementById('card-disciplina').textContent = notaInfo.nome_disciplina || '0';
      document.getElementById('card-n1Aluno').textContent = notaInfo.N1 || '-';
      document.getElementById('card-apAluno').textContent = notaInfo.AP || '-';
      document.getElementById('card-aiAluno').textContent = notaInfo.AI || '-';
      document.getElementById('card-anoAluno').textContent = notaInfo.ano_academico || '-';
      document.getElementById('card-semestreAluno').textContent = notaInfo.semestre || '-';

      // カードを表示
      document.getElementById('data-card-container').style.display = 'block';
    } else {
      console.error('No Nota data found.');
    }
  } catch (error) {
    console.error('Error fetching Nota:', error);
  }
}


function fetchNotaDetalhesInfo(id_aluno, id_disciplina, id_perfil) {
  fetch(`/notasByid_notas_faltas/${id_aluno}/${id_disciplina}`)
    .then(response => response.json())
    .then(data => {
      const listaContainer = document.getElementById('notaList'); // リスト表示用のコンテナを指定
      listaContainer.innerHTML = ''; // 既存のリストをクリア

      if (data && data.length > 0) {
        data.forEach(notaInfo => {
          const listItem = document.createElement('li');

          // 欠席日のテキスト
          const text = document.createTextNode(`Data: ${formatDate(notaInfo.data_falta)}`);
          listItem.appendChild(text);


          // 削除ボタン（特定の id_perfil のみ表示）
          if ([1, 2, 5].includes(id_perfil)) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'excluir';
            deleteButton.className = 'btn btn-danger btn-lg shadow-sm'; // Bootstrapのスタイルを追加
            deleteButton.innerHTML = '<i class="bi bi-trash"></i> excluir'; // アイコンを追加
            deleteButton.addEventListener('click', () => {
              console.log("クリック:" + clicked)
              const eventDay = events.find(event => event.date === clicked);
              console.log("イベント日：" + eventDay)
              if (eventDay && confirm('Tem certeza de que deseja excluir este evento?')) {
                deleteEvent(eventDay.id_evento);
              }
            });

            listItem.appendChild(deleteButton);
          }

          listaContainer.appendChild(listItem);
        });
      } else {
        // 欠席がない場合に「Sem falta」を表示
        const noFaltaMessage = document.createElement('li');
        noFaltaMessage.textContent = 'Sem falta';
        listaContainer.appendChild(noFaltaMessage);
      }
    })
    .catch(error => console.error('Error fetching Nota:', error));
}


// 削除ボタンがクリックされたときに呼び出す関数
async function deleteFalta(id_faltas_detalhes, idNotasFaltas) {
  try {
    const response = await fetch(`/delete/${id_faltas_detalhes}`, { method: 'DELETE' });
    const result = await response.json();

    if (result.message) {
      console.log(result.message);
      await fetchNotaInfo(idNotasFaltas); // リストを再取得して更新
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error('Error deleting falta:', error);
  }
}


// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}