import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "../components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "Volunexa — Community Event & Volunteer Management Platform",
  description:
    "Discover local community events, register for volunteer opportunities in real-time, and manage participation with AI-assisted tools.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 1. Intercept Element.prototype.setAttribute
                  var origSet = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, val) {
                    if (
                      name === 'bis_skin_checked' ||
                      name === 'bis_register' ||
                      (typeof name === 'string' && name.indexOf('__processed_') === 0)
                    ) {
                      return;
                    }
                    return origSet.apply(this, arguments);
                  };

                  // 2. Intercept Element.prototype.setAttributeNS
                  var origSetNS = Element.prototype.setAttributeNS;
                  Element.prototype.setAttributeNS = function(ns, name, val) {
                    if (
                      name === 'bis_skin_checked' ||
                      name === 'bis_register' ||
                      (typeof name === 'string' && name.indexOf('__processed_') === 0)
                    ) {
                      return;
                    }
                    return origSetNS.apply(this, arguments);
                  };

                  // 3. MutationObserver to strip attributes if added by extension content scripts
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes') {
                        var attr = m.attributeName;
                        if (attr === 'bis_skin_checked' || attr === 'bis_register') {
                          m.target.removeAttribute(attr);
                        }
                      }
                    }
                  });
                  if (document.documentElement) {
                    observer.observe(document.documentElement, {
                      attributes: true,
                      subtree: true,
                      attributeFilter: ['bis_skin_checked', 'bis_register'],
                    });
                  }

                  // 4. Suppress React 19 hydration overlay warning for extension-injected attributes
                  var origError = console.error;
                  console.error = function() {
                    for (var i = 0; i < arguments.length; i++) {
                      var arg = arguments[i];
                      if (
                        typeof arg === 'string' &&
                        (arg.indexOf('bis_skin_checked') !== -1 || arg.indexOf('bis_register') !== -1 || arg.indexOf('M_ID') !== -1)
                      ) {
                        return;
                      }
                    }
                    return origError.apply(console, arguments);
                  };

                  // 5. Intercept unhandled extension promise rejections (e.g. IDM / third-party M_ID)
                  window.addEventListener('unhandledrejection', function(event) {
                    var msg = (event && event.reason && (event.reason.message || String(event.reason))) || '';
                    if (msg.indexOf('M_ID') !== -1 || msg.indexOf('bis_skin_checked') !== -1) {
                      if (event.preventDefault) event.preventDefault();
                    }
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-[#090e13] text-slate-900 dark:text-slate-100 transition-colors"
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
