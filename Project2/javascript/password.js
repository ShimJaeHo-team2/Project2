function findPassword() {
    const username = document.getElementById('username').value;

    if (!username) {
        showModal('ID（e-mail）を入力してください。');
        return;
    }

    // パスワード探しロジックを追加
    showModal('パスワード再設定のリクエストが送信されました。入力したメールを確認してください。');
}

function goBack() {
    window.location.href = 'kobelogin.html'; 
}

// モーダルを表示する関数
function showModal(message) {
    document.getElementById('alert-message').textContent = message;
    document.getElementById('custom-alert').style.display = 'block';
    // キーボードイベントリスナーを追加
    document.addEventListener('keydown', handleKeydown);
}

// モーダルを閉じる関数
function closeModal() {
    document.getElementById('custom-alert').style.display = 'none';
    // キーボードイベントリスナーを削除
    document.removeEventListener('keydown', handleKeydown);
}

function handleKeydown(event) {
    // EnterキーとSpacebarキーを検出
    if (event.key === 'Enter' || event.key === ' ') {
        closeModal();
    }
}
