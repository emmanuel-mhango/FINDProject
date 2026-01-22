type RuntimeConfig = {
  googleMapsApiKey?: string;
};

let cachedConfig: RuntimeConfig | null = null;
let pendingConfig: Promise<RuntimeConfig> | null = null;

export const getRuntimeConfig = async (): Promise<RuntimeConfig> => {
  if (cachedConfig) {
    return cachedConfig;
  }

  if (pendingConfig) {
    return pendingConfig;
  }

  pendingConfig = fetch('/config.json', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : {}))
    .catch(() => ({}))
    .then((data) => {
      cachedConfig = {
        googleMapsApiKey:
          typeof data?.googleMapsApiKey === 'string' ? data.googleMapsApiKey : undefined,
      };
      return cachedConfig;
    })
    .finally(() => {
      pendingConfig = null;
    });

  return pendingConfig;
};
