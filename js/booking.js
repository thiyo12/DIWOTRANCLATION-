(function () {
  "use strict";

  var state = {
    step: 0,
    language: null,
    service: null,
    date: "",
    time: "",
    duration: 60,
    mode: "",
    address: "",
    customer: "",
    email: "",
    phone: "",
    notes: "",
    method: "card",
    cardName: "",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
    submitting: false
  };

  var el = {
    stepper: null,
    stepTitle: null,
    stepHint: null,
    stepContent: null,
    btnNext: null,
    btnPrev: null,
    summaryBody: null
  };

  var params = new URLSearchParams(window.location.search);

  function t(key) { return SSX.t(key); }

  function stepTitles() {
    return [
      t("booking.step1"),
      t("booking.step2"),
      t("booking.step3"),
      t("booking.step4")
    ];
  }
  function stepHints() {
    return [
      t("booking.step1Hint"),
      t("booking.step2Hint"),
      t("booking.step3Hint"),
      t("booking.step4Hint")
    ];
  }

  function serviceById(id) {
    for (var i = 0; i < SSX.services.length; i++) if (SSX.services[i].id === id) return SSX.services[i];
    return null;
  }

  function durationFor(mins) {
    for (var i = 0; i < SSX.durations.length; i++) if (SSX.durations[i].mins === mins) return SSX.durations[i];
    return SSX.durations[1];
  }

  function money(n) { return SSX.helpers.fmt(n); }

  function calc() {
    var base = state.service ? state.service.price : 0;
    var dur = durationFor(state.duration || 60);
    var durPrice = Math.round(base * dur.factor * 100) / 100;
    var fee = state.mode === "on_site" ? SSX.settings.travelFee : 0;
    return { base: base, durPrice: durPrice, fee: fee, total: Math.round((durPrice + fee) * 100) / 100 };
  }

  function svcName(id) { return SSX.t("svc." + id + ".name"); }

  function init() {
    el.stepper = document.getElementById("stepper");
    el.stepTitle = document.getElementById("step-title");
    el.stepHint = document.getElementById("step-hint");
    el.stepContent = document.getElementById("step-content");
    el.btnNext = document.getElementById("btn-next");
    el.btnPrev = document.getElementById("btn-prev");
    el.summaryBody = document.getElementById("summary-body");

    var svcParam = params.get("service");
    if (svcParam) {
      var svc = serviceById(svcParam);
      if (svc) state.service = svc;
    }

    el.btnNext.addEventListener("click", onNext);
    el.btnPrev.addEventListener("click", onPrev);
    window.addEventListener("ssx:lang", function () { setStep(state.step); });
    setStep(0);
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

  function stepCount() {
    // 4 visible steps: language, situation, date & time, details; payment folds into step 4.
    return 4;
  }

  function onPrev() {
    if (state.step === 0) return;
    setStep(state.step - 1);
  }

  function render() {
    var titles = stepTitles();
    var hints = stepHints();
    el.stepTitle.textContent = titles[state.step];
    el.stepHint.textContent = hints[state.step];
    el.btnNext.textContent = state.step === stepCount() - 1 ? t("booking.confirm") : t("common.continue");
    el.btnNext.disabled = false;
    var content = el.stepContent;
    content.innerHTML = "";
    if (state.step === 0) renderLanguage(content);
    else if (state.step === 1) renderService(content);
    else if (state.step === 2) renderDate(content);
    else renderDetails(content);
    renderSummary();
    if (state.step === 0) content.scrollIntoView({ block: "nearest" });
  }

  function renderLanguage(c) {
    c.innerHTML = '<p class="step-hint" style="margin-bottom:16px;">' + t("booking.languageLabel") + '</p><div class="select-grid"></div>';
    var grid = c.querySelector(".select-grid");
    SSX.languages.forEach(function (lang) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sel-card" + (state.language && state.language.code === lang.code ? " selected" : "");
      b.innerHTML = '<span class="lang-code">' + lang.code + '</span><span>' + SSX.t("lang." + lang.code) + '</span>';
      b.onclick = function () {
        state.language = lang;
        grid.querySelectorAll(".sel-card").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        renderSummary();
      };
      grid.appendChild(b);
    });
  }

  function renderService(c) {
    c.innerHTML = '<p class="step-hint" style="margin-bottom:16px;">' + t("booking.serviceLabel") + '</p><div class="select-grid"></div>';
    var grid = c.querySelector(".select-grid");
    SSX.services.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sel-card" + (state.service && state.service.id === s.id ? " selected" : "");
      b.innerHTML = SSX.icon(s.icon) + '<span>' + svcName(s.id) + '</span>' +
        '<span class="lang-code">' + money(s.price) + '<span style="margin-left:2px;">' + t("price.per30") + '</span></span>';
      b.onclick = function () {
        state.service = s;
        grid.querySelectorAll(".sel-card").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        renderSummary();
      };
      grid.appendChild(b);
    });
  }

  function renderDate(c) {
    var today = new Date();
    var min = today.toISOString().split("T")[0];
    var maxD = new Date(today.getTime() + 60 * 86400000);
    var max = maxD.toISOString().split("T")[0];

    c.innerHTML =
      '<div class="field"><label>' + t("booking.dateLabel") + '</label>' +
      '<input type="date" class="input" id="b-date" min="' + min + '" max="' + max + '" value="' + (state.date || "") + '"></div>' +
      '<div class="field"><label>' + t("booking.timeLabel") + '</label><div class="time-grid" id="b-times"></div></div>' +
      '<div class="field"><label>' + t("booking.durationLabel") + '</label><div class="duration-row" id="b-durs"></div></div>';

    var dateInput = c.querySelector("#b-date");
    var timesEl = c.querySelector("#b-times");
    var dursEl = c.querySelector("#b-durs");

    SSX.durations.forEach(function (d) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dur-pill" + (d.mins === state.duration ? " selected" : "");
      b.innerHTML = d.label + "<small>" + SSX.t(d.noteKey) + "</small>";
      b.onclick = function () {
        state.duration = d.mins;
        dursEl.querySelectorAll(".dur-pill").forEach(function (x) { x.classList.remove("selected"); });
        b.classList.add("selected");
        renderSummary();
      };
      dursEl.appendChild(b);
    });

    function renderTimes() {
      timesEl.innerHTML = "";
      if (!state.date) {
        timesEl.innerHTML = '<p class="muted small">' + t("booking.chooseDateFirst") + '</p>';
        return;
      }
      var isToday = state.date === today.toISOString().split("T")[0];
      var nowHours = today.getHours() + today.getMinutes() / 60;
      SSX.timeSlots.forEach(function (slot) {
        var parts = slot.split(":");
        var h = Number(parts[0]) + Number(parts[1]) / 60;
        var disabled = isToday && h <= nowHours + 1.5;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "time-slot" + (state.time === slot && !disabled ? " selected" : "");
        b.textContent = slot;
        b.disabled = disabled;
        if (!disabled) {
          b.onclick = function () {
            state.time = slot;
            timesEl.querySelectorAll(".time-slot").forEach(function (x) { x.classList.remove("selected"); });
            b.classList.add("selected");
            renderSummary();
          };
        }
        timesEl.appendChild(b);
      });
    }

    dateInput.addEventListener("change", function () {
      var v = dateInput.value;
      if (!v) { state.date = ""; renderTimes(); return; }
      var day = new Date(v + "T00:00:00").getDay();
      if (day === 0) {
        SSX.toast(t("err.sunday"), "error");
        dateInput.value = "";
        state.date = "";
        renderTimes();
        return;
      }
      state.date = v;
      renderTimes();
    });

    renderTimes();
  }

  function renderDetails(c) {
    c.innerHTML =
      '<p class="step-hint" style="margin-bottom:16px;">' + t("booking.modeLabel") + '</p>' +
      '<div class="mode-grid">' +
        '<button type="button" class="mode-card" id="m-video">' +
          '<div class="mode-icon">' + SSX.icon("video") + '</div><h3>' + t("common.video") + '</h3><p>' + t("mode.videoBody") + '</p>' +
          '<div class="mode-addon">' + t("mode.videoFree") + '</div>' +
        '</button>' +
        '<button type="button" class="mode-card" id="m-onsite">' +
          '<div class="mode-icon">' + SSX.icon("map-pin") + '</div><h3>' + t("common.inPerson") + '</h3><p>' + t("mode.siteBody") + '</p>' +
          '<div class="mode-addon">+ ' + money(SSX.settings.travelFee) + " " + t("mode.siteFee") + '</div>' +
        '</button>' +
      '</div>' +
      '<div id="addr-wrap"></div>' +
      '<div class="field" style="margin-top:22px;"><label>' + t("booking.contact") + '</label>' +
        '<div class="two-col">' +
          '<div class="field"><input class="input" id="b-name" placeholder="' + t("booking.firstName") + ' · ' + t("booking.lastName") + '" value="' + SSX.helpers.esc(state.customer) + '"></div>' +
          '<div class="field"><input class="input" id="b-email" type="email" placeholder="' + t("booking.email") + '" value="' + SSX.helpers.esc(state.email) + '"></div>' +
          '<div class="field"><input class="input" id="b-phone" placeholder="' + t("booking.phone") + '" value="' + SSX.helpers.esc(state.phone) + '"></div>' +
        '</div>' +
      '</div>' +
      '<div class="field"><label>' + t("booking.note") + '</label><textarea class="textarea" id="b-notes" placeholder="' + t("booking.notePh") + '">' + SSX.helpers.esc(state.notes) + '</textarea></div>' +
      '<div class="field"><label>' + t("booking.payLabel") + '</label>' +
        '<div class="pay-card" data-m="card"><span class="pay-radio"></span><div><h4>' + t("pay.card") + '</h4><p>' + t("pay.cardBody") + '</p></div></div>' +
        '<div class="pay-card" data-m="twint"><span class="pay-radio"></span><div><h4>TWINT</h4><p>' + t("pay.twintBody") + '</p></div></div>' +
        '<div class="pay-card" data-m="invoice"><span class="pay-radio"></span><div><h4>' + t("pay.invoice") + '</h4><p>' + t("pay.invoiceBody") + '</p></div></div>' +
        '<div id="card-fields" style="margin-top:8px;">' +
          '<div class="field"><label>' + t("pay.cardName") + '</label><input class="input" id="p-name" placeholder="' + t("pay.cardName") + '" value="' + SSX.helpers.esc(state.cardName) + '"></div>' +
          '<div class="field"><label>' + t("pay.cardNumber") + '</label><input class="input" id="p-num" inputmode="numeric" placeholder="4242 4242 4242 4242" value="' + SSX.helpers.esc(state.cardNumber) + '"></div>' +
          '<div class="pay-row">' +
            '<div class="field"><label>' + t("pay.expiry") + '</label><input class="input" id="p-exp" placeholder="MM/YY" value="' + SSX.helpers.esc(state.cardExp) + '"></div>' +
            '<div class="field"><label>CVC</label><input class="input" id="p-cvc" inputmode="numeric" placeholder="123" value="' + SSX.helpers.esc(state.cardCvc) + '"></div>' +
          '</div>' +
        '</div>' +
        '<p class="tiny muted" style="margin-top:6px;">' + SSX.icon("lock") + ' ' + t("booking.simulated") + '</p>' +
      '</div>' +
      '<input type="text" name="company_website" id="b-hp" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">';

    var addrWrap = c.querySelector("#addr-wrap");
    var mVideo = c.querySelector("#m-video");
    var mSite = c.querySelector("#m-onsite");

    function setAddressField(show) {
      addrWrap.innerHTML = "";
      if (!show) return;
      addrWrap.innerHTML =
        '<div class="field"><label>' + t("field.address") + '</label>' +
        '<input class="input" id="b-address" placeholder="' + t("field.addressPh") + '" value="' + SSX.helpers.esc(state.address) + '">' +
        '<div class="error-msg hidden" id="addr-error">' + t("err.address") + '</div></div>';
      var addr = c.querySelector("#b-address");
      if (addr) addr.addEventListener("input", function () { state.address = addr.value; });
    }

    function toggle(m) {
      state.mode = m;
      mVideo.classList.toggle("selected", m === "video");
      mSite.classList.toggle("selected", m === "on_site");
      setAddressField(m === "on_site");
      renderSummary();
    }

    mVideo.onclick = function () { toggle("video"); };
    mSite.onclick = function () { toggle("on_site"); };

    var name = c.querySelector("#b-name");
    var email = c.querySelector("#b-email");
    var phone = c.querySelector("#b-phone");
    var notes = c.querySelector("#b-notes");
    name.addEventListener("input", function () { state.customer = name.value; });
    email.addEventListener("input", function () { state.email = email.value; });
    phone.addEventListener("input", function () { state.phone = phone.value; });
    notes.addEventListener("input", function () { state.notes = notes.value; });

    c.querySelectorAll(".pay-card").forEach(function (cardEl) {
      cardEl.onclick = function () {
        state.method = cardEl.getAttribute("data-m");
        c.querySelectorAll(".pay-card").forEach(function (x) { x.classList.remove("selected"); });
        cardEl.classList.add("selected");
        c.querySelector("#card-fields").style.display = state.method === "card" ? "" : "none";
        renderSummary();
      };
    });
    c.querySelector("#card-fields").style.display = state.method === "card" ? "" : "none";

    var pname = c.querySelector("#p-name");
    var pnum = c.querySelector("#p-num");
    var pexp = c.querySelector("#p-exp");
    var pcvc = c.querySelector("#p-cvc");
    pname.addEventListener("input", function () { state.cardName = pname.value; });
    pnum.addEventListener("input", function () { state.cardNumber = pnum.value; });
    pexp.addEventListener("input", function () { state.cardExp = pexp.value; });
    pcvc.addEventListener("input", function () { state.cardCvc = pcvc.value; });

    toggle(state.mode || "video");
  }

  function renderSummary() {
    var body = el.summaryBody;
    body.innerHTML = "";
    if (!state.service && !state.language && !state.date) {
      body.innerHTML = '<div class="sum-empty">' + t("summary.empty") + '</div>';
      return;
    }
    function line(label, value) {
      var d = document.createElement("div");
      d.className = "sum-line";
      d.innerHTML = '<span>' + label + '</span><b>' + value + '</b>';
      body.appendChild(d);
    }
    if (state.service) line(t("booking.serviceLabel"), svcName(state.service.id));
    if (state.language) line(t("booking.languageLabel"), SSX.t("lang." + state.language.code));
    if (state.date) line(t("booking.dateLabel"), SSX.helpers.dateLabel(state.date));
    if (state.time) line(t("booking.timeLabel"), state.time + " · " + durationFor(state.duration).label);
    if (state.mode) line(t("booking.modeLabel"), state.mode === "video" ? t("common.video") : t("common.inPerson"));
    var c = calc();
    line(t("interpreting.rate") + " · " + durationFor(state.duration).label, money(c.durPrice));
    if (c.fee) line(t("booking.travel"), money(c.fee));
    var total = document.createElement("div");
    total.className = "sum-total";
    total.innerHTML = '<span>' + t("booking.total") + '</span><b>' + money(c.total) + '</b>';
    body.appendChild(total);
  }

  function validate() {
    var msg = "";
    if (state.step === 0 && !state.language) msg = t("err.language");
    else if (state.step === 1 && !state.service) msg = t("err.service");
    else if (state.step === 2) {
      if (!state.date) msg = t("err.date");
      else if (!state.time) msg = t("err.time");
    } else if (state.step === 3) {
      if (!state.mode) msg = t("err.mode");
      else if (state.mode === "on_site" && !state.address.trim()) msg = t("err.address");
      if (!msg && !state.customer.trim()) msg = t("err.name");
      if (!msg && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email)) msg = t("err.email");
      if (!msg && state.method === "card") {
        if (!state.cardName.trim()) msg = t("err.cardName");
        else if (state.cardNumber.replace(/\s/g, "").length < 12) msg = t("err.cardNumber");
        else if (!/^\d{2}\s?\/\s?\d{2}$/.test(state.cardExp)) msg = t("err.cardExp");
        else if (state.cardCvc.length < 3) msg = t("err.cvc");
      }
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

    var c = calc();

    var finish = function (booking) {
      booking.duration_price = c.durPrice;
      booking.fee = c.fee;
      booking.base_price = c.base;
      booking.total = c.total;
      booking.status = booking.status || "pending";
      var list = SSX.bookingsLocal();
      list.push(booking);
      SSX.saveLocal("ssx.bookings", list);
      SSX.saveLocal("ssx.lastRef", booking.ref);
      window.location.href = "confirmation.html?ref=" + encodeURIComponent(booking.ref);
    };

    var done = function () {
      state.submitting = false;
      el.btnNext.disabled = false;
      el.btnNext.textContent = t("booking.confirm");
    };

    if (SSX.http) {
      SSX.request("POST", "/api/bookings", {
        language_code: state.language.code,
        service_id: state.service.id,
        date: state.date,
        time: state.time,
        duration: state.duration,
        mode: state.mode,
        address: state.address,
        customer: state.customer,
        email: state.email,
        phone: state.phone,
        notes: state.notes,
        method: state.method,
        company_website: document.querySelector("#b-hp") ? document.querySelector("#b-hp").value : ""
      }).then(function (res) {
        finish({
          ref: res.ref,
          service_name: res.service,
          language_name: res.language,
          date: res.date,
          time: res.time,
          duration: res.duration,
          mode: res.mode,
          method: res.method,
          status: res.status || "pending"
        });
      }).catch(function (err) {
        done();
        SSX.toast(err.message || t("err.general"), "error");
      });
    } else {
      setTimeout(function () {
        finish({
          ref: SSX.ref("SSX"),
          service_name: svcName(state.service.id),
          language_name: SSX.t("lang." + state.language.code),
          date: state.date,
          time: state.time,
          duration: state.duration,
          mode: state.mode,
          method: state.method
        });
      }, 600);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();