// Copyright 2021 Splunk Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const defaultSelectedValues = ["base-event", "reserved", "classification", "context", "occurrence", "origination", "primary"];
const selectAttributes = "#attributes-select";
const storageKey = "selected-attributes"

function hide(name) {
  $(name).addClass('d-none');
}

function show(name) {
  $(name).removeClass('d-none');
}

function enable_option(name) {
  $(name).removeAttr('disabled');
}

function show_select_attributes(list) {
  show(selectAttributes);
}

function init_select() {
  let selected;
  if (window.localStorage.getItem(storageKey) == null) {
    selected = defaultSelectedValues;
    window.localStorage.setItem(storageKey, selected);
  } else {
    const data = window.localStorage.getItem(storageKey);
    if (data.length > 0)
      selected = data.split(",");
    else
      selected = [];
  }

  init_select_picker($(selectAttributes), selected);

  display_attributes(array_to_set(selected));
}

function init_select_picker(selection, selected) {
  selection.selectpicker();
  selection.selectpicker('val', selected);
  selection.on('changed.bs.select', function (e, clickedIndex, isSelected, oldValues) {
    const values = [];

    for (let i = 0; i < this.length; i++) {
      if (this[i].selected)
        values.push(this[i].value);
      else
        hideAll = true;
    }
    window.localStorage.setItem(storageKey, values);
    display_attributes(new Set(values));
  });
}

function display_attributes(options) {
  const table = document.getElementById('data-table');

  if (table != null) {
    // add classes that are always shown
    options.add("event");
    options.add("conclusion");
    options.add("required");
    options.add("recommended");
    options.add("no-group");

    const rows = table.rows;
    const length = rows.length;

    for (let i = 1; i < length; i++) {
      const classList = rows[i].classList;
      const delta = intersection(array_to_set(classList), options);

      display_row(delta, classList);
    }
  }
}

function array_to_set(a) {
  return new Set(a);
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function display_row(set, classList) {
  if (set.size == 3)
    classList.remove('d-none');
  else
    classList.add('d-none');
}

/* Table search function */
function searchInTable() {
  const input = document.getElementById("tableSearch");
  const filter = input.value.toUpperCase();
  const tbody = document.getElementsByClassName("searchable");

  for (let t = 0; t < tbody.length; t++) {
    let tr = tbody[t].children;

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      const row = tr[i];
      const children = row.children;
      let hide = true;
      if (children.length > 2) {
        for (let j = 0; hide && j < children.length - 1; j++) {
          const value = children[j].innerText;
          hide = value.toUpperCase().indexOf(filter) < 0;
        }
      }
      else {
        const value = children[0].innerText;
        hide = value.toUpperCase().indexOf(filter) < 0;
      }

      if (hide)
        row.style.display = "none";
      else
        row.style.display = "";
    }
  }
}
