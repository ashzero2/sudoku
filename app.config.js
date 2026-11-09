module.exports = ({ config }) => {
  if (process.env.PLAY_STORE_BUILD !== '1') return config;

  return {
    ...config,
    android: {
      ...config.android,
      blockedPermissions: [
        'android.permission.INTERNET',
        'android.permission.SYSTEM_ALERT_WINDOW',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ],
    },
  };
};
