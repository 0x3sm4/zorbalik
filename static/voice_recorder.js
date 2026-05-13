(function () {
    'use strict';

    let mediaRecorder = null;
    let audioChunks = [];
    let timerInterval = null;
    let elapsedSeconds = 0;
    let recordedBlob = null;

    document.addEventListener('DOMContentLoaded', function () {
        const recordBtn  = document.getElementById('voiceRecordBtn');
        const timerEl    = document.getElementById('voiceTimer');
        const previewEl  = document.getElementById('voicePreview');
        const audioEl    = document.getElementById('voiceAudio');
        const resetBtn   = document.getElementById('voiceResetBtn');
        const errorEl    = document.getElementById('voiceError');

        if (!recordBtn) return;

        // ── Yardımcı fonksiyonlar ──────────────────────────────────────────

        function formatTime(s) {
            var m   = Math.floor(s / 60).toString().padStart(2, '0');
            var sec = (s % 60).toString().padStart(2, '0');
            return m + ':' + sec;
        }

        function startTimer() {
            elapsedSeconds = 0;
            timerEl.textContent = '00:00';
            timerEl.style.display = 'inline';
            timerInterval = setInterval(function () {
                elapsedSeconds++;
                timerEl.textContent = formatTime(elapsedSeconds);
            }, 1000);
        }

        function stopTimer() {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        function resetRecorder() {
            recordedBlob = null;
            audioChunks  = [];
            stopTimer();
            timerEl.style.display   = 'none';
            previewEl.style.display = 'none';
            audioEl.src             = '';
            errorEl.textContent     = '';
            recordBtn.textContent   = '🎙️ Ses Kaydet';
            recordBtn.classList.remove('recording');
            recordBtn.style.display = 'inline-flex';
        }

        // ── Buton olay dinleyicileri ───────────────────────────────────────

        recordBtn.addEventListener('click', function () {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            } else {
                startRecording();
            }
        });

        resetBtn.addEventListener('click', resetRecorder);

        // ── Kayıt başlatma ────────────────────────────────────────────────

        function startRecording() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                errorEl.textContent = 'Tarayıcınız ses kaydını desteklemiyor.';
                return;
            }

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function (stream) {
                    errorEl.textContent = '';
                    audioChunks = [];

                    var mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                        ? 'audio/webm;codecs=opus'
                        : MediaRecorder.isTypeSupported('audio/webm')
                            ? 'audio/webm'
                            : '';

                    var options = mimeType ? { mimeType: mimeType } : undefined;
                    mediaRecorder = new MediaRecorder(stream, options);

                    mediaRecorder.addEventListener('dataavailable', function (e) {
                        if (e.data && e.data.size > 0) {
                            audioChunks.push(e.data);
                        }
                    });

                    mediaRecorder.addEventListener('stop', function () {
                        stopTimer();
                        stream.getTracks().forEach(function (t) { t.stop(); });

                        var blobType = mimeType || 'audio/webm';
                        recordedBlob = new Blob(audioChunks, { type: blobType });
                        audioEl.src = URL.createObjectURL(recordedBlob);

                        previewEl.style.display = 'block';
                        recordBtn.style.display  = 'none';
                        timerEl.style.display    = 'none';
                        recordBtn.classList.remove('recording');
                    });

                    mediaRecorder.start();
                    recordBtn.textContent = '⏹️ Durdur';
                    recordBtn.classList.add('recording');
                    startTimer();
                })
                .catch(function (err) {
                    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                        errorEl.textContent = 'Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini etkinleştirin.';
                    } else {
                        errorEl.textContent = 'Mikrofona erişilemiyor: ' + err.message;
                    }
                });
        }

        // ── Form submit: ses kaydını "voice_record" adıyla ekle ────────────

        var form = document.querySelector('form[enctype="multipart/form-data"]');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            if (!recordedBlob) return; // kayıt yoksa normal submit devam eder

            e.preventDefault();

            var ext = recordedBlob.type.indexOf('ogg') !== -1 ? '.ogg' : '.webm';
            var formData = new FormData(form);
            formData.append('voice_record', recordedBlob, 'voice_record' + ext);

            fetch(form.action || window.location.href, {
                method: 'POST',
                body: formData
            })
            .then(function (response) { return response.text(); })
            .then(function (html) {
                document.open();
                document.write(html);
                document.close();
            })
            .catch(function () {
                // Hata durumunda ses kaydı olmadan normal submit yap
                recordedBlob = null;
                form.submit();
            });
        });
    });
})();
