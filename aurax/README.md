# New To Me Auto — The Collection (scroll-cinematic experience)

Source for the New To Me Auto "Coming Soon" cinematic launch site. Vehicles: Mercedes-Benz S-Class, Cadillac Escalade, Buick Enclave, Toyota Tacoma TRD.

- `index.html`, `site.css`, `site.js` — standalone static version. Expects
  `frames/orbit|drive|detail/0001..0096.jpg` and `img/v-*.jpg|mp4` beside it.
- `deploy/index.tsx` — the home route used for the Higgsfield deployment
  (React / TanStack Start). It loads `/aurax/site.css` and `/aurax/site.js`
  from the app's public folder.

Pipeline used to produce the assets (Higgsfield):

1. Master vehicle still (gpt_image_2, 2k) → four finish variants from it.
2. Three 8 s 1080p Seedance 2.5 shots referencing the master: studio orbit,
   coastal highway tracking, aurora detail crane.
3. Each shot sliced to 96 frames at 1440 px wide (`ffmpeg -vf fps=12,scale=1440:-2 -q:v 4`).
4. Ember finish animated into a 5 s loop for the colour spectrum stage.

Live deployment: https://aurax-concept.higgsfield.app
