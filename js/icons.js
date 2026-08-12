window.SSX = window.SSX || {};

// Premium stroke-icon set — inline SVG, no dependencies, no emoji.
// All icons: viewBox "0 0 24 24", stroke currentColor, 1.7px, round caps.
var SSX__ICONS = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  'arrow-up-right': '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 1 0 20 14.5 14.5 0 0 1 0-20z"/><path d="M2.5 12h19"/>',
  translate: '<path d="M5 8h14"/><path d="M12 3v5"/><path d="M8 8c1.6 3.2 4.4 5.5 8.3 6.5"/><path d="M16 8c-1.6 3.2-4.4 5.5-8.3 6.5"/><path d="M12 17.5V21"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><circle cx="17" cy="8" r="3"/><path d="M22 19v-.5a3.5 3.5 0 0 0-5-3.2"/>',
  star: '<path d="M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9-5.5 2.9 1-6.1L3 9.5l6.3-.9z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  shield: '<path d="M12 2l8 4v6c0 5.2-3.4 8.4-8 10-4.6-1.6-8-4.8-8-10V6l8-4z"/>',
  'shield-check': '<path d="M12 2l8 4v6c0 5.2-3.4 8.4-8 10-4.6-1.6-8-4.8-8-10V6l8-4z"/><path d="m9 12 2 2 4-4"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21.3l8.8-8.9a5.5 5.5 0 0 0 0-7.8z"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 20h16"/>',
  'id-card': '<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M5 16a3 3 0 0 1 6 0"/><path d="M15 9h4M15 13h4"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2"/>',
  landmark: '<path d="M3 21h18"/><path d="M7 21v-7M12 21v-7M17 21v-7"/><path d="M2 11l10-7 10 7"/><path d="M4 9V5l8-3.5L20 5v4"/>',
  school: '<path d="M12 3 2 8l10 5 10-5-10-5z"/><path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 8v6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  banknote: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  phone: '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 8.02v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22.05 18.06z"/>',
  'phone-call': '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1.9 9.8v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 18.06z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  video: '<rect x="2" y="6" width="12" height="12" rx="2"/><path d="m14 10 8-4v12l-8-4z"/>',
  'map-pin': '<path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.5c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  planeTake: '<path d="M2 11h16"/><path d="M12 7l8 4-8 4"/><path d="m18.5 10.5 2-1 1.5 2.5-2 1v2"/>',
  train: '<rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 11h16"/><path d="m8 22 2-6M16 22l-2-6"/><path d="M9 15h.01M15 15h.01"/>',
  book: '<path d="M5 3a2 2 0 0 1 2-2h12v20H7a2 2 0 0 1-2-2z"/><path d="M5 21V5a2 2 0 0 1 2-2h0"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  bed: '<path d="M2 18v-7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7"/><path d="M2 18v2M22 18v2"/><path d="M18 12V9.5a1.5 1.5 0 0 0-3 0V12M8 12V9.5a1.5 1.5 0 0 0-3 0V12"/>',
  'id': '<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M5.5 16a2.5 2.5 0 0 1 5 0"/><path d="M15 9h4M15 13h4"/>',
  umbrella: '<path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z"/><path d="M12 12v7a2 2 0 0 0 4 0"/>',
  'scale': '<path d="M12 3v18"/><path d="M6 7h12"/><path d="m7 10-2 7"/><path d="m17 10-2 7"/><path d="M3 21h18"/><path d="M10 21v-4M14 21v-4"/>',
  'government': '<path d="M3 21h18"/><path d="M7 21v-8M12 21v-8M17 21v-8"/><path d="M4 13 12 6l8 7"/><path d="M4 8V5L12 2l8 3v3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/>',
  sparkles: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4"/><path d="M12 17h.01"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 3v5h-5"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  'credit-card': '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>',
  printer: '<path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  wallet: '<path d="M20 7H5a2 2 0 0 1 0-4h14v4"/><path d="M21 7v14H5a2 2 0 0 1-2-2V5"/><path d="M16 13h.01"/>',
  'download': '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19h16"/>',
  'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m8.5 12 2.5 2.5 5-5"/>',
  'coffee': '<path d="M17 8h1a3 3 0 0 1 0 6h-1"/><path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  'handshake': '<path d="M11 17 2 8"/><path d="m13 17 9-9"/><path d="M4 12 2 7l5 1"/><path d="m20 12 2-5-5 1"/>',
  'dot': '<circle cx="12" cy="12" r="5"/>',
  whatsapp: '<path fill="currentColor" stroke="none" d="M12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.56.93.95-3.47-.22-.35a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 9.42 9.43c0 5.2-4.23 9.43-9.44 9.43M20.5 3.49A11.3 11.3 0 0 0 12.04.75C5.84.75.8 5.79.8 11.99c0 1.98.52 3.92 1.5 5.63L.75 23.25l5.75-1.51a11.3 11.3 0 0 0 5.54 1.41h.01c6.19 0 11.24-5.04 11.24-11.24 0-3-1.17-5.83-3.29-7.96z"/>',
  instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M16.2 3a4.8 4.8 0 0 0 3.8 4.7"/><path d="M16.2 3v11a4.2 4.2 0 1 1-4.2-4.2"/><path d="M12 9.8v2.4a2 2 0 1 0 2 2v-8.3"/>',
  facebook: '<path fill="currentColor" stroke="none" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>',
  linkedin: '<path fill="currentColor" stroke="none" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>'
};

// Build helper
function ssxIcon(name, size) {
  var inner = SSX__ICONS[name];
  if (!inner) inner = SSX__ICONS["help"];
  var w = size ? (' width="' + size + '" height="' + size + '"') : "";
  return '<svg class="sv sv-' + name + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"' + w + ' aria-hidden="true" focusable="false">' + inner + '</svg>';
}

// Register on the shared global so pages + icon replace can use it
SSX.icon = ssxIcon;
SSX.icons = {
  list: function () { return Object.keys(SSX__ICONS); }
};