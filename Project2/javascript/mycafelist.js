document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからログインしているユーザー情報を取得
    const loggedInUser = localStorage.getItem('loggedInUserEmail'); 
    const emailDisplay = document.getElementById('email-display');

    // ログインしたメールアドレスを表示
    if (loggedInUser) {
        emailDisplay.textContent = `${loggedInUser}`;
        emailDisplay.style.display = 'block';
    } else {
        emailDisplay.style.display = 'none';
    }

    // localStorageからcafeListDataを取得し、データを表示
    const cafeListData = localStorage.getItem('cafeListData');

    // データがある場合、パースしてページに表示
    if (cafeListData) {
        const parsedData = JSON.parse(cafeListData);
        console.log("localStorageから取得したカフェリストデータ:", parsedData);

        // データベースから取得した情報を表示
        const dataDisplay = document.getElementById('data-display');

        // parsedDataからcafesオブジェクトを取得
        const cafes = parsedData.cafes;

        // cafesオブジェクトを使用してデータをページに表示
        if (cafes && typeof cafes === 'object') {
            for (const [key, value] of Object.entries(cafes)) {
                const paragraph = document.createElement('p');

                // カフェ名部分にクラスを追加
                const keySpan = document.createElement('span');
                keySpan.textContent = `${key}: `;
                const valueSpan = document.createElement('span');
                valueSpan.textContent = value;
                valueSpan.classList.add('cafe-name');  // CSSクラスを追加

                paragraph.appendChild(keySpan);
                paragraph.appendChild(valueSpan);
                dataDisplay.appendChild(paragraph);
            }
        } else {
            console.error('cafesがオブジェクトではありません:', cafes);
        }
    } else {
        console.error('cafeListDataがlocalStorageで見つかりませんでした。');
    }
});

// メインに移動
function goToMain() {
    window.location.href = 'kobetop.html';
}

// 私のリストからカフェ情報を取得
function saveToList() {
    const formData = new FormData();
    
    // 必要なデータをformDataに追加 (例: formData.append('key', value));

    fetch("http://54.180.109.141:8006/getCafeList", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("ネットワークの応答が良くありません。");
        }
        return response.json();
    })
    .then(result => {
        console.log(result.cafes); // サーバーから受け取ったカフェ情報を出力

        // カフェ情報をlocalStorageに保存
        localStorage.setItem('cafeListData', JSON.stringify(result));

        // カフェ情報を別のHTMLページに移動して表示
        goToList();
    })
    .catch(error => {
        console.error("エラーが発生:", error);
        alert("カフェ情報の取得中にエラーが発生しました。");
    });
}

// 私だけのリストに移動
function goToList() {
    window.location.href = 'existinglist.html';
}

// モーダルを開く
function showModal(message) {
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';

    // モーダルが開いているときの基本動作を防ぐイベントリスナーを追加
    window.addEventListener('keydown', closeOnEnterOrSpace);
}

// モーダルを閉じる
function closeModal() {
    document.getElementById('custom-modal').style.display = 'none';
    window.removeEventListener('keydown', closeOnEnterOrSpace);
}

// EnterまたはSpaceでモーダルを閉じる
function closeOnEnterOrSpace(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        closeModal();
    }
}
