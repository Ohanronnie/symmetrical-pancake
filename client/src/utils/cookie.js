export const Cookie = {
  get: (key) => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === key) {
        return value;
        break;
      }
    }
    return null;
  },
};
