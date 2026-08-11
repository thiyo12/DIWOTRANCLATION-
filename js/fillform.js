(function () {
  "use strict";

  var state = {
    step: 0,
    docType: null,
    fromLang: "EN",
    toLang: "DE",
    mode: "fill",
    fields: "",
    customer: "",
    email: "",
    phone: "",
    notes: "",
    canton: "Zurich",
    urgent: false,
    lastMinute: false,
    consent: false,
    submitting: false
  };

  var docTypes = [];
  var el = {
    stepper: null,
    stepTitle: null,
    stepHint: null,
    stepContent: null,
    btnNext: null,
    btnPrev: null,
    summaryBody: null
  };

  function t(key) { return SSX.t(key); }

  function docTypeName(dt) {
    if (!dt) return "";
    var key = "name_" + SSX.lang;
    return dt[key] || dt.name_en;
  }

  function stepTitles() {
    return [t("fill.step1"), t("fill.step2"), t("fill.step3")];
  }
  function stepHints() {
    return [t("fill.step1Hint"), t("fill.step2Hint"), t("fill.step3Hint")];
  }

  function modeLabel(m) {
    if (m === "translate") return t("fill.modeTranslate");
    if (m === "both") return t("fill.modeBoth");
    return t("fill.modeFill");
  }

  function init() {
    el.stepper = document.getElementById("stepper");
    el.stepTitle = document.getElementById("step-title");
    el.stepHint = document.getElementById("step-hint");
    el.stepContent = document.getElementById("step-content");
    el.btnNext = document.getElementById("btn-next");
    el.btnPrev = document.getElementById("btn-prev");
    el.summaryBody = document.getElementById("summary-body");

    el.btnNext.addEventListener("click", onNext);
    el.btnPrev.addEventListener("click", onPrev);
    window.addEventListener("ssx:lang", function () { setStep(state.step); });

    if (SSX.http) {
      SSX.request("GET", "/api/catalog")
        .then(function (c) {
          docTypes = c.docTypes || [];
          setStep(0);
        })
        .catch(function () {
          setStep(0);
        });
    } else {
      setStep(0);
    }
  }

  function setStep(i) {
    state.step = i;
    el.btnPrev.style.visibility = i === 0 ? "hidden" : "visible";
    renderStepper();
    render();
  }

  function renderStepper() {
    el.stepper.innerHTML = "";
    var titles = stepTitles();
    for (var i = 0; i < titles.length; i++) {
      var s = document.createElement("div");
      s.className = "step";
      s.innerHTML = '<span class="dot">' + (i + 1) + '</span><span>' + titles[i] + '</span>';
      if (i < titles.length - 1) s.innerHTML += '<span class="step-line"></span>';
      s.classList.toggle("done", i < state.step);
      s.classList.toggle("active", i === state.step);
      el.stepper.appendChild(s);
    }
  }

  function onNext() {
    if (state.submitting) return;
    if (!validate()) return;
    if (state.step === stepCount() - 1) { submit(); return; }
    setStep(state.step + 1);
  }

  function stepCount() { return 3; }

  function onPrev() {
    if (state.step === 0) return;
    setStep(state.step - 1);
  }

  function render() {
    var titles = stepTitles();
    var hints = stepHints();
    el.stepTitle.textContent = titles[state.step];
    el.stepHint.textContent = hints[state.step];
    el.btnNext.textContent = state.step === stepCount() - 1 ? t("fill.confirm") : t("common.continue");
    el.btnNext.disabled = false;
    var content = el.stepContent;
    content.innerHTML = "";
    if (state.step === 0) renderDocType(content);
    else if (state.step === 1) renderLangMode(content);
    else renderDetails(content);
    renderSummary();
    if (state.step === 0) content.scrollIntoView({ block: "nearest" });
  }

  function renderDocType(c) {
    c.innerHTML = '<p class="step-hint" style="margin-bottom:16px;">' + t("fill.docTypeLabel") + '</p><div class="select-grid"></div>';
    var grid = c.querySelector(".select-grid");
    if (!docTypes.length) {
      grid.innerHTML = '<p class="muted">' + t("common.loading") + '</p>';
      return;
    }
    docTypes.forEach(function (dt) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sel-card" + (state.docType && state.docType.id === dt.id ? " selected" : "");
      b.innerHTML = SSX.icon(dt.icon || "file") + '<span>' + SSX.helpers.esc(docTypeName(dt)) + '</span>';
      b.onclick = function () {
        state.docType = dt;
        grid.querySelectorAll(".sel-card").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        renderSummary();
      };
      grid.appendChild(b);
    });
  }

  function renderLangMode(c) {
    var langBtn = function (code, active) {
      return '<button type="button" class="lang-pill' + (active ? " selected" : "") + '" data-code="' + code + '">' + SSX.t("lang." + code) + '</button>';
    };
    c.innerHTML =
      '<p class="step-hint" style="margin-bottom:16px;">' + t("fill.modeLabel") + '</p>' +
      '<div class="mode-grid">' +
        '<button type="button" class="mode-card" id="m-translate">' +
          '<div class="mode-icon">' + SSX.icon("translate") + '</div><h3>' + t("fill.modeTranslate") + '</h3><p>' + t("fill.modeTranslateBody") + '</p>' +
        '</button>' +
        '<button type="button" class="mode-card" id="m-fill">' +
          '<div class="mode-icon">' + SSX.icon("edit") + '</div><h3>' + t("fill.modeFill") + '</h3><p>' + t("fill.modeFillBody") + '</p>' +
        '</button>' +
        '<button type="button" class="mode-card" id="m-both">' +
          '<div class="mode-icon">' + SSX.icon("sparkles") + '</div><h3>' + t("fill.modeBoth") + '</h3><p>' + t("fill.modeBothBody") + '</p>' +
        '</button>' +
      '</div>' +
      '<div class="field" style="margin-top:22px;"><label>' + t("fill.langFromLabel") + '</label><div class="lang-pills" id="from-pills">' +
        SSX.languages.map(function (l) { return langBtn(l.code, state.fromLang === l.code); }).join("") +
      '</div></div>' +
      '<div class="field"><label>' + t("fill.langToLabel") + '</label><div class="lang-pills" id="to-pills">' +
        SSX.languages.map(function (l) { return langBtn(l.code, state.toLang === l.code); }).join("") +
      '</div></div>';

    function wire(selector, setter) {
      c.querySelector(selector).addEventListener("click", function (e) {
        var b = e.target && e.target.closest ? e.target.closest(".lang-pill") : null;
        if (!b) return;
        var code = b.getAttribute("data-code");
        setter(code);
        c.querySelectorAll(selector + " .lang-pill").forEach(function (x) {
          x.classList.toggle("selected", x.getAttribute("data-code") === code);
        });
        renderSummary();
      });
    }
    wire("#from-pills", function (code) { state.fromLang = code; });
    wire("#to-pills", function (code) { state.toLang = code; });

    function setMode(m) {
      state.mode = m;
      ["m-translate", "m-fill", "m-both"].forEach(function (id) {
        c.querySelector("#" + id).classList.toggle("selected", id === "m-" + m);
      });
      renderSummary();
    }
    c.querySelector("#m-translate").onclick = function () { setMode("translate"); };
    c.querySelector("#m-fill").onclick = function () { setMode("fill"); };
    c.querySelector("#m-both").onclick = function () { setMode("both"); };
    setMode(state.mode);
  }

  function renderDetails(c) {
    c.innerHTML =
      '<div class="field" style="margin-top:22px;"><label>' + t("fill.fieldLabel") + '</label>' +
      '<textarea class="textarea" id="d-fields" rows="4" placeholder="' + t("fill.fieldPh") + '">' + SSX.helpers.esc(state.fields) + '</textarea>' +
      '<div class="error-msg hidden" id="d-fields-err">' + t("fill.fieldPh") + '</div></div>' +
      '<div class="field"><label>' + t("booking.contact") + '</label>' +
        '<div class="two-col">' +
          '<div class="field"><input class="input" id="d-name" placeholder="' + t("booking.firstName") + '" value="' + SSX.helpers.esc(state.customer) + '"></div>' +
          '<div class="field"><input class="input" id="d-email" type="email" placeholder="' + t("booking.email") + '" value="' + SSX.helpers.esc(state.email) + '"></div>' +
          '<div class="field"><input class="input" id="d-phone" placeholder="' + t("booking.phone") + '" value="' + SSX.helpers.esc(state.phone) + '"></div>' +
        '</div>' +
      '</div>' +
      '<p class="tiny muted" style="margin-top:4px;">' + t("fill.ratesNote") + '</p>' +
      '<div class="field" style="margin-top:14px;"><label>' + t("fill.options") + '</label>' +
        '<label class="opt-line"><input type="checkbox" id="d-urgent" ' + (state.urgent ? "checked" : "") + '> <span>' + t("fill.urgent") + ' (+' + (Number(SSX.settings.docUrgentFlat) || 15) + ')</span></label>' +
        '<label class="opt-line"><input type="checkbox" id="d-lastmin" ' + (state.lastMinute ? "checked" : "") + '> <span>' + t("fill.lastMinute") + ' (+' + (Number(SSX.settings.docLastMinute) || 25) + ')</span></label>' +
      '</div>' +
      '<div class="field"><label>' + t("fill.note") + '</label><textarea class="textarea" id="d-notes" placeholder="' + t("fill.notePh") + '">' + SSX.helpers.esc(state.notes) + '</textarea></div>' +
      '<label class="consent-line" style="margin:14px 0;"><input type="checkbox" id="d-consent"> <span>' + t("privacy.consent") + ' (<a href="privacy.html" target="_blank" rel="noopener">' + t("privacy.link") + '</a>)</span></label>' +
      '<input type="text" name="website" id="d-website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<p class="tiny muted" style="margin-top:6px;">' + SSX.icon("file") + ' ' + t("fill.emailNote") + '</p>';

    function bind(id, key) {
      var x = c.querySelector(id);
      x.addEventListener("input", function () { state[key] = x.value; });
    }
    bind("#d-fields", "fields");
    bind("#d-name", "customer");
    bind("#d-email", "email");
    bind("#d-phone", "phone");
    bind("#d-notes", "notes");
    var urg = c.querySelector("#d-urgent");
    if (urg) urg.addEventListener("change", function () { state.urgent = urg.checked; renderSummary(); });
    var lm = c.querySelector("#d-lastmin");
    if (lm) lm.addEventListener("change", function () { state.lastMinute = lm.checked; renderSummary(); });
    var cons = c.querySelector("#d-consent");
    if (cons) cons.addEventListener("change", function () { state.consent = cons.checked; });
  }

  function renderSummary() {
    var body = el.summaryBody;
    body.innerHTML = "";
    if (!state.docType && !state.fromLang) {
      body.innerHTML = '<div class="sum-empty">' + t("fill.summaryEmpty") + '</div>';
      return;
    }
    function line(label, value) {
      var d = document.createElement("div");
      d.className = "sum-line";
      d.innerHTML = '<span>' + label + '</span><b>' + SSX.helpers.esc(value) + '</b>';
      body.appendChild(d);
    }
    if (state.docType) line(t("fill.docTypeLabel"), docTypeName(state.docType));
    if (state.fromLang) line(t("fill.mode"), modeLabel(state.mode));
    line(t("fill.langFromLabel"), SSX.t("lang." + state.fromLang) + " → " + SSX.t("lang." + state.toLang));
    if (state.customer) line(t("booking.firstName"), state.customer);
    if (state.email) line(t("booking.email"), state.email);
    var est = Number(SSX.settings.docFlat) || 0;
    if (state.urgent) est += Number(SSX.settings.docUrgentFlat) || 0;
    if (state.lastMinute) est += Number(SSX.settings.docLastMinute) || 0;
    line(t("fill.feeEstimate"), "CHF " + est.toFixed(2));
  }

  function validate() {
    var msg = "";
    if (state.step === 0 && !state.docType) msg = t("fill.errDoc");
    else if (state.step === 1) {
      if (state.fromLang === state.toLang) msg = t("fill.sameLang");
      else if (!state.mode) msg = t("fill.errMode");
    } else if (state.step === 2) {
      if (!state.customer.trim()) msg = t("err.name");
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email)) msg = t("err.email");
      else if (!state.consent) msg = t("privacy.consentRequired");
    }
    if (msg) {
      SSX.toast(msg, "error");
      return false;
    }
    return true;
  }

  function submit() {
    state.submitting = true;
    el.btnNext.disabled = true;
    el.btnNext.textContent = t("processing");

    var done = function () {
      state.submitting = false;
      el.btnNext.disabled = false;
      el.btnNext.textContent = t("fill.confirm");
    };

    if (SSX.http) {
      SSX.request("POST", "/api/documents", {
        doc_type: state.docType.id,
        customer: state.customer,
        email: state.email,
        phone: state.phone,
        from_lang: state.fromLang,
        to_lang: state.toLang,
        mode: state.mode,
        fields: state.fields.trim() ? state.fields : null,
        urgent: !!state.urgent,
        last_minute: !!state.lastMinute,
        consent: true,
        notes: state.notes,
        website: document.getElementById("d-website") ? document.getElementById("d-website").value : ""
      }).then(function (res) {
        if (res.simulated) {
          window.location.href = "fillform.html?sent=1";
          return;
        }
        SSX.saveLocal("ssx.lastDocRef", res.ref);
        window.location.href = "confirmation.html?ref=" + encodeURIComponent(res.ref) + "&kind=document";
      }).catch(function (err) {
        done();
        SSX.toast(err.message || t("err.general"), "error");
      });
    } else {
      setTimeout(function () {
        var ref = SSX.ref("SSXD");
        SSX.saveLocal("ssx.lastDocRef", ref);
        window.location.href = "confirmation.html?ref=" + encodeURIComponent(ref) + "&kind=document";
      }, 600);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
