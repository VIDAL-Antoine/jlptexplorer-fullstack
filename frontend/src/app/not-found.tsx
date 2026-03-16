export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>404 — JLPTExplorer</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1b1e;
            color: #c1c2c5;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container { text-align: center; padding: 2rem; }
          h1 { font-size: 6rem; font-weight: 900; color: #373a40; line-height: 1; }
          p { font-size: 1.125rem; margin: 1rem 0 2rem; }
          a {
            display: inline-block;
            padding: 0.5rem 1.25rem;
            border-radius: 0.375rem;
            background: #1c7ed6;
            color: #fff;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
          }
          a:hover { background: #1971c2; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>404</h1>
          <p>Page not found.</p>
          <a href="/en">Back to home</a>
        </div>
      </body>
    </html>
  );
}
