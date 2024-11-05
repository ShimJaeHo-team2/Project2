document.addEventListener('DOMContentLoaded', function() {
    // ローカルストレージからログイン中のユーザー情報を取得
    const loggedInUser = localStorage.getItem('loggedInUserEmail'); 
    const emailDisplay = document.getElementById('email-display');
    const loginButton = document.getElementById('login-button');

    if (loggedInUser) {
        emailDisplay.textContent = loggedInUser;
        emailDisplay.style.display = 'block'; 
        loginButton.style.display = 'none'; 
    } else {
        emailDisplay.style.display = 'none'; 
        loginButton.style.display = 'block'; 
    }
});

// ログインページに移動する関数
function goToLogin() {
    window.location.href = 'kobelogin.html'; 
}

// メインに移動する関数
function goToMain() {
    window.location.href = 'kobetop.html'; 
}

document.addEventListener('DOMContentLoaded', function() {
    const dialogText = "ようこそ。どのカフェを探していますか？スタイルとサービスの中から選んでください。";
    const dialogElement = document.getElementById('dialog-text');
    const userTextElement = document.getElementById('user-text');

    function typeWriter(text, element, delay = 50) {
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

    let isRecording = false;
    let recordingInProgress = false;
    let isRetrying = false;

    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;

    window.toggleRecording = function() {
        const recordButton = document.getElementById('record-btn');
        const retryButton = document.getElementById('retry-btn');
        if (recordingInProgress) {
            showModal('返事を完了しました。');
            setTimeout(() => {
                document.getElementById('next-btn').style.display = 'block';
                retryButton.style.display = 'block'; 
                recordButton.style.display = 'none'; 
            }, 1000);
            mediaRecorder.stop();
            recordingInProgress = false;
        } else if (isRecording) {
            showModal('返事を完了しました。');
            mediaRecorder.stop();
            recordingInProgress = true;
        } else {
            showModal('音声でお答えください！');
            recordButton.textContent = 'お返事終わりです！';
            startRecording();
            recordingInProgress = true;
            isRecording = true;
        }
    };

    window.retryRecording = function() {
        if (!isRetrying) {
            showRetryModal('もう一度答えますか？');
            isRetrying = true;
        }
    };

    window.goToNext = function() {
        // GPTエンドポイントを呼び出した後、応答を受けてnewlistBに移るように処理
        fetch('http://54.180.109.141:8006/GPT', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transcript: userTextElement.textContent // 録音から取得したテキストを送信
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('GPT 応答:', data);

            // GPT応答データをセッションストレージに保存し、newlistBページで使用
            sessionStorage.setItem('gptResponse', JSON.stringify(data));

            // aIdをセッションに保存
            sessionStorage.setItem('aId', data.aId);

            // newlistB ページに移動
            window.location.href = 'newlistB.html';
        })
        .catch(error => {
            console.error('GPT 呼び出し失敗:', error);
            alert('GPT呼び出しに失敗しました。 もう一度お願いします。');
        });
    };

    window.showModal = function(message) {
        document.getElementById('alert-message').textContent = message;
        document.getElementById('custom-alert').style.display = 'block';
        window.addEventListener('keydown', handleModalKeydown);
    };

    window.showRetryModal = function(message) {
        document.getElementById('retry-message').textContent = message;
        document.getElementById('retry-alert').style.display = 'flex';
        window.addEventListener('keydown', handleModalKeydown);
    };

    window.closeModal = function(event) {
        if (event) {
            event.preventDefault();
        }
        document.getElementById('custom-alert').style.display = 'none';
        window.removeEventListener('keydown', handleModalKeydown);
        if (isRetrying) {
            showRetryModal('もう一度答えますか？');
        }
    };

    window.confirmRetry = function() {
        closeRetryModal();
        showModal('答えを始めます。');
        document.getElementById('record-btn').textContent = 'お返事終わり！';
        document.getElementById('record-btn').style.display = 'block';
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('retry-btn').style.display = 'none'; 
        isRecording = true;
        recordingInProgress = true;
        isRetrying = false;
        startRecording();
    };

    window.closeRetryModal = function() {
        document.getElementById('retry-alert').style.display = 'none';
        window.removeEventListener('keydown', handleModalKeydown);
        isRetrying = false;
    };

    function handleModalKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            closeModal(event);
        }
    }

    window.toggleHelp = function() {
        const helpText = document.getElementById('help-text');
        if (helpText.style.display === 'none' || helpText.style.display === '') {
            helpText.style.display = 'block';
        } else {
            helpText.style.display = 'none';
        }
    };

    window.goBack = function() {
        window.location.href = 'kobelist.html';
    };

    function startRecording() {
        navigator.mediaDevices.getUserMedia({
            audio: {
                sampleRate: 48000,
                channelCount: 1 // モノチャンネルに設定
            }
        })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' }); // ファイルタイプをwebmに設定
            mediaRecorder.start();

            mediaRecorder.ondataavailable = function(event) {
                audioChunks.push(event.data);
                console.log('チャンクが追加されました:', event.data); // 各チャンクをログに出力
                console.log('現在チャンク配列:', audioChunks); // 全チャンク配列を出力
            };

            mediaRecorder.onstop = function() {
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // webm に変換
                audioChunks = [];
                
                console.log('最終オーディオBlob:', audioBlob); // 最終 Blob ファイル出力
            
                const formData = new FormData();
                formData.append('file', audioBlob, 'recording.webm'); // webmファイルで送信
            
                console.log('転送する formData:', formData.get('file')); // 転送するファイル データの出力
            
                fetch('https://koca.sekoaischool.com/api/stt', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`サーバーエラー: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('サーバー応答:', data);
            
                    if (data.transcript && data.transcript.trim() !== '') {
                        userTextElement.textContent = data.transcript;
                    } else {
                        userTextElement.textContent = '認識されたテキストがありません。';
                    }
                })
                .catch(error => {
                    console.error('アップロード失敗:', error);
                    userTextElement.textContent = `ログインしていただかないとご利用いただけません！`;
                });
            };
        })
        .catch(error => {
            console.error('返事失敗:', error);
        });
    }
});
