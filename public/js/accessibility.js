/* global $ */
/* global document*/

function restoreFocus() {
  const intr = $('.intro-page');
  const hideable = $('.hideOnSignModal');
  if (intr.length === 0) intr.attr('aria-hidden', 'false');
  hideable.attr('aria-hidden', 'false');
}

function trapTabKey(e, firstTabStop, lastTabStop, closeModal) {
  if (e.keyCode === 9) {
    if (e.shiftKey) {
      if (document.activeElement === firstTabStop[0]) {
        e.preventDefault();
        lastTabStop.focus();
      }
    } else if (document.activeElement === lastTabStop[0]) {
      e.preventDefault();
      firstTabStop.focus();
    }
  }
  if (e.keyCode === 27) {
    closeModal.click();
  }
  if (e.keyCode === 13) {
    restoreFocus();
  }
}

function addButtonBehaviour(component) {
  if (component) {
    component.keypress((e) => {
      if (e.which === 13 || e.which === 32) {
        component.click();
      }
    });
    component.attr('tabindex', '0');
  }
}

function removeFocus() {
  const intr = $('.intro-page');
  const hideable = $('.hideOnSignModal');
  if (intr.length === 0) intr.attr('aria-hidden', 'true');
  hideable.attr('aria-hidden', 'true');
  // Agregar el focus trap
}

$('#accounts-wrapper').bind('DOMNodeInserted', () => {
  const userIn = $('#login-username');
  let signModalToggle = $('#login-sign-in-link');
  const close = $('a.login-close-text');
  const modal = $('#login-dropdown-list');
  const signInButton = $('div.login-button-form-submit');
  const change = $('a.additional-link');
  const changePass = $('#login-buttons-open-change-password');
  const signOut = $('#login-buttons-logout');
  const chPassBtn = $('#login-buttons-do-change-password');
  const oldPass = $('#login-old-password');
  if (signModalToggle.length === 0) signModalToggle = $('#login-name-link');
  if (userIn.length !== 0) {
    userIn.focus();
  }
  if (changePass.length !== 0) {
    changePass.focus();
  }
  if (oldPass.length !== 0) {
    oldPass.focus();
  }
  if (signModalToggle.length !== 0) {
    signModalToggle.attr('aria-hidden', 'false');
    signModalToggle.click(() => { removeFocus(); });
  }
  if (modal.length !== 0) {
    let lastTabStop = change;
    if (signOut.length !== 0) {
      lastTabStop = signOut;
    } else if (chPassBtn.length !== 0) {
      lastTabStop = chPassBtn;
    }
    modal.attr('tabindex', '0');
    modal.attr('aria-label', 'sign up or login');
    modal.attr('aria-hidden', 'false');
    modal.attr('role', 'dialog');
    if ($('#overlay').length === 0) {
      $('<div id=\'overlay\'class=\'modal-overlay\'></div>').insertAfter(modal);
      $('#overlay').click(() => { close.click(); });
    }
    modal.keydown((e) => { trapTabKey(e, close, lastTabStop, close); });
    if (signModalToggle.length !== 0) {
      signModalToggle.attr('aria-hidden', 'true');
    }
    removeFocus();
  } else {
    signModalToggle.focus();
    restoreFocus();
  }
  if (close.length !== 0) {
    close.click(() => {
      $('#overlay').remove();
      restoreFocus();
    });
  }
  addButtonBehaviour(signModalToggle);
  addButtonBehaviour(close);
  addButtonBehaviour(signInButton);
  addButtonBehaviour(change);
  addButtonBehaviour(changePass);
  addButtonBehaviour(signOut);
  addButtonBehaviour(chPassBtn);
});
