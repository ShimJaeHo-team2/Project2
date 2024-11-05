document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからログイン中のユーザー情報を取得
    const loggedInUser = localStorage.getItem('loggedInUserEmail'); // ローカルストレージのキーに基づいて取得
    const emailDisplay = document.getElementById('email-display');
    const loginButton = document.getElementById('login-button');

    if (loggedInUser) {
        // ログインしたメールアドレスのみを表示
        emailDisplay.textContent = `${loggedInUser}`;
        emailDisplay.style.display = 'block'; // メールアドレスを表示
        loginButton.style.display = 'none';  // ログインボタンを隠す
    } else {
        emailDisplay.style.display = 'none'; // メールアドレスを隠す
        loginButton.style.display = 'block'; // ログインボタンを表示
    }
});

// メインに移動する関数
function goToMain() {
    window.location.href = 'kobetop.html';
}

// ログインページに移動する関数
function goToLogin() {
    window.location.href = 'kobelogin.html';
}

// 既存のリストを読み込むボタンがクリックされた時
function loadExistingList() {
    // showModal("既存のリストを読み込みます。"); //パスを書いたらコメントアウト
    window.location.href = 'existinglist.html'; //パス
}

// 新しいリストを作るボタンがクリックされた時
function createNewList() {
    // showModal("新しいリストを作ります。"); //パスを書いたらコメントアウト
    window.location.href = 'newlistA.html'; //パスを書き込む
}

// ユーザー定義モーダルを表示する関数
function showModal(message) {
    document.getElementById("modal-message").innerText = message;
    document.getElementById("custom-modal").style.display = "block";

    // キーボードイベントリスナーを追加
    document.addEventListener('keydown', handleKeydown);
}

// モーダルを閉じる関数
function closeModal() {
    document.getElementById("custom-modal").style.display = "none";

    // キーボードイベントリスナーを削除
    document.removeEventListener('keydown', handleKeydown);
}

// キーボードイベントハンドラー
function handleKeydown(event) {
    // EnterキーとSpacebarキーを検知
    if (event.key === 'Enter' || event.key === ' ') {
        closeModal();
    }
}
