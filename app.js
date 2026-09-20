(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Scroll reveal ── */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Trade chips ── */
  var TRADE_COPY = {
    roofing: {
      title: "Roofing",
      blurb: "Messy WhatsApp enquiries become survey-ready jobs. Quotes draft from your rates and past work. Follow-ups chase warm leads while you’re on the roof.",
      followUp: "Just checking you got the roofing quote. Happy to tweak scope or timing if that helps — shall I hold the survey slot for next week?"
    },
    plumbing: {
      title: "Plumbing",
      blurb: "Emergency and planned jobs sorted in one inbox. AI drafts replies with your call-out rules, builds quotes from common kit, and chases deposits so jobs don’t stall.",
      followUp: "Just checking you got the bathroom suite quote. Happy to tweak scope or timing if that helps — shall I hold the slot for next fortnight?"
    },
    electrical: {
      title: "Electrical",
      blurb: "Rewires, consumer units, and snag lists stay organised. AI turns site notes into clear quotes, flags unfinished follow-ups, and keeps certificates and invoices moving.",
      followUp: "Just checking you got the rewire quote. Happy to adjust scope or phasing — want me to pencil in a start window?"
    },
    landscaping: {
      title: "Landscaping",
      blurb: "Seasonal enquiries stop dying in the group chat. AI drafts site-visit replies, shapes quotes from photos and notes, and follows up before the weather window closes.",
      followUp: "Just checking you got the garden redesign quote. Happy to phase the work or adjust materials — shall I hold a dig-out slot?"
    },
    builders: {
      title: "Builders",
      blurb: "Extensions and refurbs need more than a CRM. AI helps triage enquiries, draft staged quotes, chase decisions, and keep cashflow admin off your evenings.",
      followUp: "Just checking you got the extension quote. Happy to walk through stages or timings — shall I hold the site start for next month?"
    }
  };

  function initTradeChips() {
    var buttons = document.querySelectorAll(".chip-btn");
    var blurb = document.getElementById("trade-blurb");
    var quoteAi = document.getElementById("quote-ai-copy");
    if (!buttons.length || !blurb) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-trade");
        var data = TRADE_COPY[key];
        if (!data) return;

        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });

        function apply() {
          blurb.innerHTML = "<h3>" + data.title + "</h3><p>" + data.blurb + "</p>";
          if (quoteAi) quoteAi.textContent = data.followUp;
          blurb.classList.remove("is-fading");
        }

        if (reduceMotion) {
          apply();
        } else {
          blurb.classList.add("is-fading");
          setTimeout(apply, 180);
        }
      });
    });
  }

  /* ── FAQ accordion ── */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var trigger = item.querySelector(".faq-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        var open = item.classList.contains("is-open");
        items.forEach(function (other) {
          other.classList.remove("is-open");
          var t = other.querySelector(".faq-trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ── Floating sales chat (Forge Sales handoff) ── */
  var CHAT_TRADES = ["Roofing", "Other trade"];
  var CHAT_TEAM = ["Just you", "2–5", "6–15", "15+"];
  var CHAT_INTENT = ["Founding Partner", "Book a call", "Just looking"];

  function initChat() {
    var fab = document.getElementById("chat-fab");
    var panel = document.getElementById("chat-panel");
    var messages = document.getElementById("chat-messages");
    var options = document.getElementById("chat-options");
    var inputRow = document.getElementById("chat-input-row");
    var input = document.getElementById("chat-input");
    var sendBtn = document.getElementById("chat-send");
    var handoff = document.getElementById("chat-handoff");
    var mailtoLink = document.getElementById("chat-mailto");
    if (!fab || !panel || !messages) return;

    var state = {
      step: "greet",
      name: "",
      company: "",
      trade: "",
      team: "",
      contact: "",
      intent: "",
      started: false
    };

    function setOpen(open) {
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      fab.setAttribute("aria-label", open ? "Close sales chat" : "Open sales chat");
      if (open && !state.started) {
        state.started = true;
        beginChat();
      }
    }

    fab.addEventListener("click", function () {
      setOpen(fab.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && fab.getAttribute("aria-expanded") === "true") {
        setOpen(false);
      }
    });

    function clearOptions() {
      options.innerHTML = "";
    }

    function hideInput() {
      inputRow.classList.add("hidden");
      input.value = "";
    }

    function showInput(placeholder) {
      handoff.classList.add("hidden");
      inputRow.classList.remove("hidden");
      input.placeholder = placeholder || "Type here…";
      if (!reduceMotion) input.focus();
    }

    function addBot(text) {
      var el = document.createElement("div");
      el.className = "chat-msg bot";
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function addUser(text) {
      var el = document.createElement("div");
      el.className = "chat-msg user";
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping(cb) {
      if (reduceMotion) {
        cb();
        return;
      }
      var typing = document.createElement("div");
      typing.className = "chat-typing";
      typing.setAttribute("aria-hidden", "true");
      typing.innerHTML = "<span></span><span></span><span></span>";
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      setTimeout(function () {
        typing.remove();
        cb();
      }, 550);
    }

    function showOptions(list, onPick) {
      clearOptions();
      handoff.classList.add("hidden");
      list.forEach(function (label) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chat-option";
        btn.textContent = label;
        btn.addEventListener("click", function () {
          clearOptions();
          onPick(label);
        });
        options.appendChild(btn);
      });
    }

    function beginChat() {
      messages.innerHTML = "";
      clearOptions();
      hideInput();
      handoff.classList.add("hidden");
      state.step = "name";
      showTyping(function () {
        addBot("Hi — I’m Forge Sales. We help UK trade firms run quotes, jobs and follow-ups without WhatsApp chaos. Got 30 seconds?");
        showTyping(function () {
          addBot("What’s your first name?");
          showInput("First name");
        });
      });
    }

    function askCompany() {
      state.step = "company";
      showTyping(function () {
        addBot("Company name?");
        showInput("Company name");
      });
    }

    function askTrade() {
      state.step = "trade";
      showTyping(function () {
        addBot("Are you roofing, or another trade?");
        showOptions(CHAT_TRADES, function (trade) {
          addUser(trade);
          if (trade === "Other trade") {
            state.step = "trade_other";
            showTyping(function () {
              addBot("Which trade?");
              showInput("e.g. plumbing, electrical");
            });
          } else {
            state.trade = trade;
            askTeam();
          }
        });
      });
    }

    function askTeam() {
      state.step = "team";
      showTyping(function () {
        addBot("Rough team size?");
        showOptions(CHAT_TEAM, function (team) {
          state.team = team;
          addUser(team);
          askContact();
        });
      });
    }

    function askContact() {
      state.step = "contact";
      showTyping(function () {
        addBot("Best phone or email?");
        showInput("Phone or email");
      });
    }

    function askIntent() {
      state.step = "intent";
      showTyping(function () {
        addBot("What do you want?");
        showOptions(CHAT_INTENT, function (intent) {
          state.intent = intent;
          addUser(intent);
          finishHandoff();
        });
      });
    }

    function sheetRow() {
      return [state.name, state.company, state.trade, state.team, state.contact, state.intent, new Date().toISOString()].join(" | ");
    }

    function buildMailto() {
      var subject = "[Forge lead] " + state.name + " — " + state.trade;
      var body = [
        "Forge inbound lead (site chat — assistant, not live Steve)",
        "",
        "Name: " + state.name,
        "Company: " + state.company,
        "Trade: " + state.trade,
        "Team size: " + state.team,
        "Contact: " + state.contact,
        "Intent: " + state.intent,
        "",
        "Sheet row:",
        sheetRow(),
        "",
        "Founding Partner: £249/mo for 12 months (vs £349) + £495 setup — 10 places.",
        ""
      ].join("\n");
      return (
        "mailto:steveallan2018@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body)
      );
    }

    function finishHandoff() {
      hideInput();
      clearOptions();
      showTyping(function () {
        addBot("Founding Partner — £249/mo for 12 months (vs £349 list) + £495 setup. Only 10 places.");
        addBot("Send your details to Forge Sales below (we’ll reply same day), or book a call. This isn’t live Steve — it’s our sales assistant.");
        if (mailtoLink) mailtoLink.href = buildMailto();
        handoff.classList.remove("hidden");
        state.step = "done";
      });
    }

    function submitInput() {
      var val = (input.value || "").trim();
      if (!val) return;
      addUser(val);
      hideInput();

      if (state.step === "name") {
        state.name = val;
        askCompany();
        return;
      }
      if (state.step === "company") {
        state.company = val;
        askTrade();
        return;
      }
      if (state.step === "trade_other") {
        state.trade = val;
        askTeam();
        return;
      }
      if (state.step === "contact") {
        state.contact = val;
        askIntent();
      }
    }

    if (sendBtn) sendBtn.addEventListener("click", submitInput);
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          submitInput();
        }
      });
    }
  }

  /* ── Boot ── */
  initReveal();
  initTradeChips();
  initFaq();
  initChat();
})();
