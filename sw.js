// Define the cache name and the assets to cache
const CACHE_NAME = 'RETROBOWLCOLLEGE';
const ASSETS_TO_CACHE = [
  '/index.html',
  '/register_sw.js',
  '/manifest.json',
  '/poki-sdk.js',
  '/rbc192.png',
  '/rbc512.png',
  '/rbc64.png',
  '/scripts/5443f10e0bfac1bb0eb31054b8513ef81e6cc7c1/poki-sdk-core-5443f10e0bfac1bb0eb31054b8513ef81e6cc7c1.js',
  '/html5game/sound/worklets/audio-worklet.js',
  '/html5game/v2/Competitions_CO.txt',
  '/html5game/v2/Conferences_CO.txt',
  'html5game//v2/Rounds_CO.txt',
  'html5game//v2/Schedule_CO.txt',
  '/html5game/v2/Teams_CO.txt',
  '/html5game/v2/uniforms_default_CO.txt',
  '/html5game/Achievements.txt',
  '/html5game/Charities.txt',
  '/html5game/Cities_CO.txt',
  '/html5game/Colleges.txt',
  '/html5game/Editor.json',
  '/html5game/EpilogueValues_CO.txt',
  '/html5game/Hobbies_CO.txt',
  '/html5game/LanguageUS.txt',
  '/html5game/LanguageUS_CO.txt',
  '/html5game/MajorMinor_CO.txt',
  '/html5game/Names_F0.txt',
  '/html5game/Names_F1.txt',
  '/html5game/Names_L.txt',
  '/html5game/PlayerRecords.txt',
  '/html5game/ProTeams_CO.txt',
  '/html5game/RetroBowl.js',
  '/html5game/RetroBowl_texture_0.png',
  '/html5game/RetroBowl_texture_1.png',
  '/html5game/RetroBowl_texture_2.png',
  '/html5game/RetroBowl_texture_3.png',
  '/html5game/Shopping.txt',
  '/html5game/Teams.txt',
  '/html5game/Traits_CO.txt',
  '/html5game/splash.png',
  '/html5game/uph_poki.js',
  '/html5game/snd_audible.ogg',
  '/html5game/snd_audience_dis.ogg',
  '/html5game/snd_audience_fg.ogg',
  '/html5game/snd_audience_idle.ogg',
  '/html5game/snd_beep.ogg',
  '/html5game/snd_beep2.ogg',
  '/html5game/snd_bounce.ogg',
  '/html5game/snd_click.ogg',
  '/html5game/snd_co_brass1.ogg',
  '/html5game/snd_co_brass2.ogg',
  '/html5game/snd_co_brass3.ogg',
  '/html5game/snd_co_brass4.ogg',
  '/html5game/snd_drink.ogg',
  '/html5game/snd_error.ogg',
  '/html5game/snd_kick.ogg',
  '/html5game/snd_oof1.ogg',
  '/html5game/snd_oof2.ogg',
  '/html5game/snd_oof3.ogg',
  '/html5game/snd_post.ogg',
  '/html5game/snd_purchase.ogg',
  '/html5game/snd_starrating.ogg',
  '/html5game/snd_success.ogg',
  '/html5game/snd_tackle.ogg',
  '/html5game/snd_throw.ogg',
  '/html5game/snd_timeout.ogg',
  '/html5game/snd_music_co.ogg'
];

// Install the Service Worker and cache the assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate the Service Worker and remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
              console.log('Deleting old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
  );
});

// Fetch assets from the cache or the network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      })
      .catch(() => caches.match('/offline.html')) // Serve offline page if network request fails
  );
});
