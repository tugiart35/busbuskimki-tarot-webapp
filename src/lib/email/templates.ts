export interface ReadingInviteTemplateOptions {
  customerName?: string | null;
  spreadName?: string | null;
  inviteLink: string;
  expiresAt?: string | null;
}

export interface ReadingReadyTemplateOptions {
  customerName?: string | null;
  spreadName?: string | null;
  adminLink: string;
}

export function buildInviteEmailHtml(
  options: ReadingInviteTemplateOptions
): string {
  const { customerName, spreadName, inviteLink, expiresAt } = options;
  const expiryText = expiresAt
    ? `Bu bağlantı ${new Date(expiresAt).toLocaleString('tr-TR')} tarihine kadar geçerlidir.`
    : 'Bu bağlantıyı en kısa sürede kullanmanızı rica ederiz.';

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px">
      <div style="max-width: 520px; margin: 0 auto; background: rgba(15, 23, 42, 0.85); border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.2); overflow: hidden">
        <div style="padding: 28px 28px 16px 28px; background: linear-gradient(120deg, rgba(129, 140, 248, 0.3), rgba(236, 72, 153, 0.25))">
          <h1 style="font-size: 24px; color: #facc15; margin: 0">Tarot Yolculuğunuza Hoş Geldiniz</h1>
          <p style="margin: 12px 0 0 0; font-size: 15px; line-height: 1.6">
            ${customerName ? `${customerName},` : 'Merhaba,'}
            sizin için özel bir tarot okuması hazırlamak üzere birkaç bilgiyi paylaşmanız yeterli.
          </p>
        </div>
        <div style="padding: 28px;">
          <p style="font-size: 15px; line-height: 1.6; margin-top: 0">
            ${spreadName ? `${spreadName} yayılımı` : 'Seçtiğimiz yayılım'} sayesinde sorularınıza yanıt bulmamız daha kolay olacak.
          </p>
          <a href='${inviteLink}' style="display: block; text-align: center; margin: 24px auto; background: #facc15; color: #1f2937; padding: 14px 20px; border-radius: 999px; text-decoration: none; font-weight: 600;">Formu Aç ve Kartlarını Seç</a>
          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8;">${expiryText}</p>
          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8;">
            Bağlantı çalışmazsa, bu URL'yi tarayıcınıza yapıştırabilirsiniz: <br />
            <span style="word-break: break-all; color: #e2e8f0;">${inviteLink}</span>
          </p>
        </div>
        <div style="padding: 20px 28px; border-top: 1px solid rgba(148, 163, 184, 0.2); background: rgba(15, 23, 42, 0.7); font-size: 12px; color: #94a3b8;">
          Busbuskimki Tarot ekibi
        </div>
      </div>
    </div>
  `;
}

export function buildReadyEmailHtml(
  options: ReadingReadyTemplateOptions
): string {
  const { customerName, spreadName, adminLink } = options;
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px">
      <div style="max-width: 520px; margin: 0 auto; background: rgba(15, 23, 42, 0.85); border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.2); overflow: hidden">
        <div style="padding: 28px; background: linear-gradient(120deg, rgba(129, 140, 248, 0.3), rgba(20, 184, 166, 0.25))">
          <h1 style="font-size: 24px; color: #22d3ee; margin: 0">Yeni okuma hazır!</h1>
          <p style="margin: 12px 0 0 0; font-size: 15px; line-height: 1.6">
            ${customerName ?? 'Bir kullanıcı'} için ${spreadName ?? 'tarot'} okuması tamamlanmak üzere.
          </p>
        </div>
        <div style="padding: 28px;">
          <p style="font-size: 15px; line-height: 1.6; margin-top: 0">
            Form cevapları ve kart seçimi admin panelinizde görüntülenebilir.
          </p>
          <a href='${adminLink}' style="display: block; text-align: center; margin: 24px auto; background: #22d3ee; color: #0f172a; padding: 14px 20px; border-radius: 999px; text-decoration: none; font-weight: 600;">Admin Panelinde Aç</a>
          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8;">
            Link çalışmazsa: <br />
            <span style="word-break: break-all; color: #e2e8f0;">${adminLink}</span>
          </p>
        </div>
        <div style="padding: 20px 28px; border-top: 1px solid rgba(148, 163, 184, 0.2); background: rgba(15, 23, 42, 0.7); font-size: 12px; color: #94a3b8;">
          Busbuskimki Tarot ekibi
        </div>
      </div>
    </div>
  `;
}
