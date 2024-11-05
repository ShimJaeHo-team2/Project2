document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからログインしているユーザー情報を取得
    const loggedInUser = localStorage.getItem('loggedInUserEmail'); // ローカルストレージキーの修正
    const emailDisplay = document.getElementById('email-display');
    const logoutLink = document.getElementById('logout-link');
    const loginLink = document.getElementById('login-link');
    const changePasswordLink = document.getElementById('change-password-link');

    if (loggedInUser) {
        // ログインしたメールのみ表示
        emailDisplay.textContent = `${loggedInUser}`;
        emailDisplay.style.display = 'block'; // ログインした場合、メールを表示
        logoutLink.style.display = 'block'; // ログアウトボタンを表示
        changePasswordLink.style.display = 'block'; // パスワード変更リンクを表示
        loginLink.style.display = 'none'; // ログインボタンを隠す
    } else {
        // ログインしていない場合、メールを隠す
        emailDisplay.style.display = 'none'; // ログインしていない場合、メールを隠す
        logoutLink.style.display = 'none'; // ログアウトボタンを隠す
        changePasswordLink.style.display = 'none'; // パスワード変更リンクを隠す
        loginLink.style.display = 'block'; // ログインボタンを表示
    }
});


function logout() {
    // ローカルストレージからユーザー情報を削除し、ログインページに移動
    localStorage.removeItem('loggedInUserEmail'); // ローカルストレージキーの修正
    window.location.href = 'kobelogin.html';
}

function goToLogin() {
    // ログインページに移動
    window.location.href = 'kobelogin.html';
}

function changePassword() {
    // パスワード変更ページに移動
    window.location.href = 'changepw.html'; 
}

function enter() {
    // "入る"ボタンをクリックした際、モーダルポップアップを表示する関数を呼び出す
    showModal('カフェリストへようこそ！');
    
    // 1秒後にカフェリストページに移動
    setTimeout(function() {
        window.location.href = 'kobelist.html';
    }, 900); // 1000ミリ秒 = 1秒
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
    // モーダルを閉じたときにページ移動
    window.location.href = 'kobelist.html'; 
    // キーボードイベントリスナーを削除
    document.removeEventListener('keydown', handleKeydown);
}

// モーダルの確認ボタンにイベントリスナーを追加
document.querySelector('.modal-content button').addEventListener('click', closeModal);

// サイドメニューを開いたり閉じたりする関数
function toggleMenu() {
    var menu = document.getElementById("side-menu");
    var menuBtn = document.getElementById("menu-btn");
    
    if (menu.style.width === "250px") {
        menu.style.width = "0"; // サイドメニューを閉じる
        menuBtn.style.display = "block"; // ハンバーガーボタンを表示
    } else {
        menu.style.width = "250px"; // サイドメニューを開く
        menuBtn.style.display = "none"; // ハンバーガーボタンを隠す
    }
}

// キーボードイベント処理関数
function handleKeydown(event) {
    // EnterキーとSpacebarキーを検知
    if (event.key === 'Enter' || event.key === ' ') {
        closeModal();
    }
}
