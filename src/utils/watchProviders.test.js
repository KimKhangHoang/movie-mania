import { describe, expect, it } from 'vitest';
import { withoutVariants } from './watchProviders';

const names = (...providerNames) => providerNames.map((provider_name) => ({ provider_name }));
const shownNames = (...providerNames) =>
  withoutVariants(names(...providerNames)).map((provider) => provider.provider_name);

describe('withoutVariants', () => {
  it('hides other plans of a service that is already listed', () => {
    expect(
      shownNames(
        'Paramount Plus',
        'Paramount+ Amazon Channel',
        'Paramount Plus Premium',
        'Paramount Plus Basic with Ads',
        'Stan',
      ),
    ).toEqual(['Paramount Plus', 'Stan']);
    expect(shownNames('Netflix', 'Netflix Standard with Ads')).toEqual(['Netflix']);
    expect(shownNames('Amazon Prime Video', 'Amazon Prime Video with Ads')).toEqual(['Amazon Prime Video']);
  });

  it('keeps a variant when its main service is not listed', () => {
    expect(shownNames('HBO Max Amazon Channel', 'Stan')).toEqual(['HBO Max Amazon Channel', 'Stan']);
  });

  it('keeps services whose names only look similar', () => {
    expect(shownNames('Apple TV', 'Apple TV Store')).toEqual(['Apple TV', 'Apple TV Store']);
  });
});
