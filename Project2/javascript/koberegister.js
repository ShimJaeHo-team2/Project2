function signup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const gender = document.getElementById('gender').value;
    const birthdate = document.getElementById('dob').value;
    const phone = document.getElementById('phone').value;
    const marketingConsent = document.getElementById('marketing-consent').checked;

    // 簡単な有効性検査
    if (!email.includes('@')) {
        alert('E-mailに"@"を含める必要があります。');
        return;
    }

    if (password !== confirmPassword) {
        alert('パスワードが一致しません。');
        return;
    }

    if (!gender) {
        alert('性別を選択してください。');
        return;
    }

    if (!birthdate) {
        alert('生年月日を入力してください。');
        return;
    }

    if (!phone) {
        alert('電話番号を入力してください。');
        return;
    }

    console.log("会員登録データの準備完了");

    const requestData = {
        name: name,
        email: email,
        pw: password,
        gender: gender === "male" ? 1 : 0,
        birthDate: birthdate,
        phone: phone,
        mkt: marketingConsent ? 1 : 0,
    };

    fetch('http://54.180.109.141:8006/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        console.log("サーバーの応答状態:", response.status);

        if (response.ok) {
            console.log("会員登録成功！");

            showSignupSuccessModal();
        } else {
            return response.json().then(data => {
                alert(`会員登録失敗: ${data.message}`);
                console.error("会員登録失敗:", data.message);
            });
        }
    })
    .catch(error => {
        console.error('会員登録中にエラーが発生:', error);
        alert('会員登録中にエラーが発生しました。 後でもう一度お願いします。');
    });
}

// JavaScriptコード
document.addEventListener('DOMContentLoaded', function() {
    // flatpickrで日付入力を日本語設定で初期化
    flatpickr("#dob", {
        locale: "ja", // 日本語設定
        dateFormat: "Y-m-d", // 日付形式指定
        altInput: true,      // 見やすい形式で表示
        altFormat: "Y年m月d日", // 日本語形式で日付表示
    });
});

function showSignupSuccessModal() {
    const modalContent = document.getElementById('alert-message');
    const modal = document.getElementById('custom-alert');

    if (modalContent && modal) {
        modalContent.textContent = '会員登録が完了しました。 ログインページに移動します。';
        modal.style.display = 'flex'; /* モーダルポップアップを表示設定 */
        // キーボードイベントリスナー追加
        document.addEventListener('keydown', handleKeydown);
    } else {
        console.error("モーダルまたはモーダル コンテンツが見つかりません。");
    }
}

function closeModalAndRedirect() {
    document.getElementById('custom-alert').style.display = 'none';
    window.location.href = 'kobelogin.html';
    // キーボードイベントリスナー削除
    document.removeEventListener('keydown', handleKeydown);
}

function handleKeydown(event) {
    // EnterキーとSpacebarキーを検知
    if (event.key === 'Enter' || event.key === ' ') {
        closeModalAndRedirect();
    }
}

function cancelSignup() {
    window.history.back();
}
