import { BUILDVARS } from './_vars';

const buildVersion = BUILDVARS.version.tag || BUILDVARS.version.semverString || BUILDVARS.version.raw || BUILDVARS.version.hash;
const buildDate = new Date();

export const environment = {
  production: true,

  server: {
    ws: 'ws://127.0.0.1:6975/'
  },

  client: {
    domain: 'play.rair.land',
    protocol: 'https',
    port: 443
  },

  assetHashes: BUILDVARS.hashes,
  version: `${buildVersion} (built on ${buildDate})`
};
