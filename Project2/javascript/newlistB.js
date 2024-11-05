// ログインページに移動する関数
function goToLogin() {
    window.location.href = 'kobelogin.html'; 
}

// メインページに移動するボタンのクリック時の処理
function goToMain() {
    window.location.href = 'kobetop.html'; 
}

document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからログイン済みのユーザー情報を取得
    const loggedInUser = localStorage.getItem('loggedInUserEmail');
    const emailDisplay = document.getElementById('email-display');
    const loginButton = document.getElementById('login-button');

    if (loggedInUser) {
        emailDisplay.textContent = `${loggedInUser}`;
        emailDisplay.style.display = 'block';
        loginButton.style.display = 'none';
    } else {
        emailDisplay.style.display = 'none';
        loginButton.style.display = 'block';
    }

    // セッションストレージからgptResponseとaIdを取得する部分を追加
    const gptResponse = sessionStorage.getItem('gptResponse');
    // const aId = sessionStorage.getItem('aId');
    const dialogElement = document.getElementById('dialog-text');

    if (gptResponse) {
        const responseData = JSON.parse(gptResponse);
        console.log('newlistBページに渡されたGPT応答:', responseData);

        let dialogText = '';

        // 'transcript'の代わりに'analysis_result'を使用して分析結果を確認
        if (responseData.analysis_result === "スタイル") {
            dialogText = `スタイルを選択しましたね。次にサービスを選んでください。`;
            createSelectionButtons(responseData.bitems); // bitemsがサービスに相当
        } else if (responseData.analysis_result === "サービス") {
            dialogText = `サービスを選択しましたね。次にスタイルを選んでください。`;
            createSelectionButtons(responseData.bitems); // bitemsがスタイルに相当
        } else {
            dialogText = "選択したオプションを確認できません。もう一度選んでください。";
        }

        // 一文字ずつ会話テキストを表示
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
    } else {
        dialogElement.textContent = "GPTの応答データがありません。";
    }
});

// bitems配列を使用してラジオボタンを生成 (単一選択)
function createSelectionButtons(bitems) {
    const selectionBox = document.getElementById('selection-box');
    selectionBox.innerHTML = ''; // 既存の選択肢を削除

    bitems.forEach(item => {
        const label = document.createElement('label');
        label.className = 'radio-label'; // スタイルのためにクラスを追加

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'selection'; // 同じグループに属するラジオボタン
        input.value = item.content;

        label.appendChild(input);
        label.appendChild(document.createTextNode(item.content));

        selectionBox.appendChild(label);
        selectionBox.appendChild(document.createElement('br')); // 改行
    });
}

// モーダルを開く (確認リクエストモーダル)
function openModal() {
    const selectedRadio = document.querySelector('input[name="selection"]:checked');
    if (selectedRadio) {
        document.getElementById('custom-modal').style.display = 'flex';
        // モーダルが開いているときにデフォルトの動作を防ぐイベントリスナーを追加
        window.addEventListener('keydown', handleModalKeydown);
    } else {
        alert('1 つのオプションを選択します。');
    }
}

// モーダルを閉じる (確認リクエストモーダル)
function closeModal() {
    document.getElementById('custom-modal').style.display = 'none';
    // モーダルが閉じるときにイベントリスナーを削除
    window.removeEventListener('keydown', handleModalKeydown);
}

// 選択確認後、結果モーダルに切り替えおよびチェックされた値をサーバーに送信
function confirmSelection() {
    const selectedRadio = document.querySelector('input[name="selection"]:checked');
    const formData = new FormData();

    if (selectedRadio) { 
        document.getElementById('custom-modal').style.display = 'none'; // 既存のモーダルを閉じる
        document.getElementById('selected-style-text').textContent = `選択した項目: ${selectedRadio.value}`;
        document.getElementById('result-modal').style.display = 'flex'; // 結果モーダルを開く
        // 結果モーダルが開いているときにデフォルトの動作を防ぐイベントリスナーを追加
        window.addEventListener('keydown', handleModalKeydown);

        // チェックされた値を /btext エンドポイントに送信するコードを追加
        const selectedValue = selectedRadio.value;
        const bId = 'bId'; // 実際にユーザーの選択に基づいてこの値を設定する必要があります。
        const content = selectedValue;

        // aIdと一緒に /btext エンドポイントに送信
        console.log(selectedValue)
        const aId = sessionStorage.getItem('aId');  // セッションストレージから取得したaIdの値
        fetch(`http://54.180.109.141:8006/btext/${selectedValue}`, { // URLに送信
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('サーバー応答:', data);
        })
        .catch(error => {
            console.error('サーバーの転送に失敗:', error);
        });
    }
}

function closeResultModal() {
    const selectedStyleElement = document.querySelector('input[name="selection"]:checked');  // 'view'から'selection'に変更

    // 選択されたラジオボタンがない場合の処理
    if (!selectedStyleElement) {
        console.error("選択されたスタイルがありません。ラジオ ボタンが選択されていません。");
        alert("スタイルを選択してください。");
        return; // 選択されていない場合は関数を終了
    }

    const formData = new FormData();
    const selectedStyle = selectedStyleElement.value;

    document.getElementById('result-modal').style.display = 'none';
    window.removeEventListener('keydown', handleModalKeydown);

    // 選択した値を /ctext エンドポイントに送信するコードを追加
    fetch('http://54.180.109.141:8006/ctext', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: formData
        // body: JSON.stringify({ selectedStyle: selectedStyle })
    })
    .then(response => response.json())
    .then(data => {
        console.log('サーバー応答:', data);

        // サーバー応答からCtextの値を抽出
        const c = data.Ctext;
        console.log('Ctext:', c);

        // Ctextの値をlocalStorageに保存
        localStorage.setItem('Ctext', c);

        // ページ移動
        window.location.href = 'newlistC.html'; 
    })
    .catch(error => {
        console.error('サーバー転送失敗:', error);
    });
}

// 戻るボタンのクリック時に前のページに移動
function goBack() {
    window.location.href = 'newlistA.html';
}

// ポップアップでエンターキーとスペースバーキーを押したときにモーダルを閉じる関数
function handleModalKeydown(event) {
    if (event.key === 'Enter') {
        // 確認ボタンクリックと同じ動作
        if (document.getElementById('custom-modal').style.display === 'flex') {
            confirmSelection();
        } else if (document.getElementById('result-modal').style.display === 'flex') {
            closeResultModal();
        }
    } else if (event.key === ' ') {
        event.preventDefault();  // スペースバーのデフォルトの動作（ページスクロール）を防ぐ
        // 確認ボタンクリックと同じ動作
        if (document.getElementById('custom-modal').style.display === 'flex') {
            confirmSelection();
        } else if (document.getElementById('result-modal').style.display === 'flex') {
            closeResultModal();
        }
    }
}
