## Usage

### Development mode

1. Install dependencies:

   ```sh
   npm i
   ```

2. Run the app in the development mode:

   ```sh
   npm run dev
   ```

   The page will reload if you make edits.

3. Update the `WEBAPP_URL` [environment variable](../README.md#environment-variables)

    Since Telegram only accepts HTTPS URLs for Web Apps, you'll need to use a tunneling software like [serveo](https://serveo.net) or [ngrok](https://ngrok.com) ([list of tunnelling software and services](https://github.com/anderspitman/awesome-tunneling#readme)):

    ```sh
    # serveo usage example (no client required)
    ssh -R 80:localhost:5173 serveo.net

    # ngrok usage example
    ngrok http 5173
    ```

    > Note: `5173` is default port. If the port differs from `5173`, change it accordingly.

    Set the [environment variable](../README.md#environment-variables) `WEBAPP_URL` to obtained link.

### Production mode

1. Install dependencies:

   ```sh
   npm i
   ```

2. Build the app for production to the `dist` folder:

   ```sh
   npm run build
   ```

3. Deploy the `dist` folder to any static hosting provider.

4. Set the [environment variable](../README.md#environment-variables) `WEBAPP_URL` to your link.
