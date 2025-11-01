// * ------------------------------------------------ fetch hook

type FetchHandler = (url: RequestInfo | URL, response: Response) => void;

/** singleton */
if (!globalThis.fetchHook) {
  const handlers = new Set<FetchHandler>();

  const originalFetch = globalThis.fetch;
  globalThis.fetch = ((url: RequestInfo | URL, options: RequestInit) => {
    return originalFetch(url, options).then(async (response) => {
      handlers.forEach((h) => {
        try {
          h(url, response.clone());
        } catch (err) {
          console.error(err);
        }
      });
      return response;
    });
  }) as typeof fetch;

  globalThis.fetchHook = {
    add: (handler: FetchHandler) => handlers.add(handler),
    remove: (handler: FetchHandler) => handlers.delete(handler),
  };
}

export const fetchHook = globalThis.fetchHook as {
  add: (handler: FetchHandler) => void;
  remove: (handler: FetchHandler) => void;
};

// * ------------------------------------------------ xhr hook

type XhrHandler = (xhr: XMLHttpRequest) => void;

/** singleton */
if (!globalThis.xhrHook) {
  if (!globalThis.XMLHttpRequest) {
    globalThis.xhrHook = { add: () => {}, remove: () => {} };
  } else {
    const handlers = new Set<XhrHandler>();

    const originalSend = globalThis.XMLHttpRequest.prototype.send;
    globalThis.XMLHttpRequest.prototype.send = function () {
      this.addEventListener("load", () => {
        handlers.forEach((h) => {
          try {
            h(this);
          } catch (err) {
            console.error(err);
          }
        });
      });
      return originalSend.apply(this, arguments);
    };

    globalThis.xhrHook = {
      add: (handler: XhrHandler) => handlers.add(handler),
      remove: (handler: XhrHandler) => handlers.delete(handler),
    };
  }
}

export const xhrHook = globalThis.xhrHook as {
  add: (handler: XhrHandler) => void;
  remove: (handler: XhrHandler) => void;
};
