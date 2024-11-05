document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからログインしたユーザー情報を取得
    const loggedInUser = localStorage.getItem('loggedInUserEmail'); // ローカルストレージキーに従って取得
    const emailDisplay = document.getElementById('email-display');

    if (loggedInUser) {
        // ログインしたメールのみ表示（ログインしたメール文言削除）
        emailDisplay.textContent = `${loggedInUser}`;
        emailDisplay.style.display = 'block'; // メールを表示
    } else {
        emailDisplay.style.display = 'none'; // メールを隠す
    }
});

// キャンセルボタンを押したときメインページに移動する関数
function cancelChange() {
    window.location.href = 'kobetop.html';
}

// 確認ボタンを押したときパスワード変更ロジックを処理する関数
async function confirmChange() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const loggedInUser = localStorage.getItem('loggedInUserEmail'); // ログインしたメールを取得

    // パスワードフィールドが空かどうか確認
    if (!currentPassword) {
        showModal('既存のパスワードを入力してください。');
        return;
    }

    if (!newPassword) {
        showModal('新しいパスワードを入力してください。');
        return;
    }

    if (!confirmPassword) {
        showModal('新しいパスワードをもう一度入力してください。');
        return;
    }

    // 新しいパスワードと確認パスワードが一致するか確認
    if (newPassword !== confirmPassword) {
        showModal('新しいパスワードと新しいパスワードの確認が一致しません。');
        return;
    }

    // パスワード変更API呼び出し
    try {
        const response = await fetch('http://54.180.109.141:8006/changePw', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: loggedInUser,
                current_pw: currentPassword,
                new_pw: newPassword
            })
        });

        const result = await response.json();

        if (response.ok) {
            showModal('パスワードが正常に変更されました！');
            // 1秒後にメインページに移動
            setTimeout(function() {
                window.location.href = 'kobetop.html';
            }, 1000); // 1000ミリ秒 = 1秒
        } else {
            showModal(result.message || 'パスワードの変更に失敗');
        }
    } catch (error) {
        showModal('サーバーとの接続問題が発生しました。');
    }
}

// モーダルを表示する関数
function showModal(message) {
    document.getElementById('alert-message').textContent = message;
    document.getElementById('custom-alert').style.display = 'block';

    // モーダルが開いている時、基本動作をブロックするイベントリスナーを追加
    window.addEventListener('keydown', handleModalKeydown);
}

// モーダルを閉じる関数
function closeModal(event) {
    if (event) {
        event.preventDefault();
    }

    document.getElementById('custom-alert').style.display = 'none';

    // モーダルが閉じられた時、イベントリスナーを削除
    window.removeEventListener('keydown', handleModalKeydown);
}

// ポップアップでEnterキーとスペースバーキーを押したときモーダルを閉じる関数
function handleModalKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();  // スペースバーの基本動作を防ぐ（ページスクロール防止）
        closeModal();
    }
}
