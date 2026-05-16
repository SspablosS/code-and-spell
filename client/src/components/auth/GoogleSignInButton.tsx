const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_denied: 'Вход через Google отменён',
  oauth_state: 'Ошибка безопасности. Попробуйте ещё раз',
  oauth_token: 'Не удалось обменять код авторизации',
  oauth_profile: 'Не удалось получить профиль Google',
  oauth_email: 'У Google-аккаунта нет подтверждённого email',
  oauth_account_conflict: 'Этот email уже привязан к другому аккаунту',
  oauth_not_configured: 'Google OAuth не настроен на сервере',
  oauth_failed: 'Не удалось войти через Google',
};

export function getOAuthErrorMessage(code: string | null): string | null {
  if (!code) return null;
  return OAUTH_ERROR_MESSAGES[code] ?? 'Ошибка входа через Google';
}

export default function GoogleSignInButton() {
  const handleClick = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        marginTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        backgroundColor: '#fff',
        color: '#1f2937',
        border: '1px solid rgba(148, 163, 184, 0.35)',
        borderRadius: '10px',
        fontSize: '0.95rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      Войти через Google
    </button>
  );
}
