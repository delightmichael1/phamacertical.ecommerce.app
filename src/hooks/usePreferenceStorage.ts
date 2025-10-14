function UsePreferenceStorage() {
  const setPreference = async (key: string, value: any) => {
    const jsonstring = JSON.stringify(value);
    localStorage.setItem(key, jsonstring);
  };

  const getPreference = async (key: string) => {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      return null;
    }
  };

  const removePreference = async (key: string) => {
    await localStorage.removeItem(key);
  };

  return { setPreference, getPreference, removePreference };
}

export default UsePreferenceStorage;
