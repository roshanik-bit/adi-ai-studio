# ADI AI STUDIO

A private, responsive Next.js starter for a personal AI image/video studio.

## What works immediately
- Responsive dashboard with dark, light and system theme selection.
- Text-to-image, text-to-video and image-to-video modes.
- Image upload, prompt, aspect ratio and quality controls.
- Local browser gallery and downloads.
- Demo image preview so you can test the interface without API keys.

## Important about free generation
The website code is free. Real AI inference is a separate service and may have usage limits or charges:
- Image: Hugging Face Inference Router. A Hugging Face token and an available model/provider quota are required. Availability, model access and pricing can change.
- Video: Replicate adapter is included, but Replicate usage is generally billed. You must choose compatible text-to-video and image-to-video model version IDs and adjust input field names to the model's schema.
- Without API keys, the app does not pretend to generate AI video. It reports that video API configuration is required.

## Requirements
- Node.js 20 LTS (or compatible recent Node.js)
- npm
- Internet connection for package install and remote AI services

## Run locally
1. Extract the ZIP.
2. Open a terminal in the `adi-ai-studio` folder.
3. Run:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env.local`.
5. For UI testing keep `DEMO_MODE=true`.
6. Start:
   ```bash
   npm run dev
   ```
7. Open http://localhost:3000

## Enable real image generation
1. Create an account at Hugging Face and create an access token with inference permissions.
2. Put it in `.env.local`:
   ```env
   HF_TOKEN=hf_your_token_here
   DEMO_MODE=false
   ```
3. Restart the dev server. The token is used only on the server; do not add a `NEXT_PUBLIC_` prefix.
4. The sample route calls `black-forest-labs/FLUX.1-schnell` through the Hugging Face inference router. If the model/provider is unavailable to your account, choose an available text-to-image model and update the route URL and request body to its documented API.

## Enable real video generation
1. Choose a Replicate text-to-video model and an image-to-video model.
2. Copy their exact version IDs from their model API pages.
3. Add to `.env.local`:
   ```env
   REPLICATE_API_TOKEN=r8_your_token_here
   REPLICATE_TEXT_VIDEO_VERSION=your_text_video_version_id
   REPLICATE_IMAGE_VIDEO_VERSION=your_image_video_version_id
   DEMO_MODE=false
   ```
4. Model APIs have different input schemas. Update `app/api/generate/route.ts` where `input` is built so the field names match the selected model (for example `image`, `first_frame`, or `prompt`).
5. Check the model output shape. This starter expects a direct video URL or an array whose first item is a URL.
6. Video jobs may exceed the default hosting request duration. For production, move generation into a background job/queue and poll job status from the browser instead of waiting in one API request.

## Notes / limitations
- The gallery is stored in browser localStorage, not a cloud database. It is private to the browser profile and can be cleared by the browser.
- Generated media URLs from providers may expire. Download important results.
- This starter does not include user accounts because it is intended for personal use. Do not deploy it publicly with private API keys unless you add authentication.
- The `4K` selector is currently a UI preference only; actual resolution depends on the chosen model. Many image/video models do not produce native 4K.
- The demo image result is a sample landscape photo, not a generated image.
- Before public deployment, add authentication, rate limiting, abuse protection, durable private storage, and background generation jobs.

## Deploy
For a private test deployment, import the project into a private Git repository and deploy with a Next.js-compatible host. Add environment variables in the host dashboard. Do not commit `.env.local`.
