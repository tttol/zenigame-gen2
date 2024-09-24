# FIDO2/WebAuthnとは
- FIDO2
- WebAuthn

# シーケンス
### WebAuthn認証における公開鍵登録フロー
```mermaid
sequenceDiagram
    actor User
    participant Authenticator
    participant Browser
    participant Server

    User->>Browser: 登録要求
    Browser->>Server: 鍵の登録をリクエスト
    Server->>Authenticator: 公開鍵・秘密鍵のペア生成を要求
    Authenticator->>Authenticator: 公開鍵・秘密鍵のペア生成
    Authenticator->>Server: 公開鍵を送信
    Server->>Server: 公開鍵・デバイス情報をDBに登録
    Server->>Browser: 登録完了通知
```

### WebAuthn認証におけるパスワードレス認証フロー
```mermaid
sequenceDiagram
    actor User
    participant Authenticator
    participant Browser
    participant Server

    User->>Browser: 認証要求開始
    Browser->>Server: APIへリクエスト
    Server->>Authenticator: 署名の送信を要求
    Authenticator->>Authenticator: 生体認証で本人確認
    Authenticator->>Authenticator: 秘密鍵で署名作成
    Authenticator->>Server: 署名を返す
    Server->>Server: 公開鍵で署名の検証
    Server->>Server: DBに認証結果を記録
    Server->>Browser: 認証/拒否
```

AWSリソースベースのシーケンス図を書く

# Lambda関数
- CustomS3AutoDeleteObjectsCust-eDXjTHkR4qXi
  - 
- CreateAuthChallen-UOW0y5WZYTzI
  - create auth challenge
  - 認証用のチャレンジを生成してフロントエンドに送信
- DefineAuthChallen-NVy4AAATnbAY
  - define auth challenge
- Fido2ChallengePas-1lVImiEPV2Jh
  - fido2 challenge password
- Fido2Notification-Pz0QEg351k1j
- Fido2Passwordless-enYKOaJO0oKT
- PreSignupPassword-ffUGMKWeLEw3
- PreTokenPasswordl-abwsbOK5A7Pp
- VerifyAuthChallen-441RLPPoQkXS
  - verify auth challenge
  - フロントから送信された署名を検証する
  - ここの検証がOKならサインインに成功する