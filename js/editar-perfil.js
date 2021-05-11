$(".btn-pills").click(function(event) {
  for (let i = 0; i < $(".btn-pills").length; i++) {
    if ($(".btn-pills")[i] != event.target) {
      if ($(".btn-pills")[i].classList.contains("active-tab")) {
        $(".btn-pills")[i].classList.remove("active-tab");
      }
      if (!$(".btn-pills")[i].classList.contains("unactive-tab")) {
        $(".btn-pills")[i].classList.add("unactive-tab");
      }
    }
  }
  event.target.classList.remove("unactive-tab");
  event.target.classList.add("active-tab");
});
