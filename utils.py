def analyze_text(text):
    """
    Genişletilmiş Zorbalık ve Şiddet Analizi Modülü
    """
    # Gelen metni küçük harfe çevir (Büyük/küçük harf duyarlılığını kaldırmak için)
    text = text.lower()
    
    # --- 1. KATEGORİ: YÜKSEK RİSK (HIGH) ---
    # Fiziksel şiddet, ölüm tehdidi, kendine zarar verme, ağır suç unsurları
    high_risk_list = [
        # Şiddet Eylemleri
        "öldür", "bıçak", "silah", "kan", "intihar", "gebert", "boğarım",
        "keseceğim", "vururum", "patlatırım", "parçalarım", "tehdit",
        "saldırı", "dövmek", "dayak", "kemiklerini", "kafanı kırarım",
        "canını yakarım", "sapık", "taciz",
        
        # Tehdit Cümleleri / Kalıpları
        "çıkışa gel", "seni yaşatmam", "ecelin", "sonun geldi", 
        "bittin sen", "seni bitireceğim", "mezara", "okuldan atılacaksın",
        "bedelini ödeyeceksin", "görürsün sen", "sana gününü göstereceğim",
        "kimse seni bulamaz", "yok edeceğim"
    ]
    
    # --- 2. KATEGORİ: ORTA RİSK (MEDIUM) ---
    # Hakaret, aşağılama, dışlama, lakap takma, psikolojik baskı
    medium_risk_list = [
        # Hakaretler
        "salak", "gerizekalı", "aptal", "ezik", "mal", "beyinsiz", "ahmak",
        "dangalak", "öküz", "hayvan", "köpek", "pislik", "yaratık", "ucube",
        "çirkin", "şişko", "bücür", "sırık", "keko", "fakir", "yıkık",
        
        # Dışlama ve Aşağılama
        "kokuyorsun", "iğrençsin", "seni istemiyoruz", "git buradan",
        "gözüme görünme", "rezil", "kepaze", "sevilmeyen", "yalnız", 
        "kaybol", "kapa çeneni", "sus artık", "boş yapma", 
        "bizimle oturamazsın", "gruba giremezsin", "senin yerin yok"
    ]
    
    # --- ANALİZ MANTIĞI ---
    
    # 1. Adım: Önce en tehlikeli kelimeleri kontrol et
    for word in high_risk_list:
        if word in text:
            return "high"  # Tek bir yüksek riskli kelime bile yeterli
            
    # 2. Adım: Eğer yüksek risk yoksa, orta riskli kelimeleri kontrol et
    for word in medium_risk_list:
        if word in text:
            return "medium"
            
    # 3. Adım: Hiçbiri yoksa düşük risk olarak işaretle
    return "low"