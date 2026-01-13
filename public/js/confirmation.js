document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".confirm-action");

  forms.forEach(form => {
    form.addEventListener("submit", event => {
      const confirmed = confirm(
        "Are you sure?"
      );

      if (!confirmed) {
        event.preventDefault();
      }
    });
  });
});
