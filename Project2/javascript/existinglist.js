document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからログイン中のユーザー情報を取得
    const loggedInUser = localStorage.getItem('loggedInUserEmail'); // ローカルストレージキーに基づいて取得
    const emailDisplay = document.getElementById('email-display');
    // const loginButton = document.getElementById('login-button');
    //const cafeListData = localStorage.getItem('cafeListData'); 
    saveToList();

    if (loggedInUser) {
        // ログインしたメールアドレスのみ表示 
        emailDisplay.textContent = `${loggedInUser}`;
        emailDisplay.style.display = 'block'; // メールを表示
        // loginButton.style.display = 'none';  // ログインボタンを隠す
    } else {
        emailDisplay.style.display = 'none'; // メールを隠す
        // loginButton.style.display = 'block'; // ログインボタンを表示
    }
});

// メインへ
function goToMain() {
    window.location.href = 'kobetop.html';
}

// EnterキーとSpacebarキーの基本動作を防ぐ関数
function preventDefaultForModal(event) {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault();
    }
}

// ポップアップでEnterキーとスペースキーを押したときモーダルを閉じる関数
function handleModalKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        closeModal();
    }
}

// function confirmDelete() {
//     const checkboxes = document.querySelectorAll('.delete-checkbox');
//     let selectedItems = [];

//     checkboxes.forEach((checkbox, index) => {
//         if (checkbox.checked) {
//             selectedItems.push(index);
//         }
//     });

//     if (selectedItems.length === 0) {
//         showModal('削除する項目を選択してください。');
//         return;
//     }

//     showModal('選択された項目を削除しますか？', true);
// }

function deleteSelectedItems(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('.delete-checkbox');

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkbox.parentElement.remove();
        }
    });

    closeModal();
}

function showModal(message, confirm = false) {
    document.getElementById('alert-message').textContent = message;
    document.getElementById('custom-alert').style.display = 'block';

    const modalContent = document.querySelector('.modal-content');

    const buttons = document.querySelectorAll('.modal-content button');
    buttons.forEach(button => button.remove());

    if (confirm) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('modal-buttons');

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '確認';
        confirmButton.onclick = function(event) {
            event.preventDefault();
            deleteSelectedItems(event);
        };
        buttonContainer.appendChild(confirmButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'キャンセル';
        cancelButton.onclick = function(event) {
            event.preventDefault();
            closeModal();
        };
        buttonContainer.appendChild(cancelButton);

        modalContent.appendChild(buttonContainer);
    } else {
        const okButton = document.createElement('button');
        okButton.textContent = '確認';
        okButton.onclick = function(event) {
            event.preventDefault();
            closeModal();
        };
        modalContent.appendChild(okButton);
    }

    // モーダルが開いているとき基本動作を防ぐイベントリスナー追加
    window.addEventListener('keydown', preventDefaultForModal);
    window.addEventListener('keydown', handleModalKeydown); // Enterキーとスペースキー処理リスナー追加
}

function closeModal(event) {
    if (event) {
        event.preventDefault();
    }

    document.getElementById('custom-alert').style.display = 'none';

    const buttons = document.querySelectorAll('.modal-content button');
    buttons.forEach(button => button.remove());

    // モーダルが閉じるときイベントリスナー削除
    window.removeEventListener('keydown', preventDefaultForModal);
    window.removeEventListener('keydown', handleModalKeydown); // Enterキーとスペースキー処理リスナー削除
}

function saveToList() {
    const formData = new FormData();
    fetch("http://54.180.109.141:8006/getCafeList", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: formData // 必要なデータがあればここに追加
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("ネットワークの応答が良くありません。");
        }
        return response.json();
    })
    .then(result => {
        console.log(result.cafes); // サーバーから受け取ったカフェ情報を出力

        // ボタンを動的に生成する関数呼び出し
        createButtonsFromData(result);
    })
    .catch(error => {
        console.error("エラー発生:", error);
        alert("カフェ情報を取得中にエラーが発生しました。");
    });
}

function createButtonsFromData(data) {
    const buttonContainer = document.getElementById('buttonContainer');

    data.cafes.forEach((cafe, index) => {
        // ボタン要素生成
        const button = document.createElement('button');
        button.className = 'list-button';
        button.textContent = `list ${index + 1}`;

        // ボタンにクリックイベント追加（必要に応じて修正）
        button.addEventListener('click', () => {
            toggleCafeDetails(button, cafe); 
            // 各カフェの詳細情報を表示する関数呼び出しまたはページ移動
            // 例: showCafeDetails(cafe);
        });

        // ボタンをコンテナに追加
        buttonContainer.appendChild(button);
    });
}

// カフェ詳細情報をトグルする関数

function toggleCafeDetails(button, cafe) {
    // 既に詳細情報があるか確認
    let details = button.nextElementSibling;

    if (details && details.classList.contains('cafe-details')) {
        // 詳細情報が既にあれば削除
        details.remove();
    } else {
        // 詳細情報がなければ追加
        details = document.createElement('div');
        details.className = 'cafe-details';
        details.innerHTML = `
            <p>Cafe Name 1: <span class="highlight-cafe-name"><a href="${cafe.URL1}" target="_blank">${cafe.cafeName1}</span></a></p>
            <p>Cafe Name 2: <span class="highlight-cafe-name"><a href="${cafe.URL2}" target="_blank">${cafe.cafeName2}</span></a></p>
            <p>Cafe Name 3: <span class="highlight-cafe-name"><a href="${cafe.URL3}" target="_blank">${cafe.cafeName3}</span></a></p>
        `;
        
        // ボタンのすぐ下に詳細情報を追加
        button.after(details);
    }
}
