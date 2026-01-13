document.addEventListener("DOMContentLoaded", () => {
  const deleteForms = document.querySelectorAll(".confirm-delete");

  deleteForms.forEach(form => {
    form.addEventListener("submit", event => {
      const confirmed = confirm(
        "Are you sure you want to proceed? This action cannot be undone."
      );

      if (!confirmed) {
        event.preventDefault();
      }
    });
  });
});
