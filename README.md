# RubricAI Assessor

An interactive language assessment tool for teachers powered by Google Gemini.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Create a `.env` file in the root directory:
    ```
    VITE_API_KEY=your_google_gemini_api_key
    ```

3.  Run locally:
    ```bash
    npm run dev
    ```

## Deployment

To deploy to GitHub Pages:

1.  Initialize a git repository and push your code to GitHub.
2.  Run:
    ```bash
    npm run deploy
    ```
    This will build the app and push the `dist` folder to the `gh-pages` branch of your repository.
3.  Go to your GitHub Repository Settings -> Pages and ensure it is serving from the `gh-pages` branch.
