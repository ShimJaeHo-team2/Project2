function login() {
    const email = document.getElementById('username').value;
    const pw = document.getElementById('password').value;

    // 簡単な有効性検査
    if (!email || !pw) {
        showModal('E-mailとpasswordの両方を入力します。');
        return;
    }

    // ログインAPIリクエストを送信
    fetch('http://54.180.109.141:8006/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, pw: pw })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('ログインの試行中に問題が発生しました。');
        }
        return response.json();
    })
    .then(data => {
        console.log('サーバー応答:', data); // サーバーからの応答を確認するためにコンソールにログ

        if (data.message === 'ログイン成功！') {  // サーバーのメッセージを確認
            showModal('ログイン成功！');
            localStorage.setItem('loggedInUserEmail', email);

            // 一定時間後にページに移動します
            autoRedirect();
        } else {
            // ログイン失敗時
            showModal('メールやパスワードをもう一度ご確認お願いします。');
        }
    })
    .catch(error => {
        // ネットワークエラーまたはその他の例外処理
        showModal('エラーが発生しました。: ' + error.message);
    });
}

function autoRedirect() {
    // モーダルを閉じる関数を定義
    const closeAndRedirect = () => {
        document.getElementById('custom-alert').style.display = 'none';
        window.location.href = 'kobetop.html'; // ホームページのパスを設定
    };

    // モーダル確認ボタンにクリックイベントリスナーを追加
    document.querySelector('.modal-content button').addEventListener('click', closeAndRedirect);

    // 2秒後に自動でページ移動
    setTimeout(() => {
        // モーダルが閉じられていない場合は自動でページ移動
        if (document.getElementById('custom-alert').style.display === 'block') {
            closeAndRedirect();
        }
    }, 900); // 2000ミリ秒 = 2秒
}

function goToSignup() {
    window.location.href = 'koberegister.html'; // 会員登録ページに移動
}

function findPassword() {
    window.location.href = 'password.html'; // パスワード探しページに移動
}

function goToMain() {
    window.location.href = 'kobetop.html'; // メインページに移動
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

// キーボードイベント処理関数
function handleKeydown(event) {
    // EnterキーとSpacebarキーを検出
    if (event.key === 'Enter' || event.key === ' ') {
        closeModal();
    }
}

// モーダルの確認ボタンにイベントリスナーを追加
document.querySelector('.modal-content button').addEventListener('click', closeModal);
