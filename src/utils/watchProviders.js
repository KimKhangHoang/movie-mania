// The endings TMDB adds to a service's name when it lists another plan or way of buying the same service
const VARIANT_ENDING = /\s+(amazon channel|(standard |basic )?with ads|premium)$/i;

// "Paramount+ Amazon Channel" and "Paramount Plus Premium" both become "Paramount Plus"
const mainServiceName = (name) => name.replace(VARIANT_ENDING, '').replace('+', ' Plus');

// TMDB can list the same service several times, so hide the variants of a service that's already listed.
// A variant stays when its main service isn't listed, so no way of watching the movie is lost.
export const withoutVariants = (providers) => {
  const names = new Set(providers.map((provider) => provider.provider_name));

  return providers.filter(({ provider_name: name }) => {
    const mainName = mainServiceName(name);
    return mainName === name || !names.has(mainName);
  });
};
