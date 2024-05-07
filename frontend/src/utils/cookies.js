
export const getRefreshTokenFromCookies = () => {
    const cookies = document.cookie.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('refreshToken=')) {
        return cookie.substring(13);
      }
    }
  
    return null;
  };
  