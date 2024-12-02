let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// variáveis do modal:
const newEvent = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
// --------
const calendar = document.getElementById('calendar'); // div calendar
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']; // array with weekdays

let isEditing = false; // flag to indicate if we are editing an event

function getUserFromPage() {
  const user = document.getElementById('user-info');
  const id_perfil = user.getAttribute('data-id-perfil');
  const id_responsavel = user.getAttribute('data-id');
  const nome_usuario = user.getAttribute('data-nome-usuario');

  return {
    id_responsavel: parseInt(id_responsavel, 10),
    id_perfil: parseInt(id_perfil, 10),
    nome_usuario: nome_usuario
  };
}

// funções
function openModal(date) {
  clicked = date;
  const eventDay = events.find((event) => event.date === clicked);

  if (eventDay) {
    document.getElementById('eventText').innerText = eventDay.title;
    deleteEventModal.style.display = 'block';
    // 削除ボタンにイベントIDを設定
    document.getElementById('deleteButton').dataset.eventId = eventDay.id_evento;
  } else {
    newEvent.style.display = 'block';
  }

  backDrop.style.display = 'block';
}


async function load() {
  const date = new Date();

  // APIからイベントデータを取得
  try {
    const response = await fetch('/calendario/listar');
    const data = await response.json();
    events = data.map(event => ({
      date: `${new Date(event.data_evento).getDate()}/${new Date(event.data_evento).getMonth() + 1}/${new Date(event.data_evento).getFullYear()}`,
      title: event.nome_evento,
      id_evento: event.id_evento,
    }));
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }

  // 月とナビゲーションの処理
  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const daysMonth = new Date(year, month + 1, 0).getDate();
  const firstDayMonth = new Date(year, month, 1);

  const dateString = firstDayMonth.toLocaleDateString('pt-br', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddinDays = weekdays.indexOf(dateString.split(', ')[0]);

  // 月と年を表示
  document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br', { month: 'long' })}, ${year}`;

  calendar.innerHTML = '';

  // 各日をカレンダーに描画
  for (let i = 1; i <= paddinDays + daysMonth; i++) {
    const dayS = document.createElement('div');
    dayS.classList.add('day');

    const dayString = `${i - paddinDays}/${month + 1}/${year}`;

    if (i > paddinDays) {
      dayS.innerText = i - paddinDays;

      // イベントデータがある場合は表示
      const eventDay = events.find(event => event.date === dayString);
      if (i - paddinDays === day && nav === 0) {
        dayS.id = 'currentDay';
      }
      if (eventDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventDay.title;
        dayS.appendChild(eventDiv);
      }

      dayS.addEventListener('click', () => openModal(dayString));
    } else {
      dayS.classList.add('padding');
    }

    calendar.appendChild(dayS);
  }
}


function closeModal() {
  eventTitleInput.classList.remove('error');
  newEvent.style.display = 'none';
  backDrop.style.display = 'none';
  deleteEventModal.style.display = 'none';

  eventTitleInput.value = ''; // 入力フィールドをクリア
  clicked = null;
  isEditing = false;
  load();
}

async function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');


    // clickedをフォーマット
    const formattedDate = formatDate(clicked);

    // 有効な日付かチェック
    if (isNaN(Date.parse(formattedDate))) {
      console.error('Invalid formatted date:', formattedDate);
      alert('A data está incorreta');
      return;
    }

    const newEvent = {
      date: formattedDate,
      title: eventTitleInput.value,
    };

    try {
      const response = await fetch('/calendario/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('イベントの保存に失敗しました');
      }

      const createdEvent = await response.json();
      events.push(createdEvent); // ローカルに追加
      closeModal();
      load(); // カレンダーをリロード
    } catch (error) {
      console.error(error);
      alert('イベントの保存中にエラーが発生しました');
    }
  } else {
    eventTitleInput.classList.add('error');
  }
}

async function deleteEvent(eventId) {
  try {
    // DELETEリクエストを送信
    const response = await fetch(`/calendario/deletar/${eventId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Falha ao excluir evento');
    }

    const result = await response.json();

    // サーバーの応答が成功した場合、イベントリストを更新
    const eventIndex = events.findIndex(event => event.id_evento === eventId);
    if (eventIndex !== -1) {
      events.splice(eventIndex, 1); // 配列から削除
      closeModal();
      load(); // カレンダーをリロード
    } else {
      // 削除済みのイベントがローカルデータに存在しない場合
      console.warn('イベントはすでに削除されているか見つかりません');
      closeModal();
      load(); // カレンダーをリロード
    }
  } catch (error) {
    console.error(error);
    alert('Ocorreu um erro ao excluir o evento');
  }
}


function editEvent() {
  const eventDay = events.find((event) => event.date === clicked);
  if (eventDay) {
    eventTitleInput.value = eventDay.title;
    newEvent.style.display = 'block';
    deleteEventModal.style.display = 'none';
    isEditing = true; // Set the flag to indicate we are editing
  }
}

// botões
function buttons() {
  const user = getUserFromPage() 
  const deleteButton = document.getElementById('deleteButton');
  const saveButton = document.getElementById('saveButton');

  // Deletar ボタンの制御（既に実装済み）
  if ([1, 2, 5].includes(user.id_perfil)) {
    deleteButton.style.display = 'block';
    deleteButton.addEventListener('click', () => {
      const eventId = deleteButton.dataset.eventId;
      if (eventId) {
        deleteEvent(eventId); // 正しいイベントIDを渡す
      } else {
        console.error('ID do evento a ser excluído não encontrado');
      }
    });
  } else {
    deleteButton.style.display = 'none';
  }

  // Salvar ボタンの制御
  if ([1, 2, 5].includes(user.id_perfil)) {
    saveButton.style.display = 'block';
    saveButton.addEventListener('click', () => saveEvent());
  } else {
    saveButton.style.display = 'none'; // 権限がない場合は非表示
  }

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('cancelButton').addEventListener('click', () => closeModal());
  document.getElementById('closeButton').addEventListener('click', () => closeModal());
}
/* document.getElementById('editButton').addEventListener('click', () => editEvent());  */// Botão de Editar



buttons();
load();
function formatDate(clicked) {
  const [day, month, year] = clicked.split('/'); // 日/月/年を分割
  return `${year}-${month}-${day}`; // 年-月-日の形に変換
}