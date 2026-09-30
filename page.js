(function () {
  window.FORGE_OFFER = {
    monthly: "£249",
    monthlyTerm: "a month for 12 months",
    setup: "£495",
    laterMonthly: "£349",
    laterSetup: "£795",
    seats: 10,
    email: "steve.forge.uk@gmail.com"
  };

  var offer = window.FORGE_OFFER;
  function setText(sel, val) {
    document.querySelectorAll(sel).forEach(function (el) { el.textContent = val; });
  }
  setText("[data-offer-monthly]", offer.monthly);
  setText("[data-offer-term]", offer.monthlyTerm);
  setText("[data-offer-setup]", offer.setup);
  setText("[data-offer-later-m]", offer.laterMonthly);
  setText("[data-offer-later-s]", offer.laterSetup);
  setText("[data-offer-seats]", String(offer.seats));

  var toggle = document.querySelector("[data-nav-toggle]");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var withoutDay = [
    ["16:37", "Site finished."],
    ["17:14", "Customer message. You’ll look later."],
    ["18:05", "Quote. Kitchen table."],
    ["19:22", "Photos. Which phone was it."],
    ["20:03", "Tomorrow. Who’s where."],
    ["20:41", "The invoice you meant to send on Tuesday."]
  ];
  var withDay = [
    ["16:37", "Site finished. Survey already on the job."],
    ["17:14", "Customer message sits on the same record. Draft waiting."],
    ["18:05", "Quote draft exists from the survey. You check it."],
    ["19:22", "Photos are not a treasure hunt."],
    ["20:03", "Tomorrow is already a list."],
    ["20:41", "Completed work not invoiced is flagged. Nothing sent until you say so."]
  ];
  var timeline = document.querySelector("[data-timeline]");
  var hint = document.querySelector("[data-shift-hint]");
  var payoff = document.querySelector("[data-shift-payoff]");

  function renderDay(which) {
    if (!timeline) return;
    var rows = which === "with" ? withDay : withoutDay;
    timeline.innerHTML = rows.map(function (r) {
      return "<li><time>" + r[0] + "</time><span>" + r[1] + "</span></li>";
    }).join("");
    if (hint) {
      hint.textContent = which === "with"
        ? "Same hours. The office was already moving."
        : "This is the second shift. Nobody booked it. It still happens.";
    }
    if (payoff) {
      payoff.textContent = which === "with"
        ? "You were on the roof. Forge was running the office."
        : "What if the business had already been doing some of this while you were working?";
    }
  }
  renderDay("without");
  document.querySelectorAll("[data-shift]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-shift]").forEach(function (b) {
        b.classList.toggle("on", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      renderDay(btn.getAttribute("data-shift"));
    });
  });

  var stages = [
    { name: "Enquiry", title: "It lands. The job begins.", copy: "WhatsApp, website, email or a missed call. Forge does not care which door it used.", carried: "Carried forward: the message. 14 Oakham Close. Leaking since the storm.", customer: "—", property: "—", next: "Waiting", value: "—" },
    { name: "Customer", title: "A customer and a property appear.", copy: "You are not retyping a name you already know, and the address does not die in a thread.", carried: "Carried forward: Helen. 14 Oakham Close.", customer: "Helen", property: "14 Oakham Close", next: "Survey", value: "—" },
    { name: "Survey", title: "The survey does not start a new file.", copy: "Photos and a voice note attach to the same job. Findings stay with the leak, not on Dave’s phone.", carried: "Carried forward: IMG_1847.JPG and the valley note.", customer: "Helen", property: "14 Oakham Close", next: "Findings", value: "—" },
    { name: "Quote", title: "The quote is the same job, priced.", copy: "You still check the number. The address is not typed a third time.", carried: "Carried forward: scope, photos, £6,400 draft.", customer: "Helen", property: "14 Oakham Close", next: "You check it", value: "£6,400" },
    { name: "Follow-up", title: "The clock starts when the quote leaves.", copy: "Eleven days quiet is a fact on the job, not a feeling in someone’s head.", carried: "Carried forward: sent date, silence, next chase. Draft waiting.", customer: "Helen", property: "14 Oakham Close", next: "Chase draft", value: "£6,400" },
    { name: "Job", title: "Accepted work becomes the job.", copy: "No copying lines into a new system. Variations stay on the same record.", carried: "Carried forward: the quoted scope, the address, the photos.", customer: "Helen", property: "14 Oakham Close", next: "On site", value: "£6,400" },
    { name: "Invoice", title: "Completion makes the invoice possible.", copy: "Prepared. Not sent. Payment closes the same thread you opened on a wet Tuesday.", carried: "Carried forward: the commercial truth of job 1847.", customer: "Helen", property: "14 Oakham Close", next: "Ask me", value: "£6,400" }
  ];

  var stageList = document.querySelector("[data-stages]");
  var kickerEl = document.querySelector("[data-stage-kicker]");
  var titleEl = document.querySelector("[data-stage-title]");
  var copyEl = document.querySelector("[data-stage-copy]");
  var carriedEl = document.querySelector("[data-stage-carried]");

  function fillDocket(s) {
    setText("[data-docket-customer]", s.customer);
    setText("[data-docket-property]", s.property);
    setText("[data-docket-next]", s.next);
    setText("[data-docket-value]", s.value);
  }

  function showStage(i) {
    var s = stages[i];
    if (!s) return;
    if (kickerEl) kickerEl.textContent = String(i + 1).padStart(2, "0") + " — " + s.name;
    if (titleEl) titleEl.textContent = s.title;
    if (copyEl) copyEl.textContent = s.copy;
    if (carriedEl) carriedEl.textContent = s.carried;
    if (stageList) {
      stageList.querySelectorAll("button").forEach(function (b, n) {
        b.classList.toggle("on", n === i);
      });
    }
    fillDocket(s);
  }

  if (stageList) {
    stageList.innerHTML = stages.map(function (s, i) {
      return "<li><button type=\"button\" data-stage=\"" + i + "\"" + (i === 0 ? " class=\"on\"" : "") + ">" +
        String(i + 1).padStart(2, "0") + " " + s.name + "</button></li>";
    }).join("");
    stageList.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-stage]");
      if (!btn) return;
      showStage(Number(btn.getAttribute("data-stage")));
    });
    showStage(0);
  }

  var modeCopy = {
    suggest: { stamp: "WAITING ON YOU", text: "Forge pointed at the invoice. You still do the work." },
    draft: { stamp: "WAITING ON YOU", text: "Invoice written. You send it — or you don’t." },
    ask: { stamp: "WAITING ON YOU", text: "Prepared. Nothing leaves until you say so." },
    auto: { stamp: "PREPARED", text: "Only the repetitive work you have allowed. This invoice still waits — money stays off Automatic here." }
  };
  document.querySelectorAll("[data-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-mode]").forEach(function (b) { b.classList.toggle("on", b === btn); });
      var m = modeCopy[btn.getAttribute("data-mode")];
      var stamp = document.querySelector("[data-mode-stamp]");
      var copy = document.querySelector("[data-mode-copy]");
      var docketStamp = document.querySelector("[data-docket-stamp]");
      if (stamp) stamp.textContent = m.stamp;
      if (copy) copy.textContent = m.text;
      if (docketStamp) docketStamp.textContent = btn.getAttribute("data-mode") === "auto" ? "Prepared" : "Ask me";
    });
  });

  var bp = { step: 0, last: 4, trade: "", team: "", channels: [], pain: "" };
  var panels = document.querySelectorAll("[data-step]");
  var dots = document.querySelector("[data-bp-steps]");
  var backBtn = document.querySelector("[data-bp-back]");
  var nextBtn = document.querySelector("[data-bp-next]");
  var submitBtn = document.querySelector("[data-bp-submit]");
  var drawing = document.querySelector("[data-drawing]");
  var form = document.querySelector("[data-bp-form]");

  function paintDots() {
    if (!dots) return;
    dots.innerHTML = "";
    for (var i = 0; i <= bp.last; i++) {
      var el = document.createElement("i");
      if (i <= bp.step) el.className = "on";
      dots.appendChild(el);
    }
  }

  function canAdvance() {
    if (bp.step === 0) return !!bp.trade;
    if (bp.step === 1) return !!bp.team;
    if (bp.step === 2) return bp.channels.length > 0;
    if (bp.step === 3) return !!bp.pain;
    return true;
  }

  function emphasis() {
    if (bp.pain === "Quotes too slow") return "Survey → quote draft → Ask me before send";
    if (bp.pain === "Enquiries dying") return "Capture the door → draft reply → Ask me";
    if (bp.pain === "Invoices late") return "Completion → invoice prepared, not sent";
    if (bp.pain === "Follow-ups slipping") return "Quote leaves → follow-up clock → draft waiting";
    if (bp.pain === "Too many apps") return "One job thread. Xero can stay.";
    return "Owner stops being the only memory";
  }

  function renderDrawing() {
    if (!drawing) return;
    var doors = bp.channels.length ? bp.channels.join(" · ") : "incoming work";
    var trade = bp.trade || "your trade";
    drawing.innerHTML =
      "<p><strong>" + trade.toUpperCase() + "</strong> · " + (bp.team || "team") + "</p>" +
      "<div class=\"flow\">" +
      "<span class=\"chip\">" + doors + "</span><span class=\"arrow\">→</span>" +
      "<span class=\"chip\">One job thread</span><span class=\"arrow\">→</span>" +
      "<span class=\"chip\">Drafts</span><span class=\"arrow\">→</span>" +
      "<span class=\"chip\">Ask me</span>" +
      "</div>" +
      "<p>First emphasis: " + emphasis() + ".</p>" +
      "<p>Xero can stay. Staff use photos, messages, jobs. You own the file.</p>";
  }

  function showBp() {
    panels.forEach(function (p) {
      p.classList.toggle("on", Number(p.getAttribute("data-step")) === bp.step);
    });
    if (backBtn) backBtn.hidden = bp.step === 0;
    if (nextBtn) nextBtn.hidden = bp.step === bp.last;
    if (submitBtn) submitBtn.hidden = bp.step !== bp.last;
    if (bp.step === bp.last) renderDrawing();
    paintDots();
    var tradeH = document.querySelector("[data-hidden=\"trade\"]");
    var teamH = document.querySelector("[data-hidden=\"team\"]");
    var chH = document.querySelector("[data-hidden=\"channels\"]");
    var painH = document.querySelector("[data-hidden=\"pain\"]");
    if (tradeH) tradeH.value = bp.trade;
    if (teamH) teamH.value = bp.team;
    if (chH) chH.value = bp.channels.join(", ");
    if (painH) painH.value = bp.pain;
  }

  if (form) {
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "q_trade") bp.trade = t.value;
      if (t.name === "q_team") bp.team = t.value;
      if (t.name === "q_pain") bp.pain = t.value;
      if (t.name === "q_ch") {
        bp.channels = Array.prototype.filter.call(form.querySelectorAll("[name=q_ch]"), function (c) {
          return c.checked;
        }).map(function (c) { return c.value; });
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (!canAdvance()) {
        nextBtn.textContent = "Pick one to continue";
        setTimeout(function () { nextBtn.textContent = "Continue"; }, 1400);
        return;
      }
      if (bp.step < bp.last) bp.step += 1;
      showBp();
    });
  }
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      if (bp.step > 0) bp.step -= 1;
      showBp();
    });
  }
  showBp();
})();
