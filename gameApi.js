// public/game-api.js
window.GameAPI = (function () {
  let config = {};
  let iframe;

  function postToIframe(message) {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, "*");
    }
  }

  function handleMessage(event) {
    if (!iframe || event.origin !== new URL(iframe.src).origin) return;

    const { type, payload } = event.data || {};

    if (type === "RESIZE_IFRAME" && payload) {
      iframe.style.width = payload.width + "px";
      iframe.style.height = payload.height + "px";
    }

    if (type === "REQUEST_INITIAL_DATA") {
      if (config.userData)
        postToIframe({ type: "SET_USER_DATA", payload: config.userData });
      if (config.gameData)
        postToIframe({ type: "SET_GAME_DATA", payload: config.gameData });
      if (config.returnUrl)
        postToIframe({ type: "SET_RETURN_URL", payload: config.returnUrl });

      if (config.apiMode)
        postToIframe({ type: "SET_API_MODE", payload: config.apiMode });
    }

    if (type === "GAME_RESULT" && typeof config.onResult === "function") {
      config.onResult(payload);
    }
  }

  return {
    init: function (options) {
      config = options || {};
      iframe = document.getElementById(config.iframeId);
      if (!iframe) {
        console.error("GameAPI: iframe not found with id", config.iframeId);
        return;
      }
      window.addEventListener("message", handleMessage);
    },
    sendUserData: function (data) {
      config.userData = data;
      postToIframe({ type: "SET_USER_DATA", payload: data });
    },
    sendGameData: function (data) {
      config.gameData = data;
      postToIframe({ type: "SET_GAME_DATA", payload: data });
    },
    sendReturnUrl: function (data) {
      config.returnUrl = data;
      postToIframe({
        type: "SET_RETURN_URL",
        payload: data,
      });
    },
    destroy: function () {
      window.removeEventListener("message", handleMessage);
    },
  };
})();
