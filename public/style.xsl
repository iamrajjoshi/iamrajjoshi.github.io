<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="/rss/channel/title" /> — RSS</title>
        <style>
          @font-face {
            font-family: "Figtree";
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url("/fonts/figtree-latin-400-normal.woff2") format("woff2");
          }
          @font-face {
            font-family: "Figtree";
            font-style: italic;
            font-weight: 400;
            font-display: swap;
            src: url("/fonts/figtree-latin-400-italic.woff2") format("woff2");
          }
          @font-face {
            font-family: "Figtree";
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: url("/fonts/figtree-latin-600-normal.woff2") format("woff2");
          }
          :root {
            color-scheme: light dark;
            --background: #fff9eb;
            --text: #28221c;
            --muted: #56534d;
            --link: #0f766e;
            --rule: rgba(40, 34, 28, 0.18);
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--background);
            color: var(--text);
            font-family: "Figtree", system-ui, sans-serif;
            font-size: 19px;
            line-height: 1.6;
          }
          main {
            width: min(calc(100% - 2rem), 45rem);
            margin: 0 auto;
            padding: 4rem 0;
          }
          h1 {
            margin: 0;
            font-size: clamp(2.25rem, 5.5vw, 3rem);
            font-weight: 600;
            letter-spacing: -0.032em;
            line-height: 1.05;
          }
          .feed-note {
            margin: 1rem 0 0;
            color: var(--muted);
          }
          .rule {
            width: 3rem;
            height: 1px;
            margin: 1.5rem 0 3rem;
            background: var(--link);
          }
          .items { margin: 0; padding: 0; list-style: none; }
          .item { padding: 0.7rem 0; }
          .item a {
            color: var(--text);
            font-size: 1.0625rem;
            font-weight: 600;
            text-decoration: none;
          }
          .item a:hover { color: var(--link); }
          time {
            display: block;
            color: var(--muted);
            font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
            font-size: 0.75rem;
            letter-spacing: 0.01em;
          }
          .site-link {
            display: inline-block;
            margin-top: 2rem;
            color: var(--link);
            text-underline-offset: 0.2em;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background: #28221c;
              --text: #fff9eb;
              --muted: #b9ad9a;
              --link: #67c7ba;
              --rule: rgba(255, 249, 235, 0.17);
            }
          }
        </style>
      </head>
      <body>
        <main>
          <h1><xsl:value-of select="/rss/channel/title" /></h1>
          <p class="feed-note">
            This is the RSS feed. Copy this URL into your reader to subscribe.
          </p>
          <div class="rule"></div>
          <ul class="items">
            <xsl:for-each select="/rss/channel/item">
              <li class="item">
                <time><xsl:value-of select="pubDate" /></time>
                <a>
                  <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
                  <xsl:value-of select="title" />
                </a>
              </li>
            </xsl:for-each>
          </ul>
          <a class="site-link">
            <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link" /></xsl:attribute>
            Visit the blog →
          </a>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
