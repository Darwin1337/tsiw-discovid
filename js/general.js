// Custom select

let buttons = document.querySelectorAll(".select-button");
let datalists = document.querySelectorAll('.select-datalist');
let inputs = document.querySelectorAll(".select-input");
let selects = document.querySelector('select');
let options = select.options;

for (button of buttons) {
  button.addEventListener('click', function(event) {
    let slctType = button.classList[1];
    let slctDatalist = DiscoverDatalist(slctType);

    if (slctDatalist != null || slctDatalist != undefined) {
      if (slctDatalist.style.display === '') {
        slctDatalist.style.display = 'block';
        this.textContent = "▲";

        /* If input already has a value, select that option from DDL */
        let val = DiscoverInput(slctType).value;
        for (var i = 0; i < options.length; i++) {
          if (options[i].text === val) {
            select.selectedIndex = i;
            break;
          }
        }
      } else hide_select();
    }

  });
}

function toggle_ddl(which) {
  console.log("dsads " + which)
  // if (datalist.style.display === '') {
  //   datalist.style.display = 'block';
  //   this.textContent = "▲";
  //   /* If input already has a value, select that option from DDL */
  //   var val = input.value;
  //   for (var i = 0; i < options.length; i++) {
  //     if (options[i].text === val) {
  //       select.selectedIndex = i;
  //       break;
  //     }
  //   }
  // } else hide_select();
}

/* when user selects an option from DDL, write it to text field */
// select.addEventListener('change', fill_input);
//
// function fill_input() {
//   input.value = options[this.selectedIndex].value;
//   hide_select();
// }

/* when user wants to type in text field, hide DDL */

for (input of inputs) {
  input.addEventListener("focus", function(event) {
    let dtlist = DiscoverDatalist(input.classList[1]);
    let dtbutton = DiscoverButton(input.classList[1]);
    dtlist.style.display = "";
    dtbutton.textContent = "▼";
  });
}

function DiscoverDatalist(class_) {
  let resultDatalist = null;
  for (datalist of datalists) {
    for (let i = 0; i < datalist.classList.length; i++) {
      if (class_ == datalist.classList[i]) {
        resultDatalist = datalist;
        break;
      }
    }
  }
  return resultDatalist;
}

function DiscoverButton(class_) {
  let resultButton = null;

  for (button of buttons) {
    for (let i = 0; i < button.classList.length; i++) {
      if (class_ == button.classList[i]) {
        resultButton = button;
        break;
      }
    }
  }
  return resultButton;
}

function DiscoverInput(class_) {
  let resultInput = null;

  for (input of inputs) {
    for (let i = 0; i < input.classList.length; i++) {
      if (class_ == input.classList[i]) {
        resultInput = input;
        break;
      }
    }
  }
  return resultInput;
}
