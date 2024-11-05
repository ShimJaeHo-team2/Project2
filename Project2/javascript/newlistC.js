document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからログインしているユーザー情報を取得
    const loggedInUser = localStorage.getItem('loggedInUserEmail'); // ローカルストレージキーに基づいて取得
    const emailDisplay = document.getElementById('email-display');
    const loginButton = document.getElementById('login-button');

    if (loggedInUser) {
        // ログインしたメールアドレスのみ表示
        emailDisplay.textContent = `${loggedInUser}`;
        emailDisplay.style.display = 'block'; // メールアドレスを表示
        loginButton.style.display = 'none';  // ログインボタンを非表示
    } else {
        emailDisplay.style.display = 'none'; // メールアドレスを非表示
        loginButton.style.display = 'block'; // ログインボタンを表示
    }
});

// ログインページに移動する関数
function goToLogin() {
    window.location.href = 'kobelogin.html'; 
}

// メインボタンをクリック時に移動する関数
function goToMain() {
    window.location.href = 'kobetop.html'; 
}

document.addEventListener('DOMContentLoaded', function() {
    const dialogElement = document.getElementById('dialog-text');

    // localStorageからCtextデータを取得
    const ctextResponse = localStorage.getItem('Ctext');
    console.log("localStorageから取得したCtext:", ctextResponse);  // localStorageから取得したデータ確認

    let dialogText = "雰囲気のいい音楽が流れてレトロな感じのカフェを探してみます。"; // デフォルト値

    // Ctextが存在する場合、ダイアログテキストを該当値に設定
    if (ctextResponse) {
        dialogText = ctextResponse;  // Ctextの値をdialogTextに割り当て
        console.log("サーバーから受信したCtext:", dialogText);  // サーバーから取得したダイアログテキスト確認
    }

    // ダイアログテキストを一文字ずつ表示する関数
    function typeWriter(text, element, delay = 100) {
        let index = 0;
        element.innerHTML = '';
        const interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
            }
        }, delay);
    }

    typeWriter(dialogText, dialogElement);
});

// 戻るボタンをクリック時に前のページに移動
function goBack() {
    window.location.href = 'newlistB.html';
}

// 画像を取得してポップアップを開くロジック
async function confirmSelection() {
    try {
        // ローディング中のポップアップを表示
        document.getElementById('loading-popup').style.display = 'flex';
        
        // localStorageから取得したCtextの値
        const ctextResponse = localStorage.getItem('Ctext');
        console.log("Using Ctext for prompt:", ctextResponse);

        // バックエンドに送信 (ユーザーのプロンプトを含む)
        const response = await fetch('http://54.180.109.141:8006/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: ctextResponse }) // オリジナルのプロンプトをそのまま送信
        });

        if (!response.ok) {
            throw new Error('画像の生成に失敗しました。');
        }

        const data = await response.json();
        const imageUrl = data.image_url; // バックエンドから受信した画像URL

        // 画像ポップアップを開く
        const imageElement = document.getElementById('myImage');
        imageElement.src = imageUrl;
        imageElement.style.display = 'block';
        document.getElementById('image-message').style.display = 'none';

        // ローディング中のポップアップを非表示
        document.getElementById('loading-popup').style.display = 'none';

        document.getElementById('popup').style.display = 'flex';
    } catch (error) {
        alert('カフェリスト作成ボタンをもう一度押してください。');
        console.error(error);

        document.getElementById('loading-popup').style.display = 'none';
    }
}

// ポップアップを閉じる機能
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// カフェリスト作成確認ボタンをクリック時にmycafelist.htmlに移動
// function goToLoading() {
//     window.location.href = 'mycafelist.html';
// }

async function goToLoading() {
    // ローディング中のポップアップを表示 (オプションで追加)
    document.getElementById('loading-popup').style.display = 'flex';
    const formData = new FormData();

    try {
        // /cafeListエンドポイントにフォームデータを送信
        const response = await fetch('http://54.180.109.141:8006/cafeList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData // JSON形式に変換して送信
        });

        if (!response.ok) {
            throw new Error('カフェリスト作成中にエラーが発生');
        }

        // 応答を処理 (必要に応じて)
        const data = await response.json();
        console.log('サーバーからの応答:', data);

        // 返された値をlocalStorageに保存
        localStorage.setItem('cafeListData', JSON.stringify(data)); // 返されたデータを保存

        // ページ移動
        window.location.href = 'mycafelist.html';
    } catch (error) {
        console.error('カフェリスト作成に失敗:', error);
        alert('リスト作成ボタンをもう一度押してください。');

        // ローディング中のポップアップを非表示
        document.getElementById('loading-popup').style.display = 'none';
    }
}

// ダウンロードボタンをクリック時に画像をダウンロードする機能を追加
async function downloadImage() {
    try {
        // バックエンドから生成された画像を取得
        const response = await fetch('http://54.180.109.141:8006/image'); // バックエンドから実際の画像ファイルを取得するAPI
        const blob = await response.blob(); // 応答データをBlobに変換

        // Blob URLを生成
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'cafe_image.jpg'; // ファイル名を設定 (必要に応じて変更可能)
        document.body.appendChild(a);
        a.click(); // クリックイベントを発生させてダウンロード

        // メモリを解放
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a); // 要素を削除
    } catch (error) {
        console.error('ダウンロード失敗:', error);
        alert('ダウンロードに失敗しました。');
    }
}

// ダウンロードボタンをクリック時に実行
document.getElementById('download-btn').addEventListener('click', downloadImage);
